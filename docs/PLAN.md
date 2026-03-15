# hinami 実装計画

## 概要

カップル向けカレンダーアプリ `hinami` をフロントエンドのみのプロトタイプから、バックエンドを持つ本格的なMVPに移行する。

## 技術選定

| 領域 | 技術 |
|------|------|
| Frontend | React 19 + Vite 7 + TypeScript 5 |
| API | Hono + Cloudflare Workers |
| DB | Cloudflare D1（SQLite互換） |
| 認証 | Magic Links（メールアドレスのみ、パスワードなし） |
| メール | Resend（または互換サービス、抽象化して差し替え可能） |
| ペアリング | 招待リンク（トークンベース） |
| デプロイ | Cloudflare Pages（フロント）+ Workers（API） |

## monorepo 構成

```
hinami/
├── apps/
│   └── web/          # React フロントエンド（既存）
├── packages/
│   ├── api/          # Hono + Cloudflare Workers
│   └── shared/       # 共有型定義・バリデーション
├── package.json      # npm workspaces ルート
└── docs/
```

## DBスキーマ（Cloudflare D1）

```sql
CREATE TABLE users (
  id         TEXT PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  name       TEXT,
  couple_id  TEXT REFERENCES couples(id),
  created_at INTEGER NOT NULL
);

CREATE TABLE couples (
  id         TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL
);

CREATE TABLE invitations (
  id         TEXT PRIMARY KEY,
  couple_id  TEXT NOT NULL REFERENCES couples(id),
  token      TEXT UNIQUE NOT NULL,
  used_at    INTEGER,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE magic_tokens (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL,
  token      TEXT UNIQUE NOT NULL,
  used_at    INTEGER,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE sessions (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id),
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE events (
  id         TEXT PRIMARY KEY,
  couple_id  TEXT NOT NULL REFERENCES couples(id),
  creator_id TEXT NOT NULL REFERENCES users(id),
  title      TEXT NOT NULL,
  category   TEXT NOT NULL CHECK(category IN ('mine', 'partner', 'together')),
  date       TEXT NOT NULL,  -- "YYYY-M-D"
  start_time TEXT,           -- "HH:mm" or NULL
  end_time   TEXT,           -- "HH:mm" or NULL
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_events_couple_date ON events(couple_id, date);
```

## APIエンドポイント

### 認証
| Method | Path | 説明 |
|--------|------|------|
| POST | `/auth/magic-link` | メール送信（magic link発行） |
| GET | `/auth/verify` | トークン検証・セッション発行 |
| POST | `/auth/logout` | セッション削除 |

### ユーザー
| Method | Path | 説明 |
|--------|------|------|
| GET | `/me` | 自分のプロフィール取得 |
| PATCH | `/me` | 名前更新 |

### カップル
| Method | Path | 説明 |
|--------|------|------|
| POST | `/couples/invite` | 招待トークン生成 |
| POST | `/couples/join/:token` | 招待トークンで参加 |
| GET | `/couples/me` | カップル情報取得 |

### イベント
| Method | Path | 説明 |
|--------|------|------|
| GET | `/events?month=YYYY-M` | 月別イベント一覧 |
| POST | `/events` | イベント作成 |
| PATCH | `/events/:id` | イベント更新 |
| DELETE | `/events/:id` | イベント削除 |

## フロントエンド変更

- **状態管理**: ローカルstateからAPIベースへ移行
- **ルーティング**: React Router導入（ログイン画面、カレンダー画面）
- **モーダル**: イベント編集・削除UI追加
- **PWA**: manifest.json + Service Worker（オフラインキャッシュ）

## 実装フェーズ

### Phase 1: API基盤 + DB
- `packages/api` セットアップ（Hono + Wrangler）
- `packages/shared` 共有型定義
- D1スキーマ作成・マイグレーション
- イベントCRUD API実装

### Phase 2: 認証
- Magic link発行・検証
- セッション管理（Cookie）
- メールサービス抽象化

### Phase 3: ペアリング
- カップル作成フロー
- 招待リンク生成・消費
- カテゴリロジック（mine/partner/together の向き）

### Phase 4: フロントエンド統合
- React Router導入
- ログイン画面実装
- APIクライアント実装（fetch wrapper）
- イベント編集・削除UI

### Phase 5: PWA + 仕上げ
- manifest.json
- Service Worker（オフラインサポート）
- Cloudflare Pages + Workers デプロイ設定
- E2Eテスト

## ローカル開発

```bash
# フロントエンド
npm run dev

# API（Wrangler）
cd packages/api && npx wrangler dev

# D1ローカルDB
npx wrangler d1 execute hinami-db --local --file=schema.sql
```
