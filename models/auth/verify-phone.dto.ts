import * as yup from "yup";

export class VerifyPhoneDto {
  phone: string;
  token: number;

  static yupSchema() {
    return yup.object({
      phone: yup.string().trim().required().nullable(),
      token: yup.number().required().nullable(),
    });
  }
}
