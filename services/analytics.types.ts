// Analytics event types and interfaces

export type AnalyticsClickType =
  | 'apply-button'
  | 'job-title'
  | 'company-name'
  | 'job-details'
  | 'contact-info'
  | 'external-link'
  | 'share-button'
  | 'drivers-license-uploaded'
  | 'quick-apply-drivers-license-opened'
  | 'job_listing_click'
  | 'risky_action';

export interface AnalyticsEvent {
  jobId: number;
  companyId: number;
  eventType: 'view' | 'click' | 'application';
  clickType?: AnalyticsClickType;
  metadata?: TrackingMetadata;
}

export interface TrackingMetadata {
  referrer?: string;
  userAgent?: string;
  viewport?: string;
  campaignId?: string; // Campaign ID from either ?campaignId= or ?utm_campaign= URL parameters
  source?: string; // Traffic source (utm_source, or 'campaign' for direct campaign links)
  medium?: string; // Traffic medium (utm_medium, or 'sms' for campaign SMS links)
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
