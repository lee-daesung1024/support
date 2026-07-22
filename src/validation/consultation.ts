import {CATEGORIES, CONTACT_METHOD_LABELS, generateTimeSlots} from '@/constants/consultation';
import type {ConsultationApplicationInput, DateTimePreference} from '@/types/consultation';

const categoryCodes = new Set(CATEGORIES.map((category) => category.code));
const timeSlots = new Set(generateTimeSlots());
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

function normalizePreference(raw: Partial<DateTimePreference> | undefined): DateTimePreference | undefined {
  const date = sanitizeText(raw?.date, 20);
  const time = sanitizeText(raw?.time, 10);
  if (!date && !time) return undefined;
  return {date, time};
}

export function formatPreference(preference?: DateTimePreference) {
  if (!preference?.date || !preference.time) return '未入力';
  const [year, month, day] = preference.date.split('-').map(Number);
  return `${year}年${month}月${day}日 ${preference.time}`;
}

export function normalizeApplicationInput(raw: Partial<ConsultationApplicationInput>) {
  return {
    stageName: sanitizeText(raw.stageName, 80),
    email: sanitizeEmail(raw.email),
    preferredContactMethod: raw.preferredContactMethod,
    firstChoice: normalizePreference(raw.firstChoice) ?? {date: '', time: ''},
    secondChoice: normalizePreference(raw.secondChoice),
    thirdChoice: normalizePreference(raw.thirdChoice),
    preferredStaff: sanitizeText(raw.preferredStaff || 'おまかせ', 80),
    categories: Array.isArray(raw.categories) ? raw.categories.map((value) => sanitizeText(value, 60)) : [],
    note: sanitizeText(raw.note, 1000),
    specialRequest: sanitizeText(raw.specialRequest, 500),
    privacyConsent: raw.privacyConsent === true,
    idempotencyKey: sanitizeText(raw.idempotencyKey, 120),
    website: sanitizeText(raw.website, 120),
  } as ConsultationApplicationInput;
}

function isPastPreference(preference: DateTimePreference) {
  if (!preference.date || !preference.time) return false;
  return new Date(`${preference.date}T${preference.time}:00`).getTime() < Date.now();
}

function validatePreference(label: string, preference: DateTimePreference | undefined, required: boolean, errors: string[]) {
  if (!preference?.date && !preference?.time) {
    if (required) errors.push(`${label}を入力してください。`);
    return;
  }
  if (!preference.date || !preference.time) errors.push(`${label}は日付と時間を両方選択してください。`);
  if (preference.time && !timeSlots.has(preference.time)) errors.push(`${label}の時間は選択肢から選んでください。`);
  if (preference.date && preference.time && isPastPreference(preference)) errors.push(`${label}に過去日時は選択できません。`);
}

export function validateApplicationInput(input: ConsultationApplicationInput) {
  const errors: string[] = [];
  if (input.website) errors.push('送信できませんでした。');
  if (!input.stageName) errors.push('源氏名を入力してください。');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.push('メールアドレスを正しく入力してください。');
  if (!input.preferredContactMethod || !(input.preferredContactMethod in CONTACT_METHOD_LABELS)) errors.push('希望連絡方法を選択してください。');
  validatePreference('第1希望日時', input.firstChoice, true, errors);
  validatePreference('第2希望日時', input.secondChoice, false, errors);
  validatePreference('第3希望日時', input.thirdChoice, false, errors);
  const selected = [input.firstChoice, input.secondChoice, input.thirdChoice]
    .filter((preference): preference is DateTimePreference => Boolean(preference?.date && preference?.time))
    .map((preference) => `${preference.date} ${preference.time}`);
  if (new Set(selected).size !== selected.length) errors.push('同じ日時を複数の希望欄へ登録できません。');
  if (!input.categories.length) errors.push('相談カテゴリを1つ以上選択してください。');
  if (input.categories.some((category) => !categoryCodes.has(category))) errors.push('許可されていない相談カテゴリです。');
  if ((input.note ?? '').length > 1000) errors.push('相談内容は1,000文字以内で入力してください。');
  if (!input.privacyConsent) errors.push('個人情報の取り扱いに同意してください。');
  if (!input.idempotencyKey) errors.push('二重送信防止キーがありません。');
  return errors;
}
