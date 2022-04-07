import BaseApi from "./_baseApi";

export class ForgetPasswordDto {
    email: string;
}

export class NewPasswordDto {
    password: string;
    passwordConfirm: string;
    passwordResetToken: string;
}

export default class ResetPasswordAPI extends BaseApi {
    async forgetPassword(dto: ForgetPasswordDto) {
        return this.post("forgot-password", dto);
    }
    async newPassword(dto: NewPasswordDto) {
        return this.post("new-password", dto);
    }
}
