import * as yup from "yup";

export class VerifyEmailDto {
  email: string;
  token: number;

  static yupSchema() {
    return yup.object({
      email: yup.string().trim().email().required().nullable(),
      token: yup.number().required().nullable(),
    });
  }
}
  