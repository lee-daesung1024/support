import type {ConsultationApplication, ConsultationApplicationInput} from '@/types/consultation';
import {CATEGORIES, CONTACT_METHOD_LABELS, METHOD_LABELS, STORE_NOTIFICATION_EMAIL} from '@/constants/consultation';

const globalStore = globalThis as typeof globalThis & {
  __consultationApplications?: ConsultationApplication[];
  __consultationIdempotency?: Map<string, string>;
  __consultationRateLimit?: Map<string, {count: number; resetAt: number}>;
};

globalStore.__consultationApplications ??= [];
globalStore.__consultationIdempotency ??= new Map();
globalStore.__consultationRateLimit ??= new Map();

function categoryLabels(codes: string[]) {
  return codes.map((code) => CATEGORIES.find((category) => category.code === code)?.label ?? code);
}

function formatLines(application: ConsultationApplication) {
  return [
    `受付番号: ${application.receiptNumber}`,
    `源氏名: ${application.stageName}`,
    `所属店舗: ${application.storeName}`,
    `メールアドレス: ${application.email}`,
    `電話番号: ${application.phone || '未入力'}`,
    `希望連絡方法: ${CONTACT_METHOD_LABELS[application.preferredContactMethod]}`,
    `希望連絡方法の補足: ${application.contactNote || '未入力'}`,
    `第1希望日時: ${application.firstChoiceAt}`,
    `第2希望日時: ${application.secondChoiceAt || '未入力'}`,
    `第3希望日時: ${application.thirdChoiceAt || '未入力'}`,
    `希望相談方法: ${METHOD_LABELS[application.preferredConsultationMethod]}`,
    `希望担当者: ${application.preferredStaff || '指定なし'}`,
    `相談カテゴリ: ${categoryLabels(application.categories).join('、')}`,
    `相談内容: ${application.note || '未入力'}`,
    `配慮してほしいこと: ${application.specialRequest || '未入力'}`,
    `申込日時: ${application.appliedAt}`,
  ];
}

export function assertRateLimit(key: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const limit = 5;
  const record = globalStore.__consultationRateLimit!.get(key);
  if (!record || record.resetAt < now) {
    globalStore.__consultationRateLimit!.set(key, {count: 1, resetAt: now + windowMs});
    return;
  }
  if (record.count >= limit) {
    throw Object.assign(new Error('短時間に送信が続いています。時間をおいて再度お試しください。'), {status: 429});
  }
  record.count += 1;
}

export async function sendApplicationEmails(application: ConsultationApplication) {
  const from = process.env.MAIL_FROM || 'no-reply@example.invalid';
  const apiKey = process.env.MAIL_API_KEY;
  const storeBody = formatLines(application).join('\n');
  const castBody = [
    `受付番号: ${application.receiptNumber}`,
    `源氏名: ${application.stageName}`,
    `希望日時: 第1希望 ${application.firstChoiceAt} / 第2希望 ${application.secondChoiceAt || '未入力'} / 第3希望 ${application.thirdChoiceAt || '未入力'}`,
    `相談方法: ${METHOD_LABELS[application.preferredConsultationMethod]}`,
    `相談カテゴリ: ${categoryLabels(application.categories).join('、')}`,
    '',
    '現在はまだ予約確定ではありません。担当スタッフからの連絡をもって予約確定となります。',
  ].join('\n');

  if (process.env.NEXT_PUBLIC_API_MODE !== 'production') {
    console.info('[mock-mail] store notification', {to: STORE_NOTIFICATION_EMAIL, from, subject: `相談タイム申込 ${application.receiptNumber}`});
    console.info('[mock-mail] cast confirmation', {to: application.email, from, subject: `相談タイム申込受付 ${application.receiptNumber}`});
    return;
  }

  if (!apiKey || !process.env.MAIL_API_ENDPOINT) {
    throw new Error('メール送信設定が不足しています。');
  }

  const messages = [
    {to: STORE_NOTIFICATION_EMAIL, from, subject: `相談タイム申込 ${application.receiptNumber}`, text: storeBody},
    {to: application.email, from, subject: `相談タイム申込受付 ${application.receiptNumber}`, text: castBody},
  ];

  for (const message of messages) {
    const response = await fetch(process.env.MAIL_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) {
      throw new Error('メール送信に失敗しました。');
    }
  }
}

export async function createConsultationApplication(input: ConsultationApplicationInput) {
  const priorId = globalStore.__consultationIdempotency!.get(input.idempotencyKey);
  if (priorId) {
    const prior = globalStore.__consultationApplications!.find((application) => application.id === priorId)!;
    if (prior.notificationStatus === 'failed') {
      await sendApplicationEmails(prior);
      prior.notificationStatus = 'sent';
    }
    return prior;
  }

  const now = new Date().toISOString();
  const application: ConsultationApplication = {
    ...input,
    id: crypto.randomUUID(),
    receiptNumber: `CT-${Date.now().toString().slice(-8)}`,
    status: 'received',
    appliedAt: now,
    notificationStatus: 'failed',
  };

  globalStore.__consultationApplications!.push(application);
  globalStore.__consultationIdempotency!.set(input.idempotencyKey, application.id);
  await sendApplicationEmails(application);
  application.notificationStatus = 'sent';
  return application;
}
