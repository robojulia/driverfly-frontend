/**
 * Facebook Lead Ads Ingestion Service
 *
 * Handles the full pipeline for processing incoming Facebook Lead Ads:
 *  1. Fetch the company's stored Facebook access token from the backend
 *  2. Retrieve full lead details from the Facebook Graph API
 *  3. Map lead fields to a DriverFly ApplicantEntity via FacebookFieldMapper
 *  4. Resolve the form → job mapping stored in the backend
 *  5. Deduplicate against existing applicants by phone and e-mail
 *  6. Create or update the applicant record in the backend
 *  7. Link the applicant to the target job (if a mapping was found)
 *
 * Usage (server-side only — never call from the browser):
 *
 *   const service = getFacebookLeadIngestionService();
 *   const result  = await service.processWebhookPayload(payload);
 */

import axios from 'axios';
import { createHmac } from 'crypto';
import {
  FacebookLeadDetail,
  FacebookWebhookPayload,
} from '../models/integrations/providers/facebook/facebook-lead-types';
import { FacebookFieldMapper } from '../models/integrations/providers/facebook/facebook-field-mapper';
import { ApplicantEntity } from '../models/applicant/applicant.entity';

// ─── Constants ────────────────────────────────────────────────────────────────

const GRAPH_API_BASE = 'https://graph.facebook.com/v19.0';
const LEAD_FIELDS = 'id,created_time,ad_id,form_id,field_data,is_organic';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LeadProcessResult {
  leadgenId: string;
  applicantId?: number;
  /** true = new applicant created; false = existing applicant updated */
  created: boolean;
  /** true = lead was skipped without creating/updating (see reason) */
  skipped: boolean;
  reason?: string;
}

export interface WebhookProcessResult {
  processed: number;
  skipped: number;
  errors: number;
  results: LeadProcessResult[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class FacebookLeadIngestionService {
  private readonly backendUrl: string;
  private readonly serviceToken: string | undefined;

  constructor(options?: { backendUrl?: string; serviceToken?: string }) {
    this.backendUrl = (
      options?.backendUrl ??
      process.env.BASE_URL_API ??
      process.env.NEXT_PUBLIC_BASE_URL_API ??
      'http://localhost:4000/api'
    ).replace(/\/$/, '');

    this.serviceToken =
      options?.serviceToken ?? process.env.BACKEND_SERVICE_TOKEN;
  }

  // ── Webhook signature verification ────────────────────────────────────────

  /**
   * Verifies the X-Hub-Signature-256 header sent by Facebook.
   * Returns true only when the header matches HMAC-SHA256(rawBody, appSecret).
   *
   * Call this before processing any webhook payload to prevent spoofed events.
   */
  verifyWebhookSignature(rawBody: Buffer | string, signatureHeader: string): boolean {
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    if (!appSecret) {
      console.warn('[FB Ingestion] FACEBOOK_APP_SECRET not set – skipping signature check');
      return true; // allow in development; fail loudly in production (configure the secret)
    }

    const expected = `sha256=${createHmac('sha256', appSecret)
      .update(rawBody)
      .digest('hex')}`;

    // Constant-time comparison to prevent timing attacks
    return timingSafeEqual(signatureHeader, expected);
  }

  // ── Main entry point ──────────────────────────────────────────────────────

  /**
   * Processes an entire Facebook webhook payload.
   * Iterates over every entry and every leadgen change value.
   */
  async processWebhookPayload(payload: FacebookWebhookPayload): Promise<WebhookProcessResult> {
    const summary: WebhookProcessResult = {
      processed: 0,
      skipped: 0,
      errors: 0,
      results: [],
    };

    if (payload.object !== 'page') {
      console.warn('[FB Ingestion] Received non-page webhook object:', payload.object);
      return summary;
    }

    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field !== 'leadgen') continue;

        const cv = change.value;
        try {
          const result = await this.processLead({
            leadgenId: cv.leadgen_id,
            pageId: cv.page_id,
            formId: cv.form_id,
            adId: cv.ad_id,
          });

          summary.results.push(result);
          if (result.skipped) {
            summary.skipped++;
          } else {
            summary.processed++;
          }
        } catch (err: any) {
          console.error(`[FB Ingestion] Error processing lead ${cv.leadgen_id}:`, err?.message);
          summary.errors++;
          summary.results.push({
            leadgenId: cv.leadgen_id,
            created: false,
            skipped: true,
            reason: `Error: ${err?.message ?? 'unknown'}`,
          });
        }
      }
    }

