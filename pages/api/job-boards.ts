import BaseApi from './_baseApi';

export type JobBoardProvider = 'facebook' | 'linkedin' | 'indeed';

export interface JobBoardField {
  key: string;
  label: string;
  secret: boolean;
  required: boolean;
  help?: string;
}

export interface JobBoardConnection {
  provider: JobBoardProvider;
  label: string;
  fields: JobBoardField[];
  connected: boolean;
  /** Non-secret fields as entered; secret fields masked as `••••1234`. */
  values: Record<string, string>;
  accountId?: string | null;
  accountName?: string | null;
  expiresAt?: string | null;
  lastVerifiedAt?: string | null;
  lastError?: string | null;
  /** Set on save/test when it connected but something needs attention (e.g. a short-lived token). */
  warning?: string;
}

export interface JobBoardPosting {
  id: number;
  jobId: number;
  provider: JobBoardProvider;
  status: 'posted' | 'failed' | 'removed';
  externalId?: string | null;
  externalUrl?: string | null;
  error?: string | null;
  removedAt?: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobBoardPreview {
  provider: JobBoardProvider;
  text: string;
  url: string;
}

export const JOB_BOARD_LABELS: Record<JobBoardProvider, string> = {
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  indeed: 'Indeed',
};

/** The backend's message for a failed request (platform errors come through as-is). */
export function jobBoardErrorMessage(err: any, fallback = 'Something went wrong'): string {
  const message = err?.response?.data?.message;
  if (Array.isArray(message)) return message.join(' ');
  return message || err?.message || fallback;
}

export default class JobBoardsApi extends BaseApi {
  private url(companyId: number, path = '') {
    return `company/${companyId}/job-boards${path}`;
  }

  async getConnections(companyId: number): Promise<JobBoardConnection[]> {
    const { data } = await this.get(this.url(companyId, '/connections'));
    return data;
  }

  /** Verifies with the platform before saving; a secret left blank keeps the one on file. */
  async saveConnection(companyId: number, provider: JobBoardProvider, values: Record<string, string>): Promise<JobBoardConnection> {
    const { data } = await this.put(this.url(companyId, `/connections/${provider}`), { values });
    return data;
  }

  async testConnection(companyId: number, provider: JobBoardProvider): Promise<JobBoardConnection> {
    const { data } = await this.post(this.url(companyId, `/connections/${provider}/test`), {});
    return data;
  }

  async removeConnection(companyId: number, provider: JobBoardProvider): Promise<void> {
    await this.delete(this.url(companyId, `/connections/${provider}`));
  }

  async getPostings(companyId: number, jobId: number): Promise<JobBoardPosting[]> {
    const { data } = await this.get(this.url(companyId, `/jobs/${jobId}/postings`));
    return data;
  }

  async getPreview(companyId: number, jobId: number): Promise<JobBoardPreview[]> {
    const { data } = await this.get(this.url(companyId, `/jobs/${jobId}/preview`));
    return data;
  }

  async publish(companyId: number, jobId: number, providers: JobBoardProvider[]): Promise<JobBoardPosting[]> {
    const { data } = await this.post(this.url(companyId, `/jobs/${jobId}/publish`), { providers });
    return data;
  }

  async removePosting(companyId: number, postingId: number): Promise<JobBoardPosting> {
    const { data } = await this.delete(this.url(companyId, `/postings/${postingId}`));
    return data;
  }
}
