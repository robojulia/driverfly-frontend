import * as yup from 'yup';
import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum';
import '../../utils/yup';

export class ApplicantExperienceEntity {
  type?: JobEquipmentType;
  type_other?: string;
  years?: number;
  months?: number;

  static yupSchema() {
    return yup.object({
      type: (yup.string() as any).enum(JobEquipmentType).required().nullable(),
      type_other: yup
        .string()
        .when('type', {
          is: JobEquipmentType.OTHER,
          then: yup.string().required().nullable(),
        })
        .nullable(),
      years: yup
        .number()
        .min(1, 'Years of experience must be at least 1')
        .max(100, 'Years of experience cannot exceed 100')
        .integer('Years must be a whole number')
        .required('Years of experience is required')
        .nullable(),
      months: yup.number().min(0).max(11).nullable(),
    });
  }

  static yupSchemaForImport() {
    return yup.object({
      type: (yup.string() as any).enum(JobEquipmentType).required().nullable(),
      type_other: yup.string().nullable(),
      years: yup
        .number()
        .min(1, 'Years of experience must be at least 1')
        .max(100, 'Years of experience cannot exceed 100')
        .integer('Years must be a whole number')
        .nullable(),
      months: yup.number().min(0).max(11).nullable(),
    });
  }

  static key(entity: ApplicantExperienceEntity) {
    if (entity?.type == JobEquipmentType.OTHER) return `${entity.type}_${entity.type_other}`;

    return entity?.type;
  }
}
