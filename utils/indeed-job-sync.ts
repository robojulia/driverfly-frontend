/**
 * Indeed Job Sync API — GraphQL service
 *
 * Handles OAuth token management and job posting lifecycle
 * (create/upsert, update, expire) via the Indeed Job Sync API.
 *
 * Docs: https://docs.indeed.com/job-sync-api/job-sync-api-guide
 */

import axios from 'axios';
import { JobEntity } from '../models/job/job.entity';
import { CompanyEntity } from '../models/company/company.entity';
import { JobBenefits } from '../enums/jobs/job-benefits.enum';
import { JobEmploymentType } from '../enums/jobs/job-employment-type.enum';
import { JobPayMethod } from '../enums/jobs/job-pay-method.enum';

// ─── Constants ───────────────────────────────────────────────────────────────

const TOKEN_URL = 'https://apis.indeed.com/oauth/v2/tokens';
const GRAPHQL_URL = 'https://apis.indeed.com/graphql';
const SANDBOX_GRAPHQL_URL = 'https://simulated-apis.indeed.com/graphql';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface IndeedSyncResult {
  sourcedPostingId: string;
  jobPostingId: string;
  status: string;
  errors: Array<{ field?: string; message: string; code: string }>;
}

export interface IndeedExpireResult {
  sourcedPostingId: string;
  status: string;
  errors: Array<{ message: string; code: string }>;
}

interface IndeedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface CachedToken {
  accessToken: string;
  expiresAt: number; // ms since epoch
}

// ─── Benefits mapping ────────────────────────────────────────────────────────

/**
 * Maps DriverFly JobBenefits enum values to Indeed benefit enum strings.
 * Indeed accepts: HEALTH_INSURANCE, DENTAL, VISION, 401K, PAID_TIME_OFF,
 * FLEXIBLE_SCHEDULE, REMOTE_WORK, RETIREMENT_PLAN, DISABILITY_INSURANCE,
 * LIFE_INSURANCE, EMPLOYEE_ASSISTANCE_PROGRAM, TUITION_REIMBURSEMENT,
 * COMMUTER_BENEFITS, PARENTAL_LEAVE, RELOCATION_ASSISTANCE
 */
const BENEFITS_MAP: Partial<Record<JobBenefits, string>> = {
  [JobBenefits.MEDICAL]: 'HEALTH_INSURANCE',
  [JobBenefits.DENTAL]: 'DENTAL',
  [JobBenefits.VISION]: 'VISION',
  [JobBenefits.RETIREMENT_401K]: '401K',
  [JobBenefits.PAID_TRAINING]: 'TUITION_REIMBURSEMENT',
};

function mapBenefits(benefits: JobBenefits[]): string[] {
  return benefits
    .map((b) => BENEFITS_MAP[b])
    .filter((b): b is string => !!b);
}

// ─── Employment type mapping ──────────────────────────────────────────────────

function mapJobType(type: JobEmploymentType | undefined): string | undefined {
  if (!type) return undefined;
  const map: Partial<Record<JobEmploymentType, string>> = {
    [JobEmploymentType.W2]: 'FULL_TIME',
    [JobEmploymentType.PART_TIME]: 'PART_TIME',
    [JobEmploymentType.CONTRACT]: 'CONTRACT',
    [JobEmploymentType.OWNER_OPERATOR]: 'CONTRACT',
    [JobEmploymentType.SEASONAL]: 'TEMPORARY',
    [JobEmploymentType.ONE_TIME_GIG]: 'TEMPORARY',
  };
  return map[type];
}

// ─── Salary description ───────────────────────────────────────────────────────

function buildSalaryDescription(job: JobEntity): string | undefined {
  if (job.min_weekly_pay || job.max_weekly_pay) {
    if (job.min_weekly_pay && job.max_weekly_pay) {
      return `$${job.min_weekly_pay.toLocaleString()} – $${job.max_weekly_pay.toLocaleString()} per week`;
    }
    if (job.min_weekly_pay) return `From $${job.min_weekly_pay.toLocaleString()} per week`;
    return `Up to $${job.max_weekly_pay!.toLocaleString()} per week`;
  }
  if (job.min_salary || job.max_salary) {
    if (job.min_salary && job.max_salary) {
      return `$${job.min_salary.toLocaleString()} – $${job.max_salary.toLocaleString()} per year`;
    }
    if (job.min_salary) return `From $${job.min_salary.toLocaleString()} per year`;
    return `Up to $${job.max_salary!.toLocaleString()} per year`;
  }
  if (job.pay_method === JobPayMethod.HOURLY && job.min_rate) {
    if (job.max_rate) return `$${job.min_rate} – $${job.max_rate} per hour`;
    return `From $${job.min_rate} per hour`;
  }
  if (job.pay_method === JobPayMethod.RATE_PER_MILE && job.min_rate) {
    if (job.max_rate) return `$${job.min_rate} – $${job.max_rate} per mile`;
    return `From $${job.min_rate} per mile`;
  }
  return undefined;
}

