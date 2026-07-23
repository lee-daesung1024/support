export type ContactMethod = 'line' | 'email' | 'phone' | 'any';

export type DateTimePreference = {
  date: string;
  time: string;
};

export type ConsultationApplicationInput = {
  stageName: string;
  email: string;
  preferredContactMethod: ContactMethod;
  firstChoice: DateTimePreference;
  secondChoice?: DateTimePreference;
  thirdChoice?: DateTimePreference;
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
