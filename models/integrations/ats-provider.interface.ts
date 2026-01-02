import { ATSProvider } from '../../enums/integrations/ats-provider.enum';
import { ApplicantEntity } from '../applicant/applicant.entity';

export interface IATSProvider {
  providerName: string; // 'TENSTREET', 'GREENHOUSE', etc.

  // Connection & Authentication
  testConnection(credentials: ATSCredentials): Promise<ConnectionTestResult>;

  // Inbound Sync (ATS → DriverFly)
  fetchApplicants(connection: IntegrationConnectionData, options: FetchOptions): Promise<ATSApplicant[]>;
  fetchApplicantById(connection: IntegrationConnectionData, externalId: string): Promise<ATSApplicant>;

  // Outbound Sync (DriverFly → ATS)
  updateApplicantStatus(
    connection: IntegrationConnectionData,
    externalId: string,
    status: string,
    notes?: string
  ): Promise<void>;

  pushCampaignActivity(
    connection: IntegrationConnectionData,
    externalId: string,
    activity: CampaignActivityDto
  ): Promise<void>;

  // Webhook Handling
  validateWebhookSignature(payload: any, signature: string, secret: string): boolean;
  parseWebhookEvent(payload: any): ATSWebhookEvent;

  // Field Mapping
  mapToDriverFlyApplicant(atsApplicant: any): Partial<ApplicantEntity>;
  mapFromDriverFlyApplicant(applicant: ApplicantEntity): any;
}

export interface ATSCredentials {
  provider: ATSProvider;
  apiKey?: string;
  apiSecret?: string;
  baseUrl?: string;
  customFields?: Record<string, any>;
  useSandbox?: boolean;
  sandboxApiKey?: string;
}

export interface IntegrationConnectionData {
  id: number;
  provider: ATSProvider;
  credentials: ATSCredentials;
  fieldMappingConfig?: FieldMappingConfig;
}

export interface ATSApplicant {
  externalId: string;
  provider: ATSProvider;
  rawData: any;
  mappedData: Partial<ApplicantEntity>;
  lastUpdatedAt: Date;
}

export interface ATSWebhookEvent {
  eventType: 'applicant.created' | 'applicant.updated' | 'applicant.deleted' | 'applicant.status_changed';
  externalId: string;
  timestamp: Date;
  payload: any;
}

export interface CampaignActivityDto {
  activityType: 'sms_sent' | 'voice_call_made' | 'email_sent' | 'response_received';
  timestamp: Date;
  details: string;
  campaignId: number;
  campaignName: string;
  outcome?: 'interested' | 'not_interested' | 'no_response';
}

export interface FetchOptions {
  includeInactive?: boolean;
  modifiedSince?: Date;
  page?: number;
  pageSize?: number;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    connectedToAPI: boolean;
    canFetchApplicants: boolean;
    applicantCount?: number;
  };
}

export interface FieldMappingConfig {
  customMappings: Array<{
    atsField: string;
    driverflyField: string;
    transformFunction?: string;
  }>;
  skipFields?: string[];
  allowMergeWithManualApplicants?: boolean;
}
