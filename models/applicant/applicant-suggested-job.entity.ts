import { UserEntity } from '../user/user.entity';
import { ApplicantEntity } from './applicant.entity';
import { CompanyEntity } from '../company/company.entity';
import { JobEntity } from '../job/job.entity';

export class ApplicantSuggestedJobEntity {
  id?: number;
  user?: UserEntity;
  company?: CompanyEntity;
  applicant?: ApplicantEntity;
  job?: JobEntity;
  score?: number;
  created_at?: string;
  last_updated_at?: string;
}
