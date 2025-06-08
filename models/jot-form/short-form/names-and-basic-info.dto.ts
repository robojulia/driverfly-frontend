import * as yup from 'yup';
import { BooleanTypeExtra } from '../../../enums/jotform/bool-and-not-sure.enum';

export class NamesAndBasicInfoDto {
  first_name?: string;
  last_name?: string;
  email: string;
  zip_code: string;
  authorize_to_communicate: BooleanTypeExtra;

  static yupSchema() {
    return yup.object({
      first_name: yup.string().required().nullable().trim(),
      last_name: yup.string().required().nullable().trim(),
      email: yup.string().email().required().nullable(),
      zip_code: yup
        .string()
        .required()
        .matches(/^\d{5}$/, 'Must be exactly 5 digits')
        .length(5, 'Must be exactly 5 digits'),
      authorize_to_communicate: yup.string().required().nullable(),
    });
  }
}
