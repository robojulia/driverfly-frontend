import { CampaignStatus } from '../../enums/campaigns/campaign-status.enum';

export interface UpdateCampaignDto {
  name?: string;
  description?: string;
  status?: CampaignStatus;
  config?: Record<string, any>;
  scheduledAt?: Date;
}
