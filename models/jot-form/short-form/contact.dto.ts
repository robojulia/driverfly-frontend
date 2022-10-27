import * as yup from "yup";

export class ContactDto {
  email: string;
  phone: string;
  zip_code: number;
  options: string;

  static yupSchema() {
    return yup.object({
      email: yup.string().email().required().nullable(),
      phone: yup.string().required().nullable(),
      zip_code: yup.number().required().nullable(),
      options: yup.string().required().nullable(),
    });
  }
}
