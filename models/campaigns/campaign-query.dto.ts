export interface CampaignQueryDto {
  companyId?: number;
  type?: string;
  status?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
