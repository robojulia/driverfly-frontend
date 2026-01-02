import axios, { AxiosInstance, AxiosError } from 'axios';
import crypto from 'crypto';
import {
  IATSProvider,
  ATSCredentials,
  IntegrationConnectionData,
  ATSApplicant,
  ATSWebhookEvent,
  CampaignActivityDto,
  FetchOptions,
  ConnectionTestResult,
} from '../../ats-provider.interface';
import { ATSProvider } from '../../../../enums/integrations/ats-provider.enum';
import { ApplicantEntity } from '../../../applicant/applicant.entity';
import { TenstreetFieldMapper } from './tenstreet-field-mapper';
import {
  TenstreetApplicant,
  TenstreetApplicantsResponse,
  TenstreetWebhookPayload,
  TenstreetCreateNoteRequest,
  TenstreetErrorResponse,
} from './tenstreet-types';

export class TenstreetProvider implements IATSProvider {
  providerName = 'TENSTREET';
  private axiosInstance: AxiosInstance | null = null;

  /**
   * Get base URL based on environment
   */
  private getBaseUrl(credentials: ATSCredentials): string {
    if (credentials.useSandbox) {
      return credentials.baseUrl || 'https://sandbox.tenstreet.com/api/v1';
    }
    return credentials.baseUrl || 'https://api.tenstreet.com/api/v1';
  }

