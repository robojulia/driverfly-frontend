import { CampaignHandoffStatus } from '../../enums/campaigns/campaign-handoff-status.enum';

export interface HandoffQueryDto {
  /** Defaults to the current user on the backend when omitted */
  assignedUserId?: number;
  status?: CampaignHandoffStatus | CampaignHandoffStatus[];
  campaignId?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
