import BaseApi from "./_baseApi";

export class NewPasswordDto {
  password: string;
  confirmPassword: string;
  passwordResetToken: string;
}

export default class ResetPasswordAPI extends BaseApi {
  async newPassword(dto: NewPasswordDto) {
    return this.post("user/new-password", dto);
  }
}
