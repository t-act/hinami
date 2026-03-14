# hinami

カップル向けカレンダーアプリ（React 19 / TypeScript 5 / Vite 7 / npm workspaces）。

## コマンド

```bash
npm run dev    # 開発サーバー（apps/web）
npm run build  # ビルド（apps/web）
```

## 構成

- `apps/web/src/App.tsx` — メインコンポーネント・状態管理
- `apps/web/src/types.ts` — `Category`, `CalendarEvent`, `EventMap`
- `apps/web/src/constants.ts` — カテゴリ色・ラベル定数
- `apps/web/src/components/` — UIコンポーネント群

## データ

- カテゴリ: `mine`（自分）/ `partner`（パートナー）/ `together`（ふたり）
- 日付キー: `"YYYY-M-D"`（ゼロパディングなし）
