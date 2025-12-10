import * as yup from 'yup';
import '../../../../utils/yup';
import { ApplicantEmployerEntity } from '../../../applicant';

export class CurrentEmploymentHistoryDto extends ApplicantEmployerEntity {
  constructor() {
    super();
    this.is_current = true;
  }

  static derivedYupSchema() {
    return yup.object({
      name: yup.string().required().trim().nullable(),
      manager_name: yup.string().required().trim().nullable(),
      phone: yup.string().optional().nullable(),
      city: yup
        .string()
        .optional()
        .nullable()
        .when('$', (value, schema) => {
          // Only validate format if value is provided
          if (value && value.city) {
            return schema.matches(/^[aA-zZ\s]+$/, 'Only character are allowed for this field ');
          }
          return schema;
        }),
      is_subject_to_fmcsrs: yup.bool().nullable(),
      is_subject_to_drug_tests: yup.bool().nullable(),
      is_current: yup.boolean().default(true).nullable(),

      state: yup.string().optional().nullable(),
      email: yup.string().email().optional().nullable(),
      start_at: yup.date().required().nullable(),
      can_contact: yup
        .boolean()
        .nullable()
        .test(
          'is-selected',
          'Please select whether we can contact your current employer',
          (value) => value !== null
        ),
      address: yup.string().optional().nullable(),
      address_2: yup.string().optional().nullable(),
      zip_code: yup
        .string()
        .optional()
        .nullable()
        .when('$', (value, schema) => {
          // Only validate format if value is provided
          if (value && value.zip_code) {
            return schema
              .matches(/^[0-9]+$/, 'Must be only digits')
              .min(5, 'Must be exactly 5 digits')
              .max(5, 'Must be exactly 5 digits');
          }
          return schema;
        }),
    });
  }
}
