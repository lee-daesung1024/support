import type {ContactMethod} from '@/types/consultation';

export const STORE_NOTIFICATION_EMAIL = 'kyuden1101@gmail.com';

export const CATEGORIES = [
  {code: 'earn_more', label: 'もっと稼ぎたい'},
  {code: 'repeaters', label: '指名やリピーターを増やしたい'},
  {code: 'profile', label: '写メ日記やプロフィールを相談したい'},
  {code: 'schedule', label: '出勤日数や勤務時間を相談したい'},
  {code: 'ng_customer', label: '苦手なお客様やNG顧客について相談したい'},
  {code: 'service', label: '接客やお客様対応で困っている'},
  {code: 'store_request', label: 'スタッフや店舗への要望がある'},
  {code: 'payment', label: '待遇や精算について確認したい'},
  {code: 'motivation', label: 'モチベーションや仕事との両立を相談したい'},
  {code: 'leave_return', label: '退店、休職、復帰について相談したい'},
  {code: 'no_topic', label: '特に決まっていないが話したい'},
  {code: 'other', label: 'その他'},
];

export const CONTACT_METHOD_LABELS: Record<ContactMethod, string> = {
  line: 'LINE',
  email: 'メール',
  phone: '電話',
  any: 'どれでもよい',
};

export const TIME_SLOT_CONFIG = {
  start: '10:00',
  end: '02:00',
  intervalMinutes: 30,
};

function toMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

export function generateTimeSlots() {
  const start = toMinutes(TIME_SLOT_CONFIG.start);
  let end = toMinutes(TIME_SLOT_CONFIG.end);
  if (end <= start) end += 24 * 60;
  const slots: string[] = [];
  for (let minutes = start; minutes <= end; minutes += TIME_SLOT_CONFIG.intervalMinutes) {
    const normalized = minutes % (24 * 60);
    slots.push(`${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`);
  }
  return slots;
}
