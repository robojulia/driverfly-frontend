import { CampaignHandoffStatus } from '../../enums/campaigns/campaign-handoff-status.enum';

export interface UpdateHandoffDto {
  status?: CampaignHandoffStatus;
  assignedUserId?: number;
  notes?: string;
}
