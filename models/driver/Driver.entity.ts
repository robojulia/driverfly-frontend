import { DriverEmploymentEntity } from "./DriverEmployment.entity";
import { DriverEquipmentExperienceEntity } from "./DriverEquipmentExperience.entity";
import { DriverEquipmentOwnedEntity } from "./DriverEquipmentOwned.entity";
import { DriverSafetyQuestionEntity } from "./DriverSafetyQuestion.entity";

export enum DriverLicenseType {
    CDL_CLASS_A = 'CDL_CLASS_A',
    CDL_CLASS_B = 'CDL_CLASS_B',
    CDL_CLASS_C = 'CDL_CLASS_C',
}
  
export enum DriverDegree {
    HIGH_SCHOOL = 'HIGH_SCHOOL',
    ASSOCIATE = 'ASSOCIATE',
    BACHELOR = 'BACHELOR',
    MASTER = 'MASTER',
    DOCTORAL = 'DOCTORAL',
}
  
export interface DriverEntity {
    id?: number;
    // user?: UserEntity;
    birthdate?: string;
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    latitude?: number;
    longitude?: number;
    license_number?: string;
    license_expiry?: Date;
    license_state?: string;
    license_type?: DriverLicenseType;
    years_cdl_experience?: number;
    is_owner_operator: boolean;
    equipment_owned: DriverEquipmentOwnedEntity[];
    equipment_experience: DriverEquipmentExperienceEntity[];
    highest_degree?: DriverDegree;
    emergency_contact_name?: string;
    emergency_contact_number?: string;
    emergency_contact_relationship?: string;
    employers: DriverEmploymentEntity[];
    can_pass_drug_test?: boolean;
    has_past_dui?: boolean;
    dui_years?: string[];
    criminal_history?: string;
    accident_count?: number;
    accident_details?: string;
    safety_questions: DriverSafetyQuestionEntity[];
  }
  