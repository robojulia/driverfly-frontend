import { EmployeeStatus } from '../../enums/applicants/employee-status.enum';

export class SearchEmployeeDto {

	limit?: number;
	status?: EmployeeStatus[];
	email?: string;
	page?: number;
	is_paginated?: boolean;
}
