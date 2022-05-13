import { SchoolLocationType } from '../../enums/schools/school-location-type.enum';
import { SchoolPrivateEnrollment } from '../../enums/schools/school-private-enrollment.enum';
import { SchoolTrainingType, SchoolTrainingSubtype } from '../../enums/schools/school-training-type.enum';
import { LocationEntity } from '../company/location.entity';

export interface SchoolEntity {
  id?: number,
  provider_name: string;
  location_name: string;
  location: LocationEntity;
  location_type: SchoolLocationType;
  private_enrollment: SchoolPrivateEnrollment;
  training_type: SchoolTrainingType[];
  cdl_a: SchoolTrainingSubtype[];
  cdl_b: SchoolTrainingSubtype[];
  passenger: SchoolTrainingSubtype[];
  school_bus: SchoolTrainingSubtype[];
  hazmat: SchoolTrainingSubtype[];
}
