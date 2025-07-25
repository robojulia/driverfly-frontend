import BaseApi from './_baseApi';

export interface AdminCampaignCallResultDto {
  campaignTargetId: number;
  outcome: string;
  outcomeReason?: string;
  entities?: {
    isInterested?: boolean;
    [key: string]: any;
  };
  callMetadata?: any;
}

export default class AdminCampaignsApi extends BaseApi {
  baseUrl: string = 'admin/campaigns';

  async testCampaignCallResult(
    dto: AdminCampaignCallResultDto
  ): Promise<{ message: string; success: boolean }> {
    if (!dto.campaignTargetId || dto.campaignTargetId <= 0) {
      throw new Error('Invalid campaignTargetId: must be a positive number');
    }

    const url = `${this.baseUrl}/${dto.campaignTargetId}/test-call-result`;
    console.log('AdminCampaignsApi: Making request to:', url);
    console.log('AdminCampaignsApi: campaignTargetId:', dto.campaignTargetId);
    console.log('AdminCampaignsApi: DTO:', dto);

    const { data } = await this.post(url, dto);
    return data;
  }
}
