import { SchoolLocationType } from '../../enums/schools/school-location-type.enum';
import { SchoolPrivateEnrollment } from '../../enums/schools/school-private-enrollment.enum';
import { SchoolTrainingType } from '../../enums/schools/school-training-type.enum';
import { LocationEntity } from '../company/location.entity';

export class SchoolEntity {
  id?: number;
  provider_name: string;
  location_name: string;
  location: LocationEntity;
  location_type: SchoolLocationType;
  private_enrollment: boolean;
  training_type: SchoolTrainingType[];

  static yupSchema() {
    return yup.object({
        provider_name: yup.string().required().nullable(),
        location_name: yup.string().required().nullable(),
        location: yup.string().nullable(),
        location_type: (yup.string() as any).enum(SchoolLocationType).nullable(),
        private_enrollment: yup.bool().nullable(),
        training_type: (yup.string() as any).enum(SchoolTrainingType).nullable(),
    });
  }
}
