import { ApplicantEntity } from "./applicant.entity";

export class ReturnApplicantPaginatedData /* implements PaginatedDto */ {
  data: ApplicantEntity[];
  total: number;
}
