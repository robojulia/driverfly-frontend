import { SignUpRole } from "../../enums/auth/sign-up-role.enum";
import * as yup from "yup";
import { stringEnum } from "../../utils/yup";

export class SignUpDto {
  role: SignUpRole;
  name: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword?: string;
  accept_tos?: boolean = false;
  invite_code?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;

  static yupSchema() {
    return yup.object({
      role: stringEnum(SignUpRole).required().nullable(),
      name: yup.string().when("role", {
        is: SignUpRole.COMPANY,
        then: yup.string().trim().required().nullable()
      }).nullable(),
      first_name: yup.string().trim().required().nullable(),
      last_name: yup.string().trim().required().nullable(),
      phone: yup.string().trim().nullable(),
      email: yup.string().trim().email().required().nullable(),
      password: yup.string().trim().required().nullable(),
      confirmPassword: yup.string().trim().oneOf([yup.ref("password")], "PASSWORDS_DO_NOT_MATCH").required().nullable(),
      accept_tos: yup.boolean().oneOf([true], "MUST_BE_CHECKED"),
      utm_source: yup.string().trim().nullable(),
      utm_medium: yup.string().trim().nullable(),
      utm_campaign: yup.string().trim().nullable(),
      utm_content: yup.string().trim().nullable(),
      invite_code: yup.string().when("role", {
        is: SignUpRole.COMPANY,
        then: yup.string().trim().required().nullable(),
      }).nullable(),
    });
  }
}
  