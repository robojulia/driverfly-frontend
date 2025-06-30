import BaseApi from './_baseApi';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignTargetEntity } from '../../models/campaigns/campaign-target.entity';
import { CampaignQueryDto } from '../../models/campaigns/campaign-query.dto';
import { UpdateCampaignDto } from '../../models/campaigns/update-campaign.dto';

export interface CampaignStatsResponse {
  totalTargets: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  pendingCount: number;
}

export interface CampaignListResponse {
  data: CampaignEntity[];
  total: number;
  page: number;
  limit: number;
}

export default class CampaignsApi extends BaseApi {
  baseUrl: string = 'campaigns';

  async findAll(query?: CampaignQueryDto): Promise<CampaignListResponse> {
    const { data } = await this.get(this.buildUrl(this.baseUrl, query));
    return data;
  }

  async findById(id: number): Promise<CampaignEntity> {
    const { data } = await this.get(`${this.baseUrl}/${id}`);
    return data;
  }

  async update(id: number, dto: UpdateCampaignDto): Promise<CampaignEntity> {
    const { data } = await this.put(`${this.baseUrl}/${id}`, dto);
    return data;
  }

  async cancel(id: number): Promise<CampaignEntity> {
    const { data } = await this.post(`${this.baseUrl}/${id}/cancel`, {});
    return data;
  }

  async regenerateTargets(id: number): Promise<CampaignEntity> {
    const { data } = await this.post(`${this.baseUrl}/${id}/regenerate-targets`, {});
    return data;
  }

  async getTargets(
    campaignId: number,
    query?: any
  ): Promise<{
    data: CampaignTargetEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { data } = await this.get(this.buildUrl(`${this.baseUrl}/${campaignId}/targets`, query));
    return data;
  }

  async getStats(campaignId: number): Promise<CampaignStatsResponse> {
    const { data } = await this.get(`${this.baseUrl}/${campaignId}/stats`);
    return data;
  }
}
