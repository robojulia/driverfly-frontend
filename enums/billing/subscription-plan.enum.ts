export enum SubscriptionPlan {
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
  TRIAL = 'trial',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
  INCOMPLETE = 'incomplete',
  TRIALING = 'trialing',
  UNPAID = 'unpaid',
}

export enum BillingInterval {
  MONTHLY = 'monthly',
  ANNUAL = 'annual',
}
