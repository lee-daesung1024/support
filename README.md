# キャストサポート 相談タイム

スマートフォンおよびPCブラウザで利用するレスポンシブWebサイトです。ネイティブアプリ、App Store / Google Play公開、ブラウザPush通知を前提にしません。

## 起動

```bash
npm install
npm run dev
```

## 環境変数

`.env.example` をコピーして設定します。`ADMIN_API_KEY`、`SESSION_SECRET` は `NEXT_PUBLIC_` にしないでください。

- `NEXT_PUBLIC_API_MODE=mock`: support単体のモックAPIで動作
- `NEXT_PUBLIC_API_MODE=production`: support側API/BFFから `ADMIN_API_BASE_URL` へ連携する想定
- `NEXT_PUBLIC_API_BASE_URL=/api`
- `ADMIN_API_BASE_URL`, `ADMIN_API_KEY`, `SESSION_SECRET`, `LINE_CONTACT_URL`, `SUPPORT_PHONE_NUMBER`

## 主要URL

- `/` `/consultation`: 公開LP
- `/login`: 電話番号＋ワンタイムコード本人確認（モック）
- `/consultation/reserve` → `/details` → `/confirm` → `/complete`
- `/consultation/reservations`, `/consultation/reservations/:id`, `/consultation/reservations/:id/edit`

## API

- `POST /api/auth/request-code`, `POST /api/auth/verify-code`, `GET /api/auth/session`, `POST /api/auth/logout`
- `GET /api/consultation/availability`
- `GET|POST /api/consultation/reservations`
- `GET|PATCH /api/consultation/reservations/:id`
- `POST /api/consultation/reservations/:id/cancel`
- `GET /api/consultation/categories`, `/methods`, `/staff`, `/api/stores`

## 認証と連携

予約以降はHttpOnly Cookieのセッションを確認します。モックではメモリ上に予約を保存し、Idempotency-Keyで二重作成を防ぎます。本番ではsupport側API/BFFから管理システム公開APIへ送信し、管理システムDBへ直接接続しません。予約経路は「supportブラウザLP」です。

## テスト

```bash
npm run typecheck
npm run build
```

## 対応ブラウザ

iPhone Safari、Android Chrome、PC Chrome、Edge最新版を主対象とします。固定CTAは `env(safe-area-inset-bottom)` を使い、PCでは非表示です。

## 既知の制約

モック保存はNode.jsプロセスのメモリ内です。プロセス再起動後は初期化されます。本番APIの実URL・通知基盤・監査ログ永続化は管理システム公開APIの仕様確定後に接続してください。
