# support

キャスト向けサポートサイト専用リポジトリです。既存の管理システムやデータベースには直接接続せず、相談タイムLP・予約機能を独立したVite/Reactアプリとして実装しています。

## ローカル起動

```bash
npm install
npm run dev
```

## API切り替え

- `VITE_CONSULTATION_API_MODE=mock`（既定）: localStorageを利用したモックAPIで予約保存・変更・キャンセル・管理反映を確認できます。
- `VITE_CONSULTATION_API_MODE=production`: `VITE_CONSULTATION_API_BASE_URL` 配下の本番APIを呼び出します。

## 追加ルート

### キャスト側

- `/cast/support-consultation`
- `/cast/support-consultation/reserve`
- `/cast/support-consultation/complete`
- `/cast/support-consultation/reservations`
- `/cast/support-consultation/reservations/:id`
- `/cast/support-consultation/reservations/:id/edit`

### 管理側

- `/admin/casts/interviews`
- `/admin/casts/interviews/:id`

## API設計

フロントAPIクライアントは以下の本番APIへ切り替え可能です。

- `GET /api/cast/consultation/availability`
- `POST /api/cast/consultation/reservations`
- `GET /api/cast/consultation/reservations`
- `GET /api/cast/consultation/reservations/:id`
- `PATCH /api/cast/consultation/reservations/:id`
- `POST /api/cast/consultation/reservations/:id/cancel`
- `GET /api/admin/consultation/reservations`
- `GET /api/admin/consultation/reservations/:id`
- `PATCH /api/admin/consultation/reservations/:id`
- `POST /api/admin/consultation/reservations/:id/complete`
- `POST /api/admin/consultation/reservations/:id/record`

## 既知の制約

このリポジトリ単体で動作確認できるよう、現時点ではDBマイグレーション・本番認証・本番通知・本番権限は外部API側の責務として分離し、モックAPIではlocalStorage上で保存・競合チェック・管理一覧反映を行います。本番反映時はAPI側で認可、排他制御、ステータス履歴、通知ログ、面談記録テーブル連携を実装してください。
