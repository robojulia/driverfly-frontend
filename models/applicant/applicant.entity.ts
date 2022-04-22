import { UserEntity } from '../user/user.entity';
import { CompanyEntity } from '../company/company.entity';
import { JobEntity } from '../job/job.entity';
import { DocumentEntity } from '../documents/document.entity';
import { ApplicantExperienceEntity } from './applicant-experience.entity';
import { DriverLicenseType } from '../../enums/drivers/driver-license-type.enum';
import { ApplicantEquipmentEntity } from './applicant-equipment.entity';

export interface ApplicantEntity {
  id?: number;
  version?: number;
  user?: UserEntity;
  company?: CompanyEntity;
  job?: JobEntity;
  status?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  resume?: DocumentEntity;
  drivers_license?: DocumentEntity;
  medical_card?: DocumentEntity;
  license_number?: string;
  license_expiry?: string;
  license_state?: string;
  license_type?: DriverLicenseType;
  years_cdl_experience?: number;
  violations_count?: number;
  can_pass_drug_test?: boolean;
  experiences?: ApplicantExperienceEntity[]
  equipment?: ApplicantEquipmentEntity[]
  created_at?: string;
  last_updated_at?: string;
}
