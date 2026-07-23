import type {ConsultationApplication, ConsultationApplicationInput} from '@/types/consultation';
import {CATEGORIES, CONTACT_METHOD_LABELS, STORE_NOTIFICATION_EMAIL} from '@/constants/consultation';
import {formatPreference} from '@/validation/consultation';

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

function formatAppliedAt(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function bulletList(items: string[]) {
  return items.map((item) => `・${item}`).join('\n');
}

function storeMailBody(application: ConsultationApplication) {
  return [
    'キャストから相談タイムの申し込みがありました。',
    '',
    '■受付番号',
    application.receiptNumber,
    '',
    '■源氏名',
    application.stageName,
    '',
    '■メールアドレス',
    application.email,
    '',
    '■希望連絡方法',
    CONTACT_METHOD_LABELS[application.preferredContactMethod],
    '',
    '■第1希望日時',
    formatPreference(application.firstChoice),
    '',
    '■第2希望日時',
    formatPreference(application.secondChoice),
    '',
    '■第3希望日時',
    formatPreference(application.thirdChoice),
    '',
    '■希望担当者',
    application.preferredStaff || 'おまかせ',
    '',
    '■相談カテゴリ',
    bulletList(categoryLabels(application.categories)),
    '',
    '■相談内容',
    application.note || '未入力',
    '',
    '■配慮してほしいこと',
    application.specialRequest || '未入力',
    '',
    '■申込日時',
    formatAppliedAt(application.appliedAt),
  ].join('\n');
}

function castMailBody(application: ConsultationApplication) {
  return [
    '相談タイムのお申し込みを受け付けました。',
    '',
    '■源氏名',
    application.stageName,
    '',
    '■受付番号',
    application.receiptNumber,
    '',
    '■第1希望日時',
    formatPreference(application.firstChoice),
    '',
    '■第2希望日時',
    formatPreference(application.secondChoice),
    '',
    '■第3希望日時',
    formatPreference(application.thirdChoice),
    '',
    '■希望担当者',
    application.preferredStaff || 'おまかせ',
    '',
    '■相談カテゴリ',
    bulletList(categoryLabels(application.categories)),
    '',
    '■受付日時',
    formatAppliedAt(application.appliedAt),
    '',
    '現在はまだ日時確定前です。',
    '担当スタッフからの連絡をもって確定となります。',
  ].join('\n');
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
  const storeSubject = `【相談タイム申込】${application.stageName}／${formatPreference(application.firstChoice)}`;
  const castSubject = '【相談タイム】お申し込みを受け付けました';

  if (process.env.NEXT_PUBLIC_API_MODE !== 'production') {
    console.info('[mock-mail] store notification', {to: STORE_NOTIFICATION_EMAIL, from, subject: storeSubject});
    console.info('[mock-mail] cast confirmation', {to: application.email, from, subject: castSubject});
    return;
  }

  if (!apiKey || !process.env.MAIL_API_ENDPOINT) {
    throw new Error('メール送信設定が不足しています。');
  }

  const messages = [
    {to: STORE_NOTIFICATION_EMAIL, from, subject: storeSubject, text: storeMailBody(application)},
    {to: application.email, from, subject: castSubject, text: castMailBody(application)},
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
    receiptNumber: `CS-${Date.now().toString().slice(-8)}`,
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
