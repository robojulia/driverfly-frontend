import * as yup from 'yup';

export class PhoneNumberDto {
  phone: string;
  static yupSchema() {
    return yup.object({
      phone: yup.string().required().nullable(),
    });
  }
}
