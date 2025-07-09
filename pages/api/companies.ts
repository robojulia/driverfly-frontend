import BaseApi from './_baseApi';

export interface CompanyPhoneNumber {
  phoneNumber: string;
  twilioSid: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CompanyWithPhoneNumber {
  id: number;
  name: string;
  slug?: string;
  status?: string;
  about?: string;
  website?: string;
  managedPhoneNumber?: CompanyPhoneNumber | null;
  [key: string]: any;
}

export interface ProvisionPhoneNumberRequest {
  companyId: number;
  areaCode?: number;
  region?: string;
  voiceEnabled?: boolean;
  smsEnabled?: boolean;
  mmsEnabled?: boolean;
}

export interface AssignPhoneNumberRequest {
  companyId: number;
  phoneNumber: string;
  twilioSid: string;
}

export interface ReleasePhoneNumberRequest {
  releaseFromTwilio?: boolean;
}

class CompaniesApi extends BaseApi {
  private baseUrl = '/admin/companies';
  private phoneNumbersUrl = '/admin/phone-numbers';

  /**
   * Get all companies with phone number information
   */
  async getAllCompanies(includePhoneNumbers = true): Promise<CompanyWithPhoneNumber[]> {
    const response = await this.get(this.baseUrl, {
      params: {
        includePhoneNumbers,
      },
    });
    return response.data;
  }

  /**
   * Provision a new phone number for a company
   */
  async provisionPhoneNumber(request: ProvisionPhoneNumberRequest): Promise<CompanyPhoneNumber> {
    const response = await this.post(`${this.phoneNumbersUrl}/provision`, request);
    return response.data;
  }

  /**
   * Assign an existing phone number to a company
   */
  async assignPhoneNumber(request: AssignPhoneNumberRequest): Promise<CompanyPhoneNumber> {
    const response = await this.post(`${this.phoneNumbersUrl}/assign`, request);
    return response.data;
  }

  /**
   * Release a company's phone number
   */
  async releasePhoneNumber(
    companyId: number,
    request: ReleasePhoneNumberRequest = {}
  ): Promise<void> {
    await this.delete(`${this.phoneNumbersUrl}/company/${companyId}`, request);
  }

  /**
   * Get all phone numbers for a specific company
   */
  async getCompanyPhoneNumbers(companyId: number): Promise<CompanyPhoneNumber[]> {
    const response = await this.get(`${this.phoneNumbersUrl}/company/${companyId}`);
    return response.data;
  }
}

export default CompaniesApi;
