import * as yup from 'yup';
import '../../../../utils/yup';
import { ApplicantEmployerEntity } from '../../../applicant';

export class PastEmploymentHistoryDto extends ApplicantEmployerEntity {
  constructor() {
    super();
    this.is_current = false;
  }

  static derivedYupSchema() {
    return yup.object({
      name: yup.string().required().trim().nullable(),
      title: yup.string().required().trim().nullable(),
      manager_name: yup.string().required().trim().nullable(),
      phone: yup.string().optional().nullable(),
      city: yup
        .string()
        .optional()
        .trim()
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
      state: yup.string().optional().nullable(),
      start_at: yup.date().required().nullable(),
      end_at: yup
        .date()
        .required()
        .test({
          test: (value, context) => {
            const start_date = context.resolve(yup.ref('start_at'));
            if (!Boolean(value)) return true;
            if (value > start_date) return true;

            return context.createError({
              path: context.path,
              message: 'END_DATE_MUST_BE_AFTER_START_DATE',
            });
          },
        })
        .nullable(),
      email: yup.string().optional().required().nullable(),
      can_contact: yup
        .boolean()
        .nullable()
        .test(
          'is-selected',
          'Please select whether we can contact this employer',
          (value) => value !== null
        ),
      address: yup.string().optional().trim().nullable(),
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
