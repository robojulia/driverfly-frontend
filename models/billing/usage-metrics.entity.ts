import { SubscriptionEntity } from './subscription.entity';

export class UsageMetricsEntity {
  subscription?: SubscriptionEntity;
  usage?: {
    active_jobs?: {
      current: number;
      limit: number;
      percentage: number;
    };
    users?: {
      current: number;
      limit: number;
      percentage: number;
    };
    applicants_this_month?: {
      current: number;
      limit: number;
      percentage: number;
    };
  };
  approaching_limits?: boolean;
  exceeded_limits?: boolean;
}
