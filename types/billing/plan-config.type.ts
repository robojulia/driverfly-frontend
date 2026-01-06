import {
  SubscriptionPlan,
  BillingInterval,
} from '../../enums/billing/subscription-plan.enum';

export interface PlanFeature {
  name: string;
  included: boolean | string | number;
  tooltip?: string;
}

export interface PlanConfig {
  plan: SubscriptionPlan;
  name: string;
  description: string;
  price: {
    monthly: number;
    annual: number;
  };
  stripe_price_ids: {
    monthly: string;
    annual: string;
  };
  limits: {
    max_active_jobs: number;
    max_users: number;
    max_applicants_per_month: number;
  };
  features: PlanFeature[];
  popular?: boolean;
  cta: string;
}
