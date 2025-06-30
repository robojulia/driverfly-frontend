import { BasicEntity } from '../BasicEntity.entity';
import { CampaignTargetType } from '../../enums/campaigns/campaign-target-type.enum';
import { CampaignTargetStatus } from '../../enums/campaigns/campaign-target-status.enum';

export interface CampaignTargetEntity extends BasicEntity {
  campaignId: number;
  targetType: CampaignTargetType;
  targetId: number;
  status: CampaignTargetStatus;

  // Contact information (copied from target at time of campaign creation)
  name?: string;
  email?: string;
  phone?: string;

  // Processing details
  processedAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  errorMessage?: string;

  // Content customization
  customData?: Record<string, any>;
}
