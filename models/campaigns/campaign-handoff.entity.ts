import { BasicEntity } from '../BasicEntity.entity';
import { UserEntity } from '../user/user.entity';
import { CampaignTargetType } from '../../enums/campaigns/campaign-target-type.enum';
import { CampaignCommunicationType } from '../../enums/campaigns/campaign-communication-type.enum';
import { CampaignHandoffStatus } from '../../enums/campaigns/campaign-handoff-status.enum';
import { CampaignHandoffTrigger } from '../../enums/campaigns/campaign-handoff-trigger.enum';
import { CampaignHandoffOutcomeRule } from '../../enums/campaigns/campaign-handoff-outcome-rule.enum';
import { CampaignCallSummary } from './campaign-target.entity';
import { AutoAssignMethod } from '../../utils/auto-assign';

/**
 * A handoff routes a campaign target (a driver the AI contacted) to a human owner —
 * a company user or designated recruiter — who takes over the follow-up.
 *
 * Created automatically by a campaign's handoff rule once the AI conversation
 * completes (see {@link CampaignHandoffConfig}), or manually from the target list.
 */
export interface CampaignHandoffEntity extends BasicEntity {
  id: number;
  companyId: number;
  campaignId: number;
  campaignTargetId: number;

  // Assignment
  assignedUserId: number;
  assignedUser?: UserEntity; // hydrated by backend

  status: CampaignHandoffStatus;
  trigger: CampaignHandoffTrigger;

  /** Why the target was handed off (rule name for automatic, optional label for manual) */
  reason?: string;
  /** Free-text note left by the creator for the assignee */
  notes?: string;

  // Denormalized snapshot so the inbox renders without extra joins
  targetType?: CampaignTargetType;
  targetId?: number; // underlying applicant/employee/lead id (for profile links)
  targetName?: string;
  targetPhone?: string;
  targetEmail?: string;
  campaignName?: string;
  communicationType?: CampaignCommunicationType;
  callSummary?: CampaignCallSummary;

  // Lifecycle timestamps
  acceptedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Per-campaign handoff configuration, stored inside the free-form
 * `CampaignEntity.config` under the `handoff` key. No campaign schema change.
 */
export interface CampaignHandoffConfig {
  /** Master switch for automatic handoffs on this campaign */
  enabled: boolean;
  /** Which AI outcomes auto-create a handoff */
  outcomeRule: CampaignHandoffOutcomeRule;
  /** Explicit default assignee for auto + manual handoffs */
  defaultAssigneeUserId?: number;
  /** When true, distribute handoffs across active recruiters instead of a single default */
  autoAssign?: boolean;
  /** Distribution method when {@link autoAssign} is on */
  autoAssignMethod?: AutoAssignMethod;
}

export const DEFAULT_CAMPAIGN_HANDOFF_CONFIG: CampaignHandoffConfig = {
  enabled: false,
  outcomeRule: CampaignHandoffOutcomeRule.POSITIVE,
  autoAssign: false,
  autoAssignMethod: 'round_robin',
};

/** Statuses that count as an active (open) handoff. */
export const ACTIVE_HANDOFF_STATUSES: CampaignHandoffStatus[] = [
  CampaignHandoffStatus.PENDING,
  CampaignHandoffStatus.ACCEPTED,
];
