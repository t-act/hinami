# 実装タスク

## Phase 1: API基盤 + DB

### packages/api セットアップ
- [ ] `packages/api` ディレクトリ作成・`package.json` 初期化
- [ ] Hono + Wrangler インストール
- [ ] `wrangler.toml` 設定（D1バインディング）
- [ ] `packages/api/src/index.ts` エントリポイント作成

### packages/shared セットアップ
- [ ] `packages/shared` ディレクトリ作成
- [ ] 共有型定義（`CalendarEvent`, `Category`, APIリクエスト/レスポンス型）
- [ ] `apps/web` の既存型を `packages/shared` に移行

### DB
- [ ] D1スキーマ（`schema.sql`）作成
- [ ] ローカルD1初期化（`wrangler d1 execute --local`）
- [ ] マイグレーション管理方針決定

### イベントCRUD API
- [ ] `GET /events?month=YYYY-M` 実装
- [ ] `POST /events` 実装
- [ ] `PATCH /events/:id` 実装
- [ ] `DELETE /events/:id` 実装
- [ ] couple_idスコープによるアクセス制御

---

## Phase 2: 認証

### Magic Link
- [ ] `POST /auth/magic-link` — トークン生成・メール送信
- [ ] `GET /auth/verify` — トークン検証・セッション発行
- [ ] `POST /auth/logout` — セッション削除

### セッション管理
- [ ] セッションCookie発行（HttpOnly, Secure, SameSite=Lax）
- [ ] ミドルウェアで認証チェック
- [ ] セッション有効期限（30日）

### メールサービス
- [ ] メール送信インターフェース定義（抽象化）
- [ ] Resend（または開発用ログ出力）実装
- [ ] Magic Linkテンプレート作成

---

## Phase 3: ペアリング

### カップルAPI
- [ ] `POST /couples/invite` — 招待トークン生成
- [ ] `POST /couples/join/:token` — 招待受諾・カップル紐付け
- [ ] `GET /couples/me` — カップル情報取得

### ロジック
- [ ] カップル未参加ユーザーのAPIアクセス制限
- [ ] mine/partner カテゴリの向き（自分視点で決定）
- [ ] 招待トークン有効期限（7日）・使用済み管理

---

## Phase 4: フロントエンド統合

### ルーティング
- [ ] React Router v7 インストール
- [ ] ログイン画面（`/login`）
- [ ] ペアリング画面（`/pair`）
- [ ] カレンダー画面（`/`、認証必須）

### APIクライアント
- [ ] `packages/shared` の型を使ったfetchラッパー
- [ ] セッションCookie自動送信（`credentials: 'include'`）
- [ ] エラーハンドリング（401で /login リダイレクト）

### UI追加
- [ ] イベント編集モーダル
- [ ] イベント削除確認ダイアログ
- [ ] ローディング・エラー状態の表示
- [ ] ペアリング画面（招待リンクのシェア）

### 状態管理
- [ ] ローカルstateからAPIデータに移行
- [ ] 楽観的更新（UX向上）

---

## Phase 5: PWA + 仕上げ

### PWA
- [ ] `manifest.json` 作成（アイコン・テーマカラー）
- [ ] Service Worker 登録
- [ ] オフラインキャッシュ戦略（Stale-While-Revalidate）

### デプロイ
- [ ] Cloudflare Pages 設定（`apps/web` ビルド）
- [ ] Cloudflare Workers デプロイ設定
- [ ] 環境変数管理（`.dev.vars`、Wrangler Secrets）
- [ ] ステージング環境構築

### 品質
- [ ] E2Eテスト（Playwright）最小限
- [ ] エラー監視設定（Sentry or Cloudflare）
- [ ] README 更新
