import BaseApi from './_baseApi';
import { FbLeadsDto } from '../../models/fb-leads.dto';
import { FacebookFormJobMapping } from '../../models/integrations/providers/facebook/facebook-lead-types';

export default class FbLeadsApi extends BaseApi {
  baseUrl: string = 'fb-leads';

  constructor() {
    super();
  }

  // ─── Legacy / existing ────────────────────────────────────────────────────

  /** Creates a Facebook Lead Ad form via the backend (original method). */
  async fbLeads(dto: FbLeadsDto): Promise<FbLeadsDto> {
    const { data } = await this.post(this.baseUrl, dto);
    return data;
  }

  // ─── OAuth / Connection ────────────────────────────────────────────────────

  /**
   * Initiates the Facebook OAuth flow for a company.
   * Redirects the user to Facebook to authorize DriverFly to access their Page leads.
   */
  async fbLogin(companyId: number): Promise<{ redirectUrl: string }> {
    const { data } = await this.get(
      this.buildUrl(`${this.baseUrl}/facebook/auth`, { companyId }),
    );
    return data;
  }

  /**
   * Checks whether the given company has an active Facebook connection.
   */
  async getConnectionStatus(companyId: number): Promise<{ connected: boolean; pageId?: string; pageName?: string }> {
    const { data } = await this.get(
      this.buildUrl(`${this.baseUrl}/connection-status`, { companyId }),
    );
    return data;
  }

  /**
   * Revokes the stored Facebook access token for a company.
   */
  async disconnect(companyId: number): Promise<void> {
    await this.delete(this.buildUrl(`${this.baseUrl}/disconnect`, { companyId }));
  }

  // ─── Form → Job Mappings ────────────────────────────────────────────────────

  /**
   * Lists all Facebook form → DriverFly job mappings for a company.
   */
  async getFormJobMappings(companyId: number): Promise<FacebookFormJobMapping[]> {
    const { data } = await this.get(
      this.buildUrl(`${this.baseUrl}/form-job-mappings`, { companyId }),
    );
    return data;
  }

  /**
   * Creates a new mapping between a Facebook Lead Ad form and a DriverFly job.
   * After this is saved, any new lead from `form_id` will automatically be
   * linked to the specified job.
   */
  async createFormJobMapping(
    dto: Omit<FacebookFormJobMapping, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<FacebookFormJobMapping> {
    const { data } = await this.post(`${this.baseUrl}/form-job-mappings`, dto);
    return data;
  }

  /**
   * Updates an existing form → job mapping (e.g. to change the target job).
   */
  async updateFormJobMapping(
    id: number,
    dto: Partial<Omit<FacebookFormJobMapping, 'id' | 'created_at' | 'updated_at'>>,
  ): Promise<FacebookFormJobMapping> {
    const { data } = await this.put(`${this.baseUrl}/form-job-mappings/${id}`, dto);
    return data;
  }

  /**
   * Deletes a form → job mapping.
   */
  async deleteFormJobMapping(id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/form-job-mappings/${id}`);
  }

  // ─── Lead Processing ────────────────────────────────────────────────────────

  /**
   * Manually triggers processing of a specific Facebook lead by its ID.
   * The backend will fetch the lead from the Graph API, map it to an
   * applicant, and either create or update the applicant record.
   */
  async processLead(leadgenId: string, companyId: number): Promise<{ applicantId: number }> {
    const { data } = await this.post(`${this.baseUrl}/process-lead`, {
      leadgen_id: leadgenId,
      company_id: companyId,
    });
    return data;
  }

  /**
   * Returns a paginated list of leads received for a company.
   */
  async getLeads(params: {
    companyId: number;
    page?: number;
    limit?: number;
    formId?: string;
    jobId?: number;
  }): Promise<{ items: any[]; total: number }> {
    const { data } = await this.get(this.buildUrl(`${this.baseUrl}/leads`, params));
    return data;
  }

  // ─── Facebook Page / Form Info ─────────────────────────────────────────────

  /**
   * Returns the list of Lead Ad forms available on the connected Facebook Page.
   * Used to populate the form-job mapping UI.
   */
  async getPageForms(companyId: number): Promise<{ id: string; name: string }[]> {
    const { data } = await this.get(
      this.buildUrl(`${this.baseUrl}/page-forms`, { companyId }),
    );
    return data;
  }
}
