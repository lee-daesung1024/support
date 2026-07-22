import type {ConsultationMethod, ContactMethod} from '@/types/consultation';

export const STORE_NOTIFICATION_EMAIL = 'kyuden1101@gmail.com';

export const STORES = ['ミント新宿店', 'ミント池袋店', 'ミント横浜店'];

export const CATEGORIES = [
  {code: 'earn_more', label: 'もっと稼ぎたい'},
  {code: 'repeaters', label: '指名やリピーターを増やしたい'},
  {code: 'profile', label: '写メ日記やプロフィールを相談したい'},
  {code: 'schedule', label: '出勤日数や勤務時間を相談したい'},
  {code: 'ng_customer', label: '苦手なお客様、NG顧客について相談したい'},
  {code: 'service', label: '接客やお客様対応で困っている'},
  {code: 'store_request', label: 'スタッフや店舗への要望がある'},
  {code: 'payment', label: '待遇や精算について確認したい'},
  {code: 'motivation', label: 'モチベーションや仕事との両立を相談したい'},
  {code: 'leave_return', label: '退店、休職、復帰について相談したい'},
  {code: 'no_topic', label: '特に決まっていないが話したい'},
  {code: 'other', label: 'その他'},
];

export const CONTACT_METHOD_LABELS: Record<ContactMethod, string> = {
  email: 'メール',
  phone: '電話',
  line: 'LINE',
};

export const METHOD_LABELS: Record<ConsultationMethod, string> = {
  in_person: '対面',
  phone: '電話',
  line: 'LINE',
  online: 'オンライン',
};
