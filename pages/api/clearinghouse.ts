import BaseApi from './_baseApi';

/** FMCSA bulk-upload codes. */
export enum ClearinghouseQueryType {
  LIMITED = 1,
  FULL = 2,
  PRE_EMPLOYMENT = 3,
  LIMITED_WITH_AUTO_CONSENT = 4,
}

export const CLEARINGHOUSE_QUERY_TYPE_LABELS: Record<ClearinghouseQueryType, string> = {
  [ClearinghouseQueryType.LIMITED]: 'Limited query',
  [ClearinghouseQueryType.LIMITED_WITH_AUTO_CONSENT]: 'Limited query + automatic consent request',
  [ClearinghouseQueryType.FULL]: 'Full query',
  [ClearinghouseQueryType.PRE_EMPLOYMENT]: 'Pre-employment query',
};

export type ClearinghouseSubjectType = 'applicants' | 'employee';
export type ClearinghouseQueryStatus = 'EXPORTED' | 'SUBMITTED' | 'PENDING_CONSENT' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type ClearinghouseQueryResult = 'NO_RECORD' | 'RECORD_EXISTS' | 'NOT_PROHIBITED' | 'PROHIBITED';

export const CLEARINGHOUSE_STATUS_LABELS: Record<ClearinghouseQueryStatus, string> = {
  EXPORTED: 'In bulk file',
  SUBMITTED: 'Submitted',
  PENDING_CONSENT: 'Waiting on driver',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
};

export const CLEARINGHOUSE_RESULT_LABELS: Record<ClearinghouseQueryResult, string> = {
  NO_RECORD: 'No information found',
  RECORD_EXISTS: 'Information exists (full query needed)',
  NOT_PROHIBITED: 'Driver not prohibited',
  PROHIBITED: 'Driver prohibited',
};

export interface ClearinghouseQuery {
  id: number;
  subjectType: ClearinghouseSubjectType;
  subjectId: number;
  driverName: string;
  queryType: ClearinghouseQueryType;
  channel: 'BULK_FILE' | 'PROVIDER';
  provider?: string;
  externalId?: string;
  status: ClearinghouseQueryStatus;
  result?: ClearinghouseQueryResult;
  note?: string;
  completed_at?: string;
  created_at: string;
}

export interface DriverSelection {
  queryType: ClearinghouseQueryType;
  allActiveEmployees?: boolean;
  employeeIds?: number[];
  applicantIds?: number[];
}

export interface SkippedDriver {
  id: number;
  subjectType: ClearinghouseSubjectType;
  name: string;
  reasons: string[];
}

export interface BulkFile {
  filename: string;
  content: string;
  included: number;
  skipped: SkippedDriver[];
}

export interface ClearinghouseProviderOption {
  key: string;
  label: string;
  requiresAccountId: boolean;
  accountIdLabel?: string;
  setupNote?: string;
}

export interface ClearinghouseProviderSettings {
  providers: ClearinghouseProviderOption[];
  configured: boolean;
  provider: string | null;
  accountId: string | null;
  baseUrl: string | null;
  apiKeyMasked: string | null;
}

export default class ClearinghouseApi extends BaseApi {
  private url(companyId: number, path = '') {
    return `company/${companyId}/clearinghouse${path}`;
  }

  /** `record: false` previews the file without logging the queries. */
  async bulkFile(companyId: number, dto: DriverSelection & { record?: boolean }): Promise<BulkFile> {
    const { data } = await this.post(this.url(companyId, '/bulk-file'), dto);
    return data;
  }

  async list(companyId: number, filter: { subjectType?: ClearinghouseSubjectType; subjectId?: number; limit?: number } = {}): Promise<ClearinghouseQuery[]> {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([k, v]) => v !== undefined && params.set(k, String(v)));
    const { data } = await this.get(this.url(companyId, `/queries?${params}`));
    return data;
  }

  async recordResult(
    companyId: number,
    id: number,
    dto: { status?: ClearinghouseQueryStatus; result?: ClearinghouseQueryResult | null; note?: string },
  ): Promise<ClearinghouseQuery> {
    const { data } = await this.patch(this.url(companyId, `/queries/${id}`), dto);
    return data;
  }

  async order(companyId: number, dto: DriverSelection): Promise<{ orders: ClearinghouseQuery[]; skipped: SkippedDriver[] }> {
    const { data } = await this.post(this.url(companyId, '/queries'), dto);
    return data;
  }

  async refresh(companyId: number, id: number): Promise<ClearinghouseQuery> {
    const { data } = await this.post(this.url(companyId, `/queries/${id}/refresh`), {});
    return data;
  }

  async getProvider(companyId: number): Promise<ClearinghouseProviderSettings> {
    const { data } = await this.get(this.url(companyId, '/provider'));
    return data;
  }

  async saveProvider(
    companyId: number,
    dto: { provider: string; apiKey?: string; accountId?: string; baseUrl?: string },
  ): Promise<ClearinghouseProviderSettings> {
    const { data } = await this.put(this.url(companyId, '/provider'), dto);
    return data;
  }

  async removeProvider(companyId: number): Promise<ClearinghouseProviderSettings> {
    const { data } = await this.delete(this.url(companyId, '/provider'));
    return data;
  }
}

/** Saves the bulk file with the CRLF line endings FMCSA's sample uses. */
export function downloadBulkFile(file: BulkFile) {
  const blob = new Blob([file.content], { type: 'text/tab-separated-values;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
