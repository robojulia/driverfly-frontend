import { SchoolLocationType } from '../../enums/schools/school-location-type.enum';
import { SchoolPrivateEnrollment } from '../../enums/schools/school-private-enrollment.enum';
import { SchoolTrainingType } from '../../enums/schools/school-training-type.enum';

export class SchoolEntity {
  id?: number;
  provider_name?: string;
  phone?: string;
  email?: string;
  website?: string;
  location_name?: string;
  address?: string;
  longitude?: number;
  latitude?: number;
  location_type?: SchoolLocationType;
  private_enrollment?: boolean;
  training_type?: SchoolTrainingType[];
  partner?: boolean;
}
