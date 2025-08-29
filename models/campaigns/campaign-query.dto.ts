export interface CampaignQueryDto {
  companyId?: number;
  jobId?: number;
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
