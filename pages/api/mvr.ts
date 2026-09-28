import BaseApi from './_baseApi';

export type MvrSubjectType = 'applicants' | 'employee';
export type MvrPurpose = 'PRE_EMPLOYMENT' | 'ANNUAL_REVIEW' | 'OTHER';
export type MvrOrderStatus = 'PENDING' | 'ON_HOLD' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type MvrAssessment = 'CLEAR' | 'REVIEW';
export type MvrViolationCategory = 'DUI' | 'MOVING_VIOLATION_NOT_AT_FAULT' | 'INFRACTIONS' | 'TICKETS' | 'ACCIDENTS';

export const MVR_PURPOSE_LABELS: Record<MvrPurpose, string> = {
  PRE_EMPLOYMENT: 'Pre-employment',
  ANNUAL_REVIEW: 'Annual review',
  OTHER: 'Other',
};

export const MVR_STATUS_LABELS: Record<MvrOrderStatus, string> = {
  PENDING: 'Waiting on state',
  ON_HOLD: 'On hold',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
};

export const MVR_CATEGORY_LABELS: Record<MvrViolationCategory, string> = {
  DUI: 'DUI / DWI',
  MOVING_VIOLATION_NOT_AT_FAULT: 'Not at fault',
  INFRACTIONS: 'Infraction',
  TICKETS: 'Moving violation',
  ACCIDENTS: 'Accident',
};

export interface MvrReport {
  license: {
    numberLast4?: string;
    state?: string;
    class?: string;
    type?: string;
    status?: string;
    issuedDate?: string;
    expirationDate?: string;
    restrictions?: string[];
    endorsements?: string[];
  };
  violations: { date?: string; convictionDate?: string; description: string; state?: string; points?: number; category: MvrViolationCategory }[];
  accidents: { date?: string; description?: string; state?: string; atFault?: boolean }[];
  suspensions: { startDate?: string; endDate?: string; reinstatementDate?: string; description?: string }[];
}

export interface MvrOrder {
  id: number;
  subjectType: MvrSubjectType;
  subjectId: number;
  driverName: string;
  licenseState: string;
  licenseLast4: string;
  purpose: MvrPurpose;
  provider: string;
  externalId?: string;
  status: MvrOrderStatus;
  assessment?: MvrAssessment;
  licenseStatus?: string;
  licenseClass?: string;
  licenseExpiry?: string;
  violationCount?: number;
  accidentCount?: number;
  suspensionCount?: number;
  documentId?: number;
  note?: string;
  completed_at?: string;
  created_at: string;
  /** Only on the single-order endpoint. */
  report?: MvrReport;
}

export interface MvrDriverSelection {
  allActiveEmployees?: boolean;
  employeeIds?: number[];
  applicantIds?: number[];
}

export interface MvrSkippedDriver {
  id: number;
  subjectType: MvrSubjectType;
  name: string;
  reasons: string[];
}

export interface MvrPreview {
  ready: { id: number; subjectType: MvrSubjectType; name: string; licenseState: string }[];
  skipped: MvrSkippedDriver[];
}

export interface MvrCredentialField {
  key: 'apiKey' | 'apiSecret' | 'accountId' | 'baseUrl';
  label: string;
  secret?: boolean;
  required?: boolean;
  help?: string;
}

export interface MvrProviderOption {
  key: string;
  label: string;
  fields: MvrCredentialField[];
  setupNote?: string;
  webhooks: boolean;
}

export interface MvrProviderSettings {
  providers: MvrProviderOption[];
  configured: boolean;
  provider: string | null;
  accountId: string | null;
  baseUrl: string | null;
  apiKeyMasked: string | null;
  apiSecretMasked: string | null;
  webhookUrl: string | null;
}

export default class MvrApi extends BaseApi {
  private url(companyId: number, path = '') {
    return `company/${companyId}/mvr${path}`;
  }

  async preview(companyId: number, dto: MvrDriverSelection): Promise<MvrPreview> {
    const { data } = await this.post(this.url(companyId, '/preview'), dto);
    return data;
  }

  async order(
    companyId: number,
    dto: MvrDriverSelection & { purpose: MvrPurpose; consentCertified: boolean },
  ): Promise<{ orders: MvrOrder[]; skipped: MvrSkippedDriver[] }> {
    const { data } = await this.post(this.url(companyId, '/orders'), dto);
    return data;
  }

  async list(companyId: number, filter: { subjectType?: MvrSubjectType; subjectId?: number; limit?: number } = {}): Promise<MvrOrder[]> {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([k, v]) => v !== undefined && params.set(k, String(v)));
    const { data } = await this.get(this.url(companyId, `/orders?${params}`));
    return data;
  }

  async getOrder(companyId: number, id: number): Promise<MvrOrder> {
    const { data } = await this.get(this.url(companyId, `/orders/${id}`));
    return data;
  }

  async updateNote(companyId: number, id: number, note: string): Promise<MvrOrder> {
    const { data } = await this.patch(this.url(companyId, `/orders/${id}`), { note });
    return data;
  }

  async refresh(companyId: number, id: number): Promise<MvrOrder> {
    const { data } = await this.post(this.url(companyId, `/orders/${id}/refresh`), {});
    return data;
  }

  async getProvider(companyId: number): Promise<MvrProviderSettings> {
    const { data } = await this.get(this.url(companyId, '/provider'));
    return data;
  }

  async saveProvider(
    companyId: number,
    dto: { provider: string; apiKey?: string; apiSecret?: string; accountId?: string; baseUrl?: string },
  ): Promise<MvrProviderSettings> {
    const { data } = await this.put(this.url(companyId, '/provider'), dto);
    return data;
  }

  async removeProvider(companyId: number): Promise<MvrProviderSettings> {
    const { data } = await this.delete(this.url(companyId, '/provider'));
    return data;
  }
}
