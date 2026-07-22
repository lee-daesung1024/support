import {CATEGORIES, CONTACT_METHOD_LABELS, METHOD_LABELS, STORES} from '@/constants/consultation';
import type {ConsultationApplicationInput} from '@/types/consultation';

const categoryCodes = new Set(CATEGORIES.map((category) => category.code));
const headerUnsafe = /[\r\n]/g;

export function sanitizeText(value: unknown, maxLength = 1000) {
  return String(value ?? '')
    .replace(headerUnsafe, ' ')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(value: unknown) {
  return sanitizeText(value, 254).toLowerCase();
}

export function normalizeApplicationInput(raw: Partial<ConsultationApplicationInput>) {
  return {
    stageName: sanitizeText(raw.stageName, 80),
    storeName: sanitizeText(raw.storeName, 80),
    email: sanitizeEmail(raw.email),
    phone: sanitizeText(raw.phone, 40),
    preferredContactMethod: raw.preferredContactMethod,
    contactNote: sanitizeText(raw.contactNote, 300),
    firstChoiceAt: sanitizeText(raw.firstChoiceAt, 80),
    secondChoiceAt: sanitizeText(raw.secondChoiceAt, 80),
    thirdChoiceAt: sanitizeText(raw.thirdChoiceAt, 80),
    preferredConsultationMethod: raw.preferredConsultationMethod,
    preferredStaff: sanitizeText(raw.preferredStaff, 80),
    categories: Array.isArray(raw.categories) ? raw.categories.map((value) => sanitizeText(value, 60)) : [],
    note: sanitizeText(raw.note, 1000),
    specialRequest: sanitizeText(raw.specialRequest, 500),
    privacyConsent: raw.privacyConsent === true,
    idempotencyKey: sanitizeText(raw.idempotencyKey, 120),
    website: sanitizeText(raw.website, 120),
  } as ConsultationApplicationInput;
}

export function validateApplicationInput(input: ConsultationApplicationInput) {
  const errors: string[] = [];
  if (input.website) errors.push('送信できませんでした。');
  if (!input.stageName) errors.push('源氏名を入力してください。');
  if (!input.storeName || !STORES.includes(input.storeName)) errors.push('所属店舗を選択してください。');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.push('メールアドレスを正しく入力してください。');
  if (!input.preferredContactMethod || !(input.preferredContactMethod in CONTACT_METHOD_LABELS)) errors.push('希望連絡方法を選択してください。');
  if (!input.firstChoiceAt) errors.push('第1希望日時を入力してください。');
  if (!input.preferredConsultationMethod || !(input.preferredConsultationMethod in METHOD_LABELS)) errors.push('希望相談方法を選択してください。');
  if (!input.categories.length) errors.push('相談カテゴリを1つ以上選択してください。');
  if (input.categories.some((category) => !categoryCodes.has(category))) errors.push('許可されていない相談カテゴリです。');
  if ((input.note ?? '').length > 1000) errors.push('相談内容は1,000文字以内で入力してください。');
  if (!input.privacyConsent) errors.push('個人情報の取り扱いに同意してください。');
  if (!input.idempotencyKey) errors.push('二重送信防止キーがありません。');
  return errors;
}
