import { BasicEntity } from '../BasicEntity.entity';
import { CampaignType } from '../../enums/campaigns/campaign-type.enum';
import { CampaignStatus } from '../../enums/campaigns/campaign-status.enum';
import { CampaignCommunicationType } from '../../enums/campaigns/campaign-communication-type.enum';
import { CampaignTargetEntity } from './campaign-target.entity';

export interface CampaignEntity extends BasicEntity {
  id: number;
  name: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  communicationType: CampaignCommunicationType;
  companyId: number;

  // Type-specific configuration
  config: Record<string, any>;

  // Statistics
  totalTargets: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  pendingCount: number;

  // Timing
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  targets?: CampaignTargetEntity[];
}
