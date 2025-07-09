export interface CompanyPhoneNumberEntity {
  id: number;
  companyId: number;
  phoneNumber: string;
  twilioSid?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
