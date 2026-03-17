import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getCookie, setCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import type {
  Bindings,
  Variables,
  Category,
  Role,
  CoupleRow,
  SessionRow,
  EventWithCreatorRole,
} from './types';

type AppEnv = { Bindings: Bindings; Variables: Variables };
const app = new Hono<AppEnv>();

// ────────────────────────────────────────────
// CORS（フロント開発サーバー + 本番 Pages URL）
// ────────────────────────────────────────────
app.use(
  '/*',
  cors({
    origin: ['http://localhost:5173', 'https://hinami.pages.dev'],
    allowHeaders: ['Content-Type'],
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);

// ────────────────────────────────────────────
// ユーティリティ
// ────────────────────────────────────────────

function generateToken(bytes = 8): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
}

const SESSION_COOKIE = 'session_id';
const SESSION_TTL = 60 * 60 * 24 * 365; // 1 年（秒）

/** mine ↔ partner を反転（together はそのまま） */
function resolveCategory(
  category: Category,
  creatorRole: Role,
  viewerRole: Role,
): Category {
  if (category === 'together') return 'together';
  if (creatorRole === viewerRole) return category;
  return category === 'mine' ? 'partner' : 'mine';
}

// ────────────────────────────────────────────
// セッション認証ミドルウェア
// ────────────────────────────────────────────

const requireSession = createMiddleware<AppEnv>(async (c, next) => {
  const sessionId = getCookie(c, SESSION_COOKIE);
  if (!sessionId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const now = Math.floor(Date.now() / 1000);
  const session = await c.env.DB.prepare(
    'SELECT * FROM sessions WHERE id = ? AND expires_at > ?',
  )
    .bind(sessionId, now)
    .first<SessionRow>();
  if (!session) {
    return c.json({ error: 'Session expired or invalid' }, 401);
  }
  c.set('session', session);
  await next();
});

// ────────────────────────────────────────────
// POST /couples  — カップル作成
// ────────────────────────────────────────────

app.post('/couples', async (c) => {
  const db = c.env.DB;
  const now = Math.floor(Date.now() / 1000);
  const coupleId = crypto.randomUUID();
  const inviteToken = generateToken(8); // 16文字 hex
  const sessionId = crypto.randomUUID();
  const expiresAt = now + SESSION_TTL;

  await db
    .prepare('INSERT INTO couples (id, token, created_at) VALUES (?, ?, ?)')
    .bind(coupleId, inviteToken, now)
    .run();

  await db
    .prepare(
      'INSERT INTO sessions (id, couple_id, role, created_at, expires_at) VALUES (?, ?, ?, ?, ?)',
    )
    .bind(sessionId, coupleId, 'creator', now, expiresAt)
    .run();

  setCookie(c, SESSION_COOKIE, sessionId, {
    httpOnly: true,
    path: '/',
    maxAge: SESSION_TTL,
    sameSite: 'Lax',
  });

  const base = new URL(c.req.url).origin;
  return c.json(
    { couple_id: coupleId, invite_token: inviteToken, invite_url: `${base}/couples/join/${inviteToken}` },
    201,
  );
});

// ────────────────────────────────────────────
// POST /couples/join/:token  — 招待リンクで参加
// ────────────────────────────────────────────

app.post('/couples/join/:token', async (c) => {
  const db = c.env.DB;
  const token = c.req.param('token');
  const now = Math.floor(Date.now() / 1000);

  const couple = await db
    .prepare('SELECT * FROM couples WHERE token = ?')
    .bind(token)
    .first<CoupleRow>();
  if (!couple) {
    return c.json({ error: 'Invalid invite token' }, 404);
  }

  // パートナーセッションがすでに存在する場合は再発行
  const existing = await db
    .prepare(
      "SELECT * FROM sessions WHERE couple_id = ? AND role = 'partner' AND expires_at > ?",
    )
    .bind(couple.id, now)
    .first<SessionRow>();
  if (existing) {
    setCookie(c, SESSION_COOKIE, existing.id, {
      httpOnly: true,
      path: '/',
      maxAge: SESSION_TTL,
      sameSite: 'Lax',
    });
    return c.json({ couple_id: couple.id });
  }

  const sessionId = crypto.randomUUID();
  const expiresAt = now + SESSION_TTL;

  await db
    .prepare(
      'INSERT INTO sessions (id, couple_id, role, created_at, expires_at) VALUES (?, ?, ?, ?, ?)',
    )
    .bind(sessionId, couple.id, 'partner', now, expiresAt)
    .run();

  setCookie(c, SESSION_COOKIE, sessionId, {
    httpOnly: true,
    path: '/',
    maxAge: SESSION_TTL,
    sameSite: 'Lax',
  });
  return c.json({ couple_id: couple.id }, 201);
});

// ────────────────────────────────────────────
// GET /couples/me  — 自分のカップル情報
// ────────────────────────────────────────────

app.get('/couples/me', requireSession, async (c) => {
  const session = c.get('session');
  const couple = await c.env.DB.prepare('SELECT * FROM couples WHERE id = ?')
    .bind(session.couple_id)
    .first<CoupleRow>();
  if (!couple) {
    return c.json({ error: 'Couple not found' }, 404);
  }
  return c.json({
    couple_id: couple.id,
    role: session.role,
    invite_token: session.role === 'creator' ? couple.token : undefined,
  });
});

// ────────────────────────────────────────────
// GET /events?month=YYYY-M  — 月別イベント一覧
// ────────────────────────────────────────────

app.get('/events', requireSession, async (c) => {
  const session = c.get('session');
  const month = c.req.query('month');
  if (!month || !/^\d{4}-\d{1,2}$/.test(month)) {
    return c.json({ error: 'month parameter required (YYYY-M)' }, 400);
  }

  const { results } = await c.env.DB.prepare(
    `SELECT e.*, s.role AS creator_role
     FROM events e
     JOIN sessions s ON s.id = e.session_id
     WHERE e.couple_id = ? AND e.date LIKE ?
     ORDER BY e.date, e.start_time`,
  )
    .bind(session.couple_id, `${month}-%`)
    .all<EventWithCreatorRole>();

  const events = results.map((row) => ({
    id: row.id,
    title: row.title,
    category: resolveCategory(row.category, row.creator_role, session.role),
    date: row.date,
    start_time: row.start_time,
    end_time: row.end_time,
    is_mine: row.session_id === session.id,
  }));

  return c.json({ events });
});

// ────────────────────────────────────────────
// POST /events  — イベント作成
// ────────────────────────────────────────────

app.post('/events', requireSession, async (c) => {
  const session = c.get('session');
  const body = await c.req.json<{
    title: string;
    category: string;
    date: string;
    start_time?: string;
    end_time?: string;
  }>();

  const { title, category, date, start_time, end_time } = body;
  if (!title || !category || !date) {
    return c.json({ error: 'title, category, date are required' }, 400);
  }
  if (!['mine', 'partner', 'together'].includes(category)) {
    return c.json({ error: 'Invalid category' }, 400);
  }

  const now = Math.floor(Date.now() / 1000);
  const id = crypto.randomUUID();

  await c.env.DB.prepare(
    `INSERT INTO events
       (id, couple_id, session_id, title, category, date, start_time, end_time, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, session.couple_id, session.id, title, category, date, start_time ?? null, end_time ?? null, now, now)
    .run();

  return c.json(
    { id, title, category, date, start_time: start_time ?? null, end_time: end_time ?? null },
    201,
  );
});

// ────────────────────────────────────────────
// PATCH /events/:id  — イベント更新
// ────────────────────────────────────────────

app.patch('/events/:id', requireSession, async (c) => {
  const session = c.get('session');
  const eventId = c.req.param('id');
  const now = Math.floor(Date.now() / 1000);

  const existing = await c.env.DB.prepare(
    'SELECT id FROM events WHERE id = ? AND couple_id = ?',
  )
    .bind(eventId, session.couple_id)
    .first();
  if (!existing) {
    return c.json({ error: 'Event not found' }, 404);
  }

  const body = await c.req.json<{
    title?: string;
    category?: string;
    date?: string;
    start_time?: string | null;
    end_time?: string | null;
  }>();

  const fields: string[] = [];
  const values: unknown[] = [];

  if (body.title !== undefined) {
    fields.push('title = ?');
    values.push(body.title);
  }
  if (body.category !== undefined) {
    if (!['mine', 'partner', 'together'].includes(body.category)) {
      return c.json({ error: 'Invalid category' }, 400);
    }
    fields.push('category = ?');
    values.push(body.category);
  }
  if (body.date !== undefined) {
    fields.push('date = ?');
    values.push(body.date);
  }
  if ('start_time' in body) {
    fields.push('start_time = ?');
    values.push(body.start_time ?? null);
  }
  if ('end_time' in body) {
    fields.push('end_time = ?');
    values.push(body.end_time ?? null);
  }

  if (fields.length === 0) {
    return c.json({ error: 'No fields to update' }, 400);
  }

  fields.push('updated_at = ?');
  values.push(now, eventId, session.couple_id);

  await c.env.DB.prepare(
    `UPDATE events SET ${fields.join(', ')} WHERE id = ? AND couple_id = ?`,
  )
    .bind(...values)
    .run();

  return c.json({ id: eventId });
});

// ────────────────────────────────────────────
// DELETE /events/:id  — イベント削除
// ────────────────────────────────────────────

app.delete('/events/:id', requireSession, async (c) => {
  const session = c.get('session');
  const eventId = c.req.param('id');

  const result = await c.env.DB.prepare(
    'DELETE FROM events WHERE id = ? AND couple_id = ?',
  )
    .bind(eventId, session.couple_id)
    .run();

  if (result.meta.changes === 0) {
    return c.json({ error: 'Event not found' }, 404);
  }

  return c.json({ id: eventId });
});

export default app;
