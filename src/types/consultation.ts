export type ContactMethod = 'email' | 'phone' | 'line';
export type ConsultationMethod = 'in_person' | 'phone' | 'line' | 'online';

export type ConsultationApplicationInput = {
  stageName: string;
  storeName: string;
  email: string;
  phone?: string;
  preferredContactMethod: ContactMethod;
  contactNote?: string;
  firstChoiceAt: string;
  secondChoiceAt?: string;
  thirdChoiceAt?: string;
  preferredConsultationMethod: ConsultationMethod;
  preferredStaff?: string;
  categories: string[];
  note?: string;
  specialRequest?: string;
  privacyConsent: boolean;
  idempotencyKey: string;
  website?: string;
};

export type ConsultationApplication = ConsultationApplicationInput & {
  id: string;
  receiptNumber: string;
  status: 'received';
  appliedAt: string;
  notificationStatus: 'sent' | 'failed';
};