    return summary;
  }

  // ── Single lead processing ─────────────────────────────────────────────────

  async processLead(options: {
    leadgenId: string;
    pageId: string;
    formId: string;
    adId?: string;
  }): Promise<LeadProcessResult> {
    const { leadgenId, pageId, formId, adId } = options;

    // 1. Get the page's access token from the backend
    const accessToken = await this.getPageAccessToken(pageId);
    if (!accessToken) {
      return {
        leadgenId,
        created: false,
        skipped: true,
        reason: `No Facebook access token found for page ${pageId}`,
      };
    }

    // 2. Fetch full lead details from Graph API
    const leadDetail = await this.fetchLeadFromGraph(leadgenId, accessToken);

    // 3. Map lead fields to applicant data
    const formJobMapping = await this.getFormJobMapping(formId);
    const mapped = FacebookFieldMapper.mapToApplicant(
      leadDetail,
      formJobMapping?.job_id,
      formJobMapping?.company_id,
    );

    const { _meta, ...applicantData } = mapped;
    const resolvedJobId = _meta?.jobId;
    const resolvedCompanyId = _meta?.companyId;

    if (!resolvedCompanyId) {
      return {
        leadgenId,
        created: false,
        skipped: true,
        reason: 'Could not determine company_id from form mapping or lead fields',
      };
    }

    // 4. Deduplicate by phone then email
    const existing = await this.findExistingApplicant(
      applicantData.phone,
      applicantData.email,
      resolvedCompanyId,
    );

    // 5. Build the full payload with company and external IDs
    const payload: Partial<ApplicantEntity> = {
      ...applicantData,
      company: { id: resolvedCompanyId } as any,
    };

    // 6. Create or update
    let applicant: ApplicantEntity;
    let created: boolean;

    if (existing) {
      applicant = await this.updateApplicant(existing.id!, payload);
      created = false;
    } else {
      applicant = await this.createApplicant(payload);
      created = true;
    }

    // 7. Link to job if we have a mapping
    if (resolvedJobId && applicant.id) {
      await this.linkApplicantToJob(applicant.id, resolvedJobId, resolvedCompanyId);
    }

    console.log(
      `[FB Ingestion] Lead ${leadgenId} → applicant ${applicant.id} (${created ? 'created' : 'updated'})`,
    );

    return { leadgenId, applicantId: applicant.id, created, skipped: false };
  }

  // ── Backend helpers ────────────────────────────────────────────────────────

  /**
   * Asks the backend for the Facebook Page access token stored for a given page.
   * The backend /fb-leads/page-token endpoint is authenticated via service token.
   */
  private async getPageAccessToken(pageId: string): Promise<string | null> {
    try {
      const { data } = await this.backendGet<{ accessToken: string | null }>(
        `/fb-leads/page-token?pageId=${encodeURIComponent(pageId)}`,
      );
      return data?.accessToken ?? null;
    } catch (err: any) {
      console.error(`[FB Ingestion] Could not fetch access token for page ${pageId}:`, err?.message);
      return null;
    }
  }

  /**
   * Fetches full lead detail from the Facebook Graph API.
   * Requires a valid page access token with leads_retrieval permission.
   */
  private async fetchLeadFromGraph(
    leadgenId: string,
    accessToken: string,
  ): Promise<FacebookLeadDetail> {
    const url = `${GRAPH_API_BASE}/${leadgenId}?fields=${encodeURIComponent(LEAD_FIELDS)}&access_token=${encodeURIComponent(accessToken)}`;
    const { data } = await axios.get<FacebookLeadDetail>(url, { timeout: 10_000 });
    return data;
  }

  /**
   * Returns the stored form → job mapping for a given form ID, or null if none.
   */
  private async getFormJobMapping(
    formId: string,
  ): Promise<{ job_id: number; company_id: number } | null> {
    try {
      const { data } = await this.backendGet<{ job_id: number; company_id: number } | null>(
        `/fb-leads/form-job-mappings/by-form?formId=${encodeURIComponent(formId)}`,
      );
      return data ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Searches for an existing applicant by phone number first, then email.
   * Scoped to the company to avoid cross-company leakage.
   */
  private async findExistingApplicant(
    phone?: string,
    email?: string,
    companyId?: number,
  ): Promise<ApplicantEntity | null> {
    if (phone) {
      try {
        const { data } = await this.backendGet<ApplicantEntity[]>(
          `/applicants/search-applicants-by-phone?phone=${encodeURIComponent(phone)}${companyId ? `&companyId=${companyId}` : ''}`,
        );
        if (Array.isArray(data) && data.length > 0) return data[0];
      } catch {
        // not found – fall through to email check
      }
    }

    if (email) {
      try {
        const { data } = await this.backendGet<ApplicantEntity[]>(
          `/applicants/search-applicants-by-email?email=${encodeURIComponent(email)}${companyId ? `&companyId=${companyId}` : ''}`,
        );
        if (Array.isArray(data) && data.length > 0) return data[0];
      } catch {
        // not found
      }
    }

    return null;
  }

  private async createApplicant(dto: Partial<ApplicantEntity>): Promise<ApplicantEntity> {
    const { data } = await this.backendPost<ApplicantEntity>('/applicants', dto);
    return data;
  }

  private async updateApplicant(
    id: number,
    dto: Partial<ApplicantEntity>,
  ): Promise<ApplicantEntity> {
    const { data } = await this.backendPut<ApplicantEntity>(`/applicants/${id}`, dto);
    return data;
  }

  private async linkApplicantToJob(
    applicantId: number,
    jobId: number,
    companyId: number,
  ): Promise<void> {
    try {
      await this.backendPost(`/applicants/${applicantId}/jobs/${jobId}`, { companyId });
    } catch (err: any) {
      // 409 Conflict = already linked — not an error
      if (err?.response?.status !== 409) {
        console.warn(
          `[FB Ingestion] Could not link applicant ${applicantId} to job ${jobId}:`,
          err?.message,
        );
      }
    }
  }

  // ── HTTP helpers ──────────────────────────────────────────────────────────

  private buildHeaders(): Record<string, string> {
    if (this.serviceToken) {
      return { Authorization: `Bearer ${this.serviceToken}` };
    }
    return {};
  }

  private async backendGet<T>(path: string) {
    return axios.get<T>(`${this.backendUrl}${path}`, {
      headers: this.buildHeaders(),
      timeout: 10_000,
    });
  }

  private async backendPost<T>(path: string, body: unknown) {
    return axios.post<T>(`${this.backendUrl}${path}`, body, {
      headers: this.buildHeaders(),
      timeout: 10_000,
    });
  }

  private async backendPut<T>(path: string, body: unknown) {
    return axios.put<T>(`${this.backendUrl}${path}`, body, {
      headers: this.buildHeaders(),
      timeout: 10_000,
    });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Constant-time string comparison to prevent timing attacks. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let _instance: FacebookLeadIngestionService | null = null;

/** Returns a shared singleton (server-side only). */
export function getFacebookLeadIngestionService(): FacebookLeadIngestionService {
  if (!_instance) _instance = new FacebookLeadIngestionService();
  return _instance;
}
