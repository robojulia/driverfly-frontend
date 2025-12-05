import * as yup from 'yup';
import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum';
import '../../utils/yup';

export class ApplicantExperienceEntity {
  type?: JobEquipmentType;
  type_other?: string;
  years?: number;
  months?: number;
  start_year?: number;
  end_year?: number;

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
      start_year: yup
        .number()
        .min(1900, 'Start year must be 1900 or later')
        .max(new Date().getFullYear(), 'Start year cannot be in the future')
        .integer('Start year must be a whole number')
        .nullable(),
      end_year: yup
        .number()
        .min(1900, 'End year must be 1900 or later')
        .max(new Date().getFullYear(), 'End year cannot be in the future')
        .integer('End year must be a whole number')
        .when('start_year', {
          is: (val: number) => val != null,
          then: yup.number().min(yup.ref('start_year'), 'End year must be greater than or equal to start year'),
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
      start_year: yup
        .number()
        .min(1900, 'Start year must be 1900 or later')
        .max(new Date().getFullYear(), 'Start year cannot be in the future')
        .integer('Start year must be a whole number')
        .nullable(),
      end_year: yup
        .number()
        .min(1900, 'End year must be 1900 or later')
        .max(new Date().getFullYear(), 'End year cannot be in the future')
        .integer('End year must be a whole number')
        .when('start_year', {
          is: (val: number) => val != null,
          then: yup.number().min(yup.ref('start_year'), 'End year must be greater than or equal to start year'),
        })
        .nullable(),
      years: yup
        .number()
        .min(1, 'Years of experience must be at least 1')
        .max(100, 'Years of experience cannot exceed 100')
        .integer('Years must be a whole number')
        .when(['start_year', 'end_year'], {
          is: (start_year: number, end_year: number) => !start_year || !end_year,
          then: yup.number().required('Years of experience is required when start/end years are not provided'),
          otherwise: yup.number().nullable(),
        })
        .nullable(),
      months: yup.number().min(0).max(11).nullable(),
    });
  }

  static key(entity: ApplicantExperienceEntity) {
    if (entity?.type == JobEquipmentType.OTHER) return `${entity.type}_${entity.type_other}`;

    return entity?.type;
  }
}
