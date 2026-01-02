import { EmployeeStatus } from '../../enums/applicants/employee-status.enum';

export class SearchEmployeeDto {
  limit?: number;
  status?: EmployeeStatus[];
  email?: string;
  page?: number;
  is_paginated?: boolean;
  // Adding search and sorting support for API-level operations
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  hireDateFrom?: string;
  hireDateTo?: string;
  birthdayThisWeek?: boolean;
}
