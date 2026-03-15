# 実装タスク

> アーキテクチャ変更（2025-03）: Magic Link認証廃止 → 認証レス・招待リンク方式に変更

---

## Phase 1: API基盤 + DB ✅

### apps/api セットアップ
- [x] `apps/api` ディレクトリ作成・`package.json` 初期化
- [x] Hono + Wrangler インストール
- [x] `wrangler.toml` 設定（D1バインディング）
- [x] `apps/api/src/index.ts` エントリポイント作成

### DB
- [x] D1スキーマ（`schema.sql`）作成
- [x] ローカルD1初期化（`wrangler d1 execute --local`）
- [ ] マイグレーション管理方針決定（変更時の手順）

### イベントCRUD API
- [x] `GET /events?month=YYYY-M` 実装
- [x] `POST /events` 実装
- [x] `PATCH /events/:id` 実装
- [x] `DELETE /events/:id` 実装
- [x] couple_idスコープによるアクセス制御

---

## Phase 2: 認証レス・招待リンク ✅ ~~（Magic Link廃止）~~

### カップルAPI
- [x] `POST /couples` — カップル作成・セッション発行・招待トークン返却
- [x] `POST /couples/join/:token` — 招待参加・パートナーセッション発行
- [x] `GET /couples/me` — カップル情報・ロール取得

### セッション管理
- [x] セッションCookie発行（HttpOnly, SameSite=Lax）
- [x] ミドルウェアで認証チェック
- [x] セッション有効期限（1年）

### ロジック
- [x] mine/partner カテゴリのビューワー視点反転
- [x] セッションロール（creator/partner）管理
- [ ] 招待トークンの使用済み管理（現状: パートナー参加後も有効）

---

## Phase 3: フロントエンド統合 🔨

### APIクライアント
- [x] `apps/web/src/api.ts` — fetchラッパー実装
- [x] セッションCookie自動送信（`credentials: 'include'`）
- [x] Viteプロキシ設定（`/api` → `localhost:8787`）

### 状態管理
- [x] ローカルstateからAPIデータに移行
- [x] ローディング状態の表示

### ペアリングUI
- [x] 起動時のセッション初期化（新規作成 or 既存セッション復元）
- [x] `?join=TOKEN` URLパラメータによる招待参加フロー
- [x] 招待URLのインライン表示 + コピーボタン（creator のみ）

### 未実装
- [ ] イベント編集モーダル（現状: 削除のみ）
- [ ] 削除確認ダイアログ（現状: 即削除）
- [ ] エラー表示UI（現状: try/catch で握り潰し）
- [ ] 楽観的更新（現状: API完了後に再レンダリング）
- [ ] パートナー参加後の招待URL非表示（partner ロール時）

---

## Phase 4: PWA + デプロイ

### PWA
- [ ] `manifest.json` 作成（アイコン・テーマカラー）
- [ ] Service Worker 登録
- [ ] オフラインキャッシュ戦略（Stale-While-Revalidate）

### デプロイ
- [ ] Cloudflareアカウント作成
- [ ] `wrangler d1 create hinami-db` → `wrangler.toml` の `database_id` 更新
- [ ] `npm run db:migrate:remote` でリモートDBマイグレーション
- [ ] Cloudflare Workers デプロイ（`wrangler deploy`）
- [ ] Cloudflare Pages 設定（`apps/web` ビルド）
- [ ] CORS origin に本番PagesのURLを追加（`apps/api/src/index.ts`）

### 品質
- [ ] E2Eテスト（Playwright）最小限
- [ ] README 更新
