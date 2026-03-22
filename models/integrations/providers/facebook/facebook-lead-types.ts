/**
 * Facebook Lead Ads Type Definitions
 * Covers the webhook payload and Graph API lead response structures.
 */

// ─── Webhook ─────────────────────────────────────────────────────────────────

/** Top-level body Facebook sends to the webhook endpoint. */
export interface FacebookWebhookPayload {
  object: 'page';
  entry: FacebookWebhookEntry[];
}

export interface FacebookWebhookEntry {
  id: string;   // Page ID
  time: number;
  changes: FacebookWebhookChange[];
}

export interface FacebookWebhookChange {
  field: 'leadgen';
  value: FacebookLeadgenChangeValue;
}

export interface FacebookLeadgenChangeValue {
  leadgen_id: string;
  page_id: string;
  form_id: string;
  ad_id?: string;
  ad_group_id?: string;
  campaign_id?: string;
  created_time: number;
}

// ─── Graph API ────────────────────────────────────────────────────────────────

/** Response from GET /{leadgen_id}?fields=field_data,... */
export interface FacebookLeadDetail {
  id: string;
  created_time: string;
  ad_id?: string;
  form_id?: string;
  field_data: FacebookLeadField[];
  is_organic?: boolean;
}

export interface FacebookLeadField {
  name: string;
  values: string[];
}

// ─── Form → Job Mapping ───────────────────────────────────────────────────────

/**
 * Persisted in the backend; links a Facebook Lead Ad form to a specific job
 * so incoming leads are automatically associated with the right opening.
 */
export interface FacebookFormJobMapping {
  id?: number;
  /** Facebook Lead Ad form ID */
  form_id: string;
  /** DriverFly job ID */
  job_id: number;
  /** DriverFly company ID */
  company_id: number;
  /** Optional – narrow mapping to a specific ad */
  ad_id?: string;
  /** Human-readable label for the form (pulled from Facebook or entered manually) */
  form_name?: string;
  created_at?: string;
  updated_at?: string;
}

// ─── Facebook standard field names ───────────────────────────────────────────

/**
 * Well-known field names used in Facebook Lead Ad forms.
 * Custom fields can be anything; these are the built-in ones.
 */
export const FB_FIELD = {
  FULL_NAME: 'full_name',
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  PHONE: 'phone_number',
  EMAIL: 'email',
  ZIP: 'zip_code',
  CITY: 'city',
  STATE: 'state',
  STREET: 'street_address',
  DOB: 'date_of_birth',
  // Custom / hidden fields embedded in the DriverFly form template
  JOB_ID: 'job_id',
  COMPANY_ID: 'company_id',
  CDL_CLASS: 'cdl_class',
  YEARS_EXPERIENCE: 'years_experience',
  IS_OWNER_OPERATOR: 'is_owner_operator',
} as const;

export type FbFieldName = (typeof FB_FIELD)[keyof typeof FB_FIELD];
