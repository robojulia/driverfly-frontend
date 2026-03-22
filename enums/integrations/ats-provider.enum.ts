export enum ATSProvider {
  TENSTREET = 'TENSTREET',
  GREENHOUSE = 'GREENHOUSE',
  LEVER = 'LEVER',
  WORKDAY = 'WORKDAY',
  FACEBOOK_LEADS = 'FACEBOOK_LEADS',
}

export const ATS_PROVIDER_LABELS: Record<ATSProvider, string> = {
  [ATSProvider.TENSTREET]: 'Tenstreet',
  [ATSProvider.GREENHOUSE]: 'Greenhouse',
  [ATSProvider.LEVER]: 'Lever',
  [ATSProvider.WORKDAY]: 'Workday',
  [ATSProvider.FACEBOOK_LEADS]: 'Facebook Lead Ads',
};
