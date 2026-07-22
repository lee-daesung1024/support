export type ConsultationMethod='in_person'|'phone'|'line'|'online';
export type ReservationStatus='pending_assignment'|'reserved'|'confirmed'|'completed'|'postponed'|'cancelled_by_cast'|'cancelled_by_store';
export type CastSession={castId:string;castName:string;stores:{id:string;name:string}[]};
export type Category={code:string;label:string};
export type Staff={id:string;name:string;methods:ConsultationMethod[]};
export type AvailabilitySlot={startAt:string;endAt:string;available:boolean;methods:ConsultationMethod[];staffIds:string[]};
export type Reservation={id:string;reservationNumber:string;castId:string;storeId:string;requestedStaffId?:string|null;assignedStaffId?:string|null;scheduledStartAt:string;scheduledEndAt:string;consultationMethod:ConsultationMethod;status:ReservationStatus;priority:'normal'|'urgent';categories:string[];advanceNote?:string;specialRequests:string[];bookingSource:'supportブラウザLP';createdAt:string;updatedAt:string;cancelledAt?:string;cancelReason?:string;adminSyncStatus:'mock'|'pending'|'synced'|'failed'};
export type ReservationInput={storeId:string;requestedStaffId?:string|null;scheduledStartAt:string;scheduledEndAt:string;consultationMethod:ConsultationMethod;categories:string[];advanceNote?:string;specialRequests:string[];idempotencyKey:string};
