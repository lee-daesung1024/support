export type Status='pending_assignment'|'reserved'|'confirmed'|'completed'|'postponed'|'cancelled_by_cast'|'cancelled_by_store';
export type Method='in_person'|'phone'|'line'|'online';
export type CategoryCode='earn_more'|'repeaters'|'profile'|'schedule'|'ng_customer'|'service'|'staff_request'|'payment'|'motivation'|'leave_return'|'just_talk'|'other';
export type Reservation={id:string;reservationNumber:string;castId:string;castName:string;storeId:string;storeName:string;assignedStaffId?:string;assignedStaffName?:string;scheduledStartAt:string;scheduledEndAt:string;method:Method;status:Status;priority:'normal'|'urgent';categories:CategoryCode[];advanceNote?:string;specialRequests:string[];bookingSource:'キャストLP予約';createdAt:string;updatedAt:string;cancelReason?:string;completedRecordId?:string};
export type AvailabilitySlot={date:string;time:string;startAt:string;endAt:string;methods:Method[];staff:{id:string;name:string}[];full?:boolean;available:boolean;reason?:string};
