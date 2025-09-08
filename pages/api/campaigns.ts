import BaseApi from './_baseApi';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignTargetEntity } from '../../models/campaigns/campaign-target.entity';
import { CampaignQueryDto } from '../../models/campaigns/campaign-query.dto';
import { UpdateCampaignDto } from '../../models/campaigns/update-campaign.dto';
import { CampaignCommunicationType } from '../../enums/campaigns/campaign-communication-type.enum';

export interface CreateJobReachoutCampaignDto {
  jobId: number;
  name?: string;
  description?: string;
  minScore?: number;
  filters?: any;
  communicationType?: CampaignCommunicationType;
}

export interface CampaignReachPreviewQuery {
  jobId: number;
  communicationType: CampaignCommunicationType;
  minScore?: number;
  states?: string[];
  excludeApplied?: boolean;
}

export interface CampaignReachPreviewResponse {
  qualifiedPool: number;
  estimatedContacts: number;
  estimatedInterest: number;
  filteringDetails: {
    totalEligible: number;
    filteredForSms: number;
    reasons: {
      noSmsAuthorization: number;
      noPhoneNumber: number;
    };
  };
}

export interface CampaignStatsResponse {
  totalTargets: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  pendingCount: number;
}

export interface CampaignListResponse {
  campaigns: CampaignEntity[];
  total: number;
  page: number;
  limit: number;
}

export default class CampaignsApi extends BaseApi {
  baseUrl: string = 'campaigns';

  async createJobReachoutCampaign(dto: CreateJobReachoutCampaignDto): Promise<CampaignEntity> {
    const { data } = await this.post(`${this.baseUrl}/job-reachout`, dto);
    return data;
  }

  async getCampaignReachPreview(
    query: CampaignReachPreviewQuery
  ): Promise<CampaignReachPreviewResponse> {
    const { data } = await this.get(this.buildUrl(`${this.baseUrl}/reach-preview`, query));
    return data;
  }

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
    const { data } = await this.patch(`${this.baseUrl}/${id}/cancel`, {});
    return data;
  }

  async start(id: number): Promise<CampaignEntity> {
    const { data } = await this.patch(`${this.baseUrl}/${id}/start`, {});
    return data;
  }

  async regenerateTargets(
    id: number
  ): Promise<{ campaignId: number; targetCount: number; message: string }> {
    const { data } = await this.patch(`${this.baseUrl}/${id}/regenerate-targets`, {});
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

  async findByJobId(jobId: number, status?: string[]): Promise<CampaignEntity[]> {
    const url = `${this.baseUrl}/jobs/${jobId}`;
    const query: any = {};
    if (status && status.length > 0) {
      query.status = status;
    }
    const { data } = await this.get(this.buildUrl(url, query));
    return data || [];
  }

  async deleteTarget(
    campaignId: number,
    targetId: number
  ): Promise<{ message: string; deletedTargetId: number }> {
    const { data } = await this.delete(`${this.baseUrl}/${campaignId}/targets/${targetId}`);
    return data;
  }

  async addManualTargets(
    campaignId: number,
    applicantIds: number[]
  ): Promise<{
    message: string;
    addedCount: number;
    skippedCount: number;
    details: {
      addedTargets: number[];
      skippedTargets: { applicantId: number; reason: string }[];
    };
  }> {
    const { data } = await this.post(`${this.baseUrl}/${campaignId}/targets/manual`, {
      applicantIds,
    });
    return data;
  }

  async addTestUserToCampaign(
    campaignId: number
  ): Promise<{ message: string; testTargetId: number }> {
    const { data } = await this.post(`${this.baseUrl}/test/add-user`, { campaignId });
    return data;
  }

  async sendTestCampaign(campaignId: number): Promise<{ message: string; status: string }> {
    const { data } = await this.post(`${this.baseUrl}/test/send`, { campaignId });
    return data;
  }
}
