import BaseApi from './_baseApi';

export interface CompanyPhoneNumber {
  phoneNumber: string;
  twilioSid: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CampaignUsageMetrics {
  totalCampaigns: number;
  draftCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
}

export interface TargetUsageMetrics {
  totalTargets: number;
  processedTargets: number;
  unprocessedTargets: number;
  failedTargets: number;
  successfulTargets: number;
}

export interface CompanyUsageData {
  campaigns: CampaignUsageMetrics;
  targets: TargetUsageMetrics;
  lastUpdated: Date;
}

export interface CompanyWithPhoneNumber {
  id: number;
  name: string;
  slug?: string;
  status?: string;
  disabled?: boolean;
  about?: string;
  website?: string;
  parent?: {
    id: number;
    name: string;
    slug?: string;
  } | null;
  managedPhoneNumber?: CompanyPhoneNumber | null;
  usage?: CompanyUsageData | null;
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

export interface ParentCompanyRequest {
  parentId: number;
}

export interface UnparentCompanyRequest {
  confirm: boolean;
}

export interface CreateSubCompanyRequest {
  name: string;
  parentId: number;
  about?: string;
  website?: string;
  location?: string;
  phone?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  fleet_size?: string;
  founded_year?: number;
  safety_rating?: string;
  company_culture?: string;
  company_benefits?: string;
  specialties?: string[];
}

export interface PotentialParent {
  id: number;
  name: string;
  slug?: string;
}

class CompaniesApi extends BaseApi {
  private baseUrl = '/admin/companies';
  private phoneNumbersUrl = '/admin/phone-numbers';

  /**
   * Get all companies with optional phone numbers and usage data
   */
  async getAllCompanies(
    includePhoneNumbers = true,
    includeUsage = false
  ): Promise<CompanyWithPhoneNumber[]> {
    const response = await this.get(this.baseUrl, {
      params: {
        includePhoneNumbers,
        includeUsage,
      },
    });
    return response.data;
  }

  /**
   * Update a company
   */
  async updateCompany(
    companyId: number,
    data: Partial<CompanyWithPhoneNumber>
  ): Promise<CompanyWithPhoneNumber> {
    const response = await this.put(`${this.baseUrl}/${companyId}`, data);
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
   * Admin edit a company (can edit any field except id)
   */
  async adminEditCompany(
    companyId: number,
    data: Partial<CompanyWithPhoneNumber>
  ): Promise<CompanyWithPhoneNumber> {
    const response = await this.put(`${this.baseUrl}/${companyId}`, data);
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

  /**
   * Get potential parent companies for a company
   */
  async getPotentialParents(companyId: number): Promise<PotentialParent[]> {
    const response = await this.get(`${this.baseUrl}/${companyId}/potential-parents`);
    return response.data;
  }

  /**
   * Set parent company for a company
   */
  async setParentCompany(companyId: number, request: ParentCompanyRequest): Promise<void> {
    await this.put(`${this.baseUrl}/${companyId}/parent`, request);
  }

  /**
   * Remove parent company from a company
   */
  async unparentCompany(companyId: number, request: UnparentCompanyRequest): Promise<void> {
    await this.put(`${this.baseUrl}/${companyId}/unparent`, request);
  }

  /**
   * Create a sub-company with parent relationship
   */
  async createSubCompany(request: CreateSubCompanyRequest): Promise<CompanyWithPhoneNumber> {
    const response = await this.post(`${this.baseUrl}/sub-company`, request);
    return response.data;
  }
}

export default CompaniesApi;
