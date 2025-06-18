import * as yup from 'yup';

export class ChangePasswordDto {
  oldPassword: string;
  password: string;
  passwordConfirm: string;

  static yupSchema() {
    return yup.object({
      oldPassword: yup.string().required().nullable(),

      password: yup
        .string()
        .min(8, 'PASSWORD_REQUIREMENT_LENGTH')
        .matches(/\d/, 'PASSWORD_REQUIREMENT_NUMBER')
        .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, 'PASSWORD_REQUIREMENT_SPECIAL_CHARACTER')
        .required()
        .nullable(),

      passwordConfirm: yup
        .string()
        .oneOf([yup.ref('password')], 'PASSWORDS_DO_NOT_MATCH')
        .required()
        .nullable(),
    });
  }
}
