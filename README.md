# キャストサポート 相談タイム

スマートフォンおよびPCブラウザで利用するレスポンシブWebサイトです。ネイティブアプリ、キャストマイページ連携、ログイン、予約履歴閲覧は前提にしません。

## 起動

```bash
npm install
npm run dev
```

## 運用方式

キャストは利用するたびに申込フォームへ本人情報を入力します。フォーム送信時点では予約確定ではなく「申込受付」です。日時は担当スタッフからの連絡をもって確定します。

## 入力項目

- 源氏名（必須）
- メールアドレス（必須）
- 希望連絡方法（LINE / メール / 電話 / どれでもよい、必須）
- 第1希望日時（必須）
- 第2希望日時（任意）
- 第3希望日時（任意）
- 希望担当者（任意）
- 相談カテゴリ（1つ以上必須）
- 相談内容（任意、最大1000文字）
- 配慮してほしいこと（任意）
- 個人情報の取り扱いへの同意（必須）

所属店舗、電話番号、希望連絡方法の補足、希望相談方法は今回の申込フォームでは使用しません。

## 環境変数

`.env.example` をコピーして設定します。メール送信用のAPIキーや認証情報はフロントエンドへ置かず、`NEXT_PUBLIC_` を付けません。

- `NEXT_PUBLIC_API_MODE=mock`: メール送信をサーバーログへ出すモック動作
- `NEXT_PUBLIC_API_MODE=production`: `MAIL_API_ENDPOINT` へサーバー側からメール送信
- `MAIL_API_ENDPOINT`: メール送信サービスのサーバー側エンドポイント
- `MAIL_API_KEY`: メール送信用APIキー
- `MAIL_FROM`: 送信元メールアドレス

店舗通知先はサーバー側定数として `kyuden1101@gmail.com` に固定し、ブラウザから変更できません。

## 主要URL

- `/` `/consultation`: 公開LP
- `/consultation/apply`: ログイン不要の相談タイム申込フォーム
- `/consultation/apply/complete`: 申込受付完了画面

## API

- `POST /api/consultation/applications`: 申込受付、サーバー側バリデーション、スパム対策、二重送信防止、店舗/本人向けメール送信
- `GET /api/consultation/categories`: 相談カテゴリ
- `GET /api/consultation/methods`: 希望連絡方法、時間候補

## セキュリティ

- 相談内容はURLへ含めません。
- 店舗通知先はサーバー側で固定します。
- ヘッダーインジェクション、HTML、スクリプト文字をサーバー側で無害化します。
- honeypotと簡易レート制限でスパム対策を行います。
- Idempotency-Keyで二重送信を防止します。
- メール送信エラー時は申込完了として表示しません。

## Liveweave

`liveweave/index.html`, `liveweave/styles.css`, `liveweave/script.js` は外部ビルドなしでLPと申込デモを確認できます。

## テスト

```bash
npm run typecheck
npm run build
```

## 既知の制約

モック申込保存はNode.jsプロセスのメモリ内です。本番ではDBまたは安全なサーバー側ストレージへ置き換えてください。メール送信は汎用HTTPメールAPIを想定しているため、実サービスの仕様に合わせて `sendApplicationEmails` のリクエスト形式を調整してください。
