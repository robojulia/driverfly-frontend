import * as yup from "yup";

export class ContactDto {
  email: string;
  phone: string;
  zip_code: string;
  options: string;

  static yupSchema() {
    return yup.object({
      email: yup.string().email().required().nullable(),
      phone: yup.string().required().nullable(),
      zip_code: yup.string().required().nullable(),
      options: yup.string().required().nullable(),
    });
  }
}