  /**
   * Create configured axios instance
   */
  private createAxiosInstance(credentials: ATSCredentials): AxiosInstance {
    const baseURL = this.getBaseUrl(credentials);
    const apiKey = credentials.useSandbox ? credentials.sandboxApiKey : credentials.apiKey;

    return axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Test connection to Tenstreet API
   */
  async testConnection(credentials: ATSCredentials): Promise<ConnectionTestResult> {
    try {
      const instance = this.createAxiosInstance(credentials);

      // Try to fetch a small batch of applicants to test connection
      const response = await instance.get<TenstreetApplicantsResponse>('/applicants', {
        params: {
          page: 1,
          pageSize: 1,
        },
      });

      return {
        success: true,
        message: 'Successfully connected to Tenstreet API',
        details: {
          connectedToAPI: true,
          canFetchApplicants: true,
          applicantCount: response.data.totalCount,
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError<TenstreetErrorResponse>;

      let message = 'Failed to connect to Tenstreet API';
      if (axiosError.response?.status === 401) {
        message = 'Invalid API credentials - check API key';
      } else if (axiosError.response?.status === 403) {
        message = 'Access forbidden - insufficient permissions';
      } else if (axiosError.response?.data?.error) {
        message = axiosError.response.data.error.message;
      } else if (axiosError.message) {
        message = axiosError.message;
      }

      return {
        success: false,
        message,
        details: {
          connectedToAPI: false,
          canFetchApplicants: false,
        },
      };
    }
  }

  /**
   * Fetch all applicants with pagination
   */
  async fetchApplicants(
    connection: IntegrationConnectionData,
    options: FetchOptions = {}
  ): Promise<ATSApplicant[]> {
    const instance = this.createAxiosInstance(connection.credentials);
    const allApplicants: ATSApplicant[] = [];

    let page = options.page || 1;
    const pageSize = options.pageSize || 100;
    let hasMore = true;

    try {
      while (hasMore) {
        const params: any = {
          page,
          pageSize,
          includeInactive: options.includeInactive || false,
        };

        // Add modifiedSince filter for incremental sync
        if (options.modifiedSince) {
          params.modifiedSince = options.modifiedSince.toISOString();
        }

        const response = await instance.get<TenstreetApplicantsResponse>('/applicants', {
          params,
        });

        const applicants = response.data.applicants.map(tenstreetApplicant => ({
          externalId: tenstreetApplicant.PersonId,
          provider: ATSProvider.TENSTREET,
          rawData: tenstreetApplicant,
          mappedData: TenstreetFieldMapper.mapToDriverFly(tenstreetApplicant),
          lastUpdatedAt: new Date(tenstreetApplicant.ModifiedDate || tenstreetApplicant.CreatedDate || new Date()),
        }));

        allApplicants.push(...applicants);

        // Check if there are more pages
        hasMore = allApplicants.length < response.data.totalCount;
        page++;

        // Break if we've fetched all available applicants
        if (!hasMore) break;
      }

      return allApplicants;
    } catch (error) {
      this.handleApiError(error, 'Fetch applicants from Tenstreet');
      throw error;
    }
  }

  /**
   * Fetch a single applicant by external ID
   */
  async fetchApplicantById(
    connection: IntegrationConnectionData,
    externalId: string
  ): Promise<ATSApplicant> {
    const instance = this.createAxiosInstance(connection.credentials);

    try {
      const response = await instance.get<TenstreetApplicant>(`/applicants/${externalId}`);
      const tenstreetApplicant = response.data;

      return {
        externalId: tenstreetApplicant.PersonId,
        provider: ATSProvider.TENSTREET,
        rawData: tenstreetApplicant,
        mappedData: TenstreetFieldMapper.mapToDriverFly(tenstreetApplicant),
        lastUpdatedAt: new Date(tenstreetApplicant.ModifiedDate || tenstreetApplicant.CreatedDate || new Date()),
      };
    } catch (error) {
      this.handleApiError(error, `Fetch applicant ${externalId} from Tenstreet`);
      throw error;
    }
  }

  /**
   * Update applicant status in Tenstreet
   */
  async updateApplicantStatus(
    connection: IntegrationConnectionData,
    externalId: string,
    status: string,
    notes?: string
  ): Promise<void> {
    const instance = this.createAxiosInstance(connection.credentials);

    try {
      // Update status via PATCH
      await instance.patch(`/applicants/${externalId}`, {
        ApplicationStatus: status,
      });

      // Add note if provided
      if (notes) {
        await this.addNote(instance, externalId, {
          noteType: 'GENERAL',
          noteText: notes,
          createdBy: 'DriverFly Integration',
        });
      }
    } catch (error) {
      this.handleApiError(error, `Update applicant ${externalId} status in Tenstreet`);
      throw error;
    }
  }

  /**
   * Push campaign activity to Tenstreet as a note
   */
  async pushCampaignActivity(
    connection: IntegrationConnectionData,
    externalId: string,
    activity: CampaignActivityDto
  ): Promise<void> {
    const instance = this.createAxiosInstance(connection.credentials);

    try {
      const noteText = this.buildCampaignActivityNote(activity);

      await this.addNote(instance, externalId, {
        noteType: 'OUTREACH',
        noteText,
        createdBy: 'DriverFly AI Campaigns',
        category: 'Recruiting Outreach',
      });
    } catch (error) {
      this.handleApiError(error, `Push campaign activity for applicant ${externalId} to Tenstreet`);
      throw error;
    }
  }

  /**
   * Add a note to an applicant in Tenstreet
   */
  private async addNote(
    instance: AxiosInstance,
    personId: string,
    note: TenstreetCreateNoteRequest
  ): Promise<void> {
    await instance.post(`/applicants/${personId}/notes`, note);
  }

  /**
   * Build campaign activity note text
   */
  private buildCampaignActivityNote(activity: CampaignActivityDto): string {
    const activityTypeLabel = {
      'sms_sent': 'SMS sent',
      'voice_call_made': 'Voice call made',
      'email_sent': 'Email sent',
      'response_received': 'Response received',
    }[activity.activityType] || activity.activityType;

    const outcomeLabel = activity.outcome ? {
      'interested': 'Interested',
      'not_interested': 'Not interested',
      'no_response': 'No response',
    }[activity.outcome] : '';

    return `DriverFly AI Campaign Activity
Campaign: ${activity.campaignName}
Activity: ${activityTypeLabel}
${outcomeLabel ? `Outcome: ${outcomeLabel}` : ''}
Timestamp: ${new Date(activity.timestamp).toLocaleString()}

${activity.details}

---
Generated by DriverFly AI Campaigns`;
  }

  /**
   * Validate webhook signature using HMAC-SHA256
   */
  validateWebhookSignature(payload: any, signature: string, secret: string): boolean {
    try {
      const hmac = crypto.createHmac('sha256', secret);
      const payloadString = JSON.stringify(payload);
      const expectedSignature = hmac.update(payloadString).digest('hex');

      // Constant-time comparison to prevent timing attacks
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('Error validating webhook signature:', error);
      return false;
    }
  }

  /**
   * Parse webhook event from Tenstreet
   */
  parseWebhookEvent(payload: any): ATSWebhookEvent {
    const tenstreetPayload = payload as TenstreetWebhookPayload;

    return {
      eventType: tenstreetPayload.eventType,
      externalId: tenstreetPayload.data.PersonId,
      timestamp: new Date(tenstreetPayload.timestamp),
      payload: tenstreetPayload.data,
    };
  }

  /**
   * Map to DriverFly applicant format
   */
  mapToDriverFlyApplicant(atsApplicant: any): Partial<ApplicantEntity> {
    return TenstreetFieldMapper.mapToDriverFly(atsApplicant as TenstreetApplicant);
  }

  /**
   * Map from DriverFly applicant format to Tenstreet
   */
  mapFromDriverFlyApplicant(applicant: ApplicantEntity): any {
    return TenstreetFieldMapper.mapFromDriverFly(applicant);
  }

  /**
   * Handle API errors consistently
   */
  private handleApiError(error: unknown, context: string): void {
    const axiosError = error as AxiosError<TenstreetErrorResponse>;

    if (axiosError.response) {
      const status = axiosError.response.status;
      const errorData = axiosError.response.data?.error;

      console.error(`${context} failed (HTTP ${status}):`, {
        code: errorData?.code,
        message: errorData?.message,
        details: errorData?.details,
      });
    } else if (axiosError.request) {
      console.error(`${context} failed - No response received:`, axiosError.message);
    } else {
      console.error(`${context} failed:`, axiosError.message);
    }
  }
}
