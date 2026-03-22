import * as yup from 'yup';
import {
  SubscriptionPlan,
  SubscriptionStatus,
  BillingInterval,
} from '../../enums/billing/subscription-plan.enum';

export class SubscriptionEntity {
  id?: number;
  company_id?: number;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  billing_interval?: BillingInterval;
  current_period_start?: Date | string;
  current_period_end?: Date | string;
  trial_end?: Date | string;
  cancel_at_period_end?: boolean;
  canceled_at?: Date | string;

  // Plan limits
  max_active_jobs?: number;
  max_users?: number;
  max_applicants_per_month?: number;

  // Usage tracking
  current_active_jobs?: number;
  current_users?: number;
  current_applicants_this_month?: number;
  employee_count?: number;
  driver_seats?: number;
  auto_recruiting_enabled?: boolean;
  ai_agent_plan?: 'STARTER' | 'STANDARD' | 'ENTERPRISE' | null;
  mvr_enabled?: boolean;
  mvr_records_pulled?: number;

  static yupSchema() {
    return yup.object({
      plan: yup
        .string()
        .oneOf(Object.values(SubscriptionPlan))
        .required('Plan is required'),
      billing_interval: yup
        .string()
        .oneOf(Object.values(BillingInterval))
        .required('Billing interval is required'),
    });
  }
}