// ─── Indeed Job Sync Service ──────────────────────────────────────────────────

export class IndeedJobSyncService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly sourceName: string;
  private readonly graphqlUrl: string;
  private readonly baseUrl: string;

  /** In-memory token cache — one token per service instance */
  private tokenCache: CachedToken | null = null;

  constructor(options?: {
    clientId?: string;
    clientSecret?: string;
    sourceName?: string;
    sandbox?: boolean;
    baseUrl?: string;
  }) {
    this.clientId = options?.clientId ?? process.env.INDEED_CLIENT_ID ?? '';
    this.clientSecret = options?.clientSecret ?? process.env.INDEED_CLIENT_SECRET ?? '';
    this.sourceName = options?.sourceName ?? process.env.INDEED_SOURCE_NAME ?? 'DriverFlyFeed';
    this.graphqlUrl = options?.sandbox ? SANDBOX_GRAPHQL_URL : GRAPHQL_URL;
    this.baseUrl =
      options?.baseUrl ??
      process.env.NEXT_PUBLIC_BASE_URL ??
      'https://driverfly.com';
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  /**
   * Returns a valid access token, refreshing if necessary.
   * Tokens are cached in memory for their full 1-hour lifespan
   * minus a 30-second safety buffer.
   */
  async getAccessToken(): Promise<string> {
    const now = Date.now();
    const buffer = 30_000; // 30 s

    if (this.tokenCache && this.tokenCache.expiresAt - buffer > now) {
      return this.tokenCache.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        'INDEED_CLIENT_ID and INDEED_CLIENT_SECRET must be set to use the Job Sync API',
      );
    }

    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'employer_access',
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const response = await axios.post<IndeedTokenResponse>(TOKEN_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });

    const { access_token, expires_in } = response.data;
    this.tokenCache = {
      accessToken: access_token,
      expiresAt: now + expires_in * 1000,
    };

    return access_token;
  }

  // ── GraphQL helper ────────────────────────────────────────────────────────

  private async graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    const token = await this.getAccessToken();

    const response = await axios.post<{ data: T; errors?: Array<{ message: string; extensions?: { code: string } }> }>(
      this.graphqlUrl,
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.data.errors?.length) {
      const first = response.data.errors[0];
      const code = first.extensions?.code ?? 'UNKNOWN';
      throw new Error(`Indeed GraphQL error [${code}]: ${first.message}`);
    }

    return response.data.data;
  }

  // ── Job mapping ───────────────────────────────────────────────────────────

  /**
   * Maps a DriverFly JobEntity + CompanyEntity to an Indeed
   * SourcedJobPostingInput GraphQL variable object.
   */
  buildJobPostingInput(job: JobEntity, company: CompanyEntity): Record<string, unknown> {
    const location = job.location ?? ({} as import('../models/company/location.entity').LocationEntity);
    const cityRegionPostal = [
      location.city,
      location.state,
      location.zip_code,
    ]
      .filter(Boolean)
      .join(', ');

    const benefits = mapBenefits(job.benefits ?? []);
    const salaryNote = buildSalaryDescription(job);

    // Build an enriched description that mirrors the XML feed helper
    let description = job.description ?? '';
    if (salaryNote) description += `\n\n<strong>Compensation:</strong> ${salaryNote}`;
    if (job.geography)
      description += `\n<strong>Route Type:</strong> ${job.geography.replace(/_/g, ' ')}`;
    if (job.schedule)
      description += `\n<strong>Schedule:</strong> ${job.schedule.replace(/_/g, ' ')}`;
    if (job.cdl_class)
      description += `\n<strong>Required License:</strong> CDL ${job.cdl_class}`;
    if (job.must_pass_drug_test)
      description += `\n<strong>Drug Testing:</strong> Required`;

    const applyUrl = `${this.baseUrl}/apply/${job.slug ?? job.id}`;

    const input: Record<string, unknown> = {
      body: {
        title: job.title,
        description,
        location: {
          country: 'US',
          cityRegionPostal,
          ...(location.street ? { streetAddress: location.street } : {}),
          ...(location.latitude != null ? { latitude: location.latitude } : {}),
          ...(location.longitude != null ? { longitude: location.longitude } : {}),
        },
        ...(benefits.length ? { benefits } : {}),
        ...(mapJobType(job.employment_type)
          ? { jobType: mapJobType(job.employment_type) }
          : {}),
      },
      metadata: {
        jobPostingId: String(job.id),
        datePublished: (job.created_at
          ? new Date(job.created_at)
          : new Date()
        ).toISOString(),
        url: applyUrl,
        jobSource: {
          companyName: company.name ?? 'DriverFly',
          sourceName: this.sourceName,
          sourceType: 'Employer',
        },
        ...(company.phone
          ? {
              contacts: [
                {
                  contactType: 'RECRUITER',
                  contactName: company.name ?? 'Recruiter',
                  contactPhone: normalizePhone(company.phone),
                },
              ],
            }
          : {}),
      },
    };

    return input;
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * Creates or updates (upserts) a single job posting on Indeed.
   * Safe to retry — same sourceName + jobPostingId combo will update, not duplicate.
   */
  async createOrUpdateJob(
    job: JobEntity,
    company: CompanyEntity,
  ): Promise<IndeedSyncResult> {
    const postingInput = this.buildJobPostingInput(job, company);

    const mutation = /* GraphQL */ `
      mutation CreateOrUpdateJob($jobPostings: [SourcedJobPostingInput!]!) {
        jobsIngest {
          createSourcedJobPostings(jobPostings: $jobPostings) {
            jobPostingResults {
              sourcedPostingId
              jobPostingId
              status
              errors {
                field
                message
                code
              }
            }
          }
        }
      }
    `;

    const data = await this.graphql<{
      jobsIngest: {
        createSourcedJobPostings: {
          jobPostingResults: IndeedSyncResult[];
        };
      };
    }>(mutation, { jobPostings: [postingInput] });

    const results = data.jobsIngest.createSourcedJobPostings.jobPostingResults;
    if (!results?.length) {
      throw new Error('Indeed returned an empty result set for createSourcedJobPostings');
    }

    return results[0];
  }

  /**
   * Expires (closes) a job posting by its Indeed-generated sourcedPostingId.
   * The sourcedPostingId is returned by createOrUpdateJob and should be
   * persisted in your database.
   */
  async expireJob(sourcedPostingId: string): Promise<IndeedExpireResult> {
    const mutation = /* GraphQL */ `
      mutation ExpireJob($jobs: [ExpireSourcedJobBySourcedPostingIdInput!]!) {
        jobsIngest {
          expireSourcedJobsBySourcedPostingId(jobs: $jobs) {
            results {
              sourcedPostingId
              status
              errors {
                message
                code
              }
            }
          }
        }
      }
    `;

    const data = await this.graphql<{
      jobsIngest: {
        expireSourcedJobsBySourcedPostingId: {
          results: IndeedExpireResult[];
        };
      };
    }>(mutation, { jobs: [{ sourcedPostingId }] });

    const results = data.jobsIngest.expireSourcedJobsBySourcedPostingId.results;
    if (!results?.length) {
      throw new Error('Indeed returned an empty result set for expireSourcedJobsBySourcedPostingId');
    }

    return results[0];
  }

  /**
   * Syncs multiple jobs in sequence (one request per job as recommended by Indeed).
   * Returns an array of results in the same order as the input jobs array.
   */
  async syncJobs(
    jobs: JobEntity[],
    company: CompanyEntity,
  ): Promise<IndeedSyncResult[]> {
    const results: IndeedSyncResult[] = [];
    for (const job of jobs) {
      const result = await this.createOrUpdateJob(job, company);
      results.push(result);
    }
    return results;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalises a phone number to E.164 format expected by Indeed.
 * Assumes US numbers when no country code is present.
 */
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('1') && digits.length === 11) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}

// ─── Singleton factory ────────────────────────────────────────────────────────

let _instance: IndeedJobSyncService | null = null;

/** Returns a shared singleton service instance (server-side only). */
export function getIndeedJobSyncService(): IndeedJobSyncService {
  if (!_instance) {
    _instance = new IndeedJobSyncService();
  }
  return _instance;
}
