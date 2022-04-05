import { DriverEntity } from "./Driver.entity";

export interface DriverEmploymentEntity {
  id?: number;
  driver: DriverEntity;
  name?: string;
  start_at?: string;
  end_at?: string;
  title?: string;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  can_contact: boolean;
  is_subject_to_fmcsrs: boolean;
  is_subject_to_drug_tests: boolean;
}
