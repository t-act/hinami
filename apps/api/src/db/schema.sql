CREATE TABLE IF NOT EXISTS couples (
  id         TEXT PRIMARY KEY,
  token      TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  couple_id  TEXT NOT NULL REFERENCES couples(id),
  role       TEXT NOT NULL CHECK(role IN ('creator', 'partner')),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id         TEXT PRIMARY KEY,
  couple_id  TEXT NOT NULL REFERENCES couples(id),
  session_id TEXT NOT NULL REFERENCES sessions(id),
  title      TEXT NOT NULL,
  category   TEXT NOT NULL CHECK(category IN ('mine', 'partner', 'together')),
  date       TEXT NOT NULL,
  start_time TEXT,
  end_time   TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_couple_date ON events(couple_id, date);
