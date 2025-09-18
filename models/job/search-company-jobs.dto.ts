import { ExpiryStatus } from '../../enums/jobs/expiry-status.enum';

export class SearchCompanyJobsDto {
  limit?: number;
  page?: number;
  is_paginated?: boolean;
  expiry_status?: ExpiryStatus;
  companyId?: number;
  // Adding sorting support for future API enhancement
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
