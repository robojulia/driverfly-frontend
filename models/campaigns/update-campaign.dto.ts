import { CampaignStatus } from '../../enums/campaigns/campaign-status.enum';
import { CampaignCommunicationType } from '../../enums/campaigns/campaign-communication-type.enum';

export interface UpdateCampaignDto {
  name?: string;
  description?: string;
  status?: CampaignStatus;
  communicationType?: CampaignCommunicationType;
  config?: Record<string, any>;
  scheduledAt?: Date;
}
