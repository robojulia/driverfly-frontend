import BaseApi from './_baseApi';
import { CampaignHandoffEntity } from '../../models/campaigns/campaign-handoff.entity';
import { CreateHandoffDto } from '../../models/campaigns/create-handoff.dto';
import { UpdateHandoffDto } from '../../models/campaigns/update-handoff.dto';
import { HandoffQueryDto } from '../../models/campaigns/handoff-query.dto';
import { CampaignHandoffStatus } from '../../enums/campaigns/campaign-handoff-status.enum';

export interface HandoffListResponse {
  handoffs: CampaignHandoffEntity[];
  total: number;
  page: number;
  limit: number;
}

export type HandoffStatsResponse = Record<CampaignHandoffStatus, number>;

export default class CampaignHandoffsApi extends BaseApi {
  baseUrl: string = 'campaigns';

  /** Create a handoff for a target on a campaign (manual or programmatic). */
  async create(campaignId: number, dto: CreateHandoffDto): Promise<CampaignHandoffEntity> {
    const { data } = await this.post(`${this.baseUrl}/${campaignId}/handoffs`, dto);
    return data;
  }

  /** Inbox list — defaults to the current user on the backend unless a query overrides it. */
  async list(query?: HandoffQueryDto): Promise<HandoffListResponse> {
    const { data } = await this.get(this.buildUrl(`${this.baseUrl}/handoffs`, query));
    return data;
  }

  /** Handoffs that belong to a single campaign. */
  async listForCampaign(campaignId: number): Promise<CampaignHandoffEntity[]> {
    const { data } = await this.get(`${this.baseUrl}/${campaignId}/handoffs`);
    return data || [];
  }

  /** Update status / assignee / notes (accept, complete, dismiss, reassign). */
  async update(handoffId: number, dto: UpdateHandoffDto): Promise<CampaignHandoffEntity> {
    const { data } = await this.patch(`${this.baseUrl}/handoffs/${handoffId}`, dto);
    return data;
  }

  /** Counts by status for inbox badges. */
  async getStats(): Promise<HandoffStatsResponse> {
    const { data } = await this.get(`${this.baseUrl}/handoffs/stats`);
    return data;
  }
}
