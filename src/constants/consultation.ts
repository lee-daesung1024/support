import type {Category,ConsultationMethod,ReservationStatus} from '@/types/consultation';
export const CATEGORIES:Category[]=[['earn_more','もっと稼ぎたい'],['repeaters','指名やリピーターを増やしたい'],['profile','写メ日記やプロフィールを相談したい'],['schedule','出勤日数や勤務時間を相談したい'],['ng_customer','苦手なお客様、NG顧客について相談したい'],['service','接客やお客様対応で困っている'],['store_request','スタッフや店舗への要望がある'],['payment','待遇や精算について確認したい'],['motivation','モチベーションや仕事との両立を相談したい'],['leave_return','退店、休職、復帰について相談したい'],['no_topic','特に決まっていないが話したい'],['other','その他']].map(([code,label])=>({code,label}));
export const SPECIAL_REQUESTS=['最初は聞くだけにしてほしい','女性スタッフを希望','できるだけ短時間がよい','人目につきにくい場所を希望','急ぎで相談したい','その他の配慮が必要'];
export const METHOD_LABELS:Record<ConsultationMethod,string>={in_person:'対面',phone:'電話',line:'LINE',online:'オンライン'};
export const STATUS_LABELS:Record<ReservationStatus,string>={pending_assignment:'担当者調整中',reserved:'予約済み',confirmed:'確認済み',completed:'実施済み',postponed:'延期',cancelled_by_cast:'キャストキャンセル',cancelled_by_store:'店舗キャンセル'};
