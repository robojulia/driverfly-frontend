// Backend wire format — matches what the API sends/receives on ApplicantEntity.utm
export interface UtmReferral {
  referralSourceId?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  referral_name?: string;
  referral_code?: string;
}

// Frontend tracking context — used throughout the form flow before submission
export interface TrackingContext {
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  };
  referral?: {
    code?: string;
    name?: string;
    sourceId?: number;
  };
}

// Converts frontend TrackingContext to the flat UtmReferral wire format for API submission
export function trackingContextToUtmReferral(tracking?: TrackingContext): UtmReferral {
  return {
    utm_source: tracking?.utm?.source ?? null,
    utm_medium: tracking?.utm?.medium ?? null,
    utm_campaign: tracking?.utm?.campaign ?? null,
    utm_content: tracking?.utm?.content ?? null,
    referral_name: tracking?.referral?.name ?? null,
    referral_code: tracking?.referral?.code ?? null,
    referralSourceId: tracking?.referral?.sourceId ?? null,
  };
}
