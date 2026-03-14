# hinami

カップル向けのシンプルなカレンダーアプリ。自分・パートナー・ふたりの3カテゴリで予定を色分け管理できます。

## 主な機能

- 月表示カレンダー（前月/次月ナビゲーション）
- 日付を選択して予定の詳細確認
- 予定の追加（ボトムシートモーダル）
- 3カテゴリで予定を色分け管理
  - **自分**（青）
  - **パートナー**（緑）
  - **ふたり**（赤茶）

## 技術スタック

| 技術 | 用途 |
|------|------|
| React 19 | UIフレームワーク |
| TypeScript 5 (strict) | 型安全な開発 |
| Vite 7 | ビルドツール / 開発サーバー |
| npm workspaces | monorepo管理 |

## ディレクトリ構成

```
hinami/
├── apps/
│   └── web/               # フロントエンドアプリ
│       ├── src/
│       │   ├── App.tsx        # メインコンポーネント・状態管理
│       │   ├── main.tsx       # エントリーポイント
│       │   ├── types.ts       # 型定義
│       │   ├── constants.ts   # 色・ラベル等の定数
│       │   ├── index.css      # グローバルスタイル
│       │   └── components/    # UIコンポーネント群
│       ├── vite.config.js
│       ├── tsconfig.json
│       └── index.html
├── packages/              # 共有パッケージ
└── package.json           # monorepoルート設定
```

## 開発

```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```
