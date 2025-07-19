// Analytics event types and interfaces
export interface AnalyticsEvent {
  jobId: number;
  companyId: number;
  eventType: 'view' | 'click' | 'application';
  clickType?:
    | 'apply-button'
    | 'job-title'
    | 'company-name'
    | 'job-details'
    | 'contact-info'
    | 'external-link'
    | 'share-button';
  metadata?: TrackingMetadata;
}

export interface TrackingMetadata {
  referrer?: string;
  userAgent?: string;
  viewport?: string;
  campaignId?: string;
  source?: string;
  medium?: string;
  page?: string;
  buttonType?: string;
  timestamp?: number;
  quickApply?: boolean; // Track if this was from quick apply flow
  applicationSource?: string; // Track where application originated
  applicationType?: string; // Track type of application (quick_apply, full_application, etc.)
  listPosition?: number; // Position in a list (for search results, related jobs, etc.)
  experiment?: string; // A/B test or experiment identifier
  additional?: Record<string, any>;
}

export interface AnalyticsResponse {
  success: boolean;
  message?: string;
}

export interface BatchAnalyticsResponse {
  success: boolean;
  processed?: number;
  failed?: number;
  message?: string;
}
