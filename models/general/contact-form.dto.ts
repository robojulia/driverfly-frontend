import * as yup from "yup";

export class ContactFormDto {

  name: string;
  email: string;
  subject: string;
  message: string;


  static yupSchema() {
    return yup.object({
      name: yup.string().trim().required().nullable(),
      email: yup.string().trim().email().required().nullable(),
      subject: yup.string().trim().required().nullable(),
      message: yup.string().trim().required().nullable(),
    });
  }
}
