import { UserEntity } from '../user/user.entity';
import { CompanyEntity } from '../company/company.entity';
import { JobEntity } from '../job/job.entity';
import { ApplicantStatus } from '../../enums/applicants/applicant-status.enum';
import { ApplicantEntity } from './applicant.entity';
import * as yup from "yup";

export class ApplicantJobEntity {
  id: number;
  version?: number;
  applicant?: ApplicantEntity;
  user?: UserEntity;
  company?: CompanyEntity;
  job: JobEntity;
  status?: ApplicantStatus;
  created_at?: string;
  last_updated_at?: string;

  static yupSchema() {
    return yup.object({
      job: yup.object({
        id: yup.number().required()
      }).required().nullable(),
      status: (yup.string() as any).enum(ApplicantStatus).required().nullable()
    });
  }
}
