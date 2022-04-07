import BaseApi from "./_baseApi";

export class ForgetPasswordDto {
    email: string;
}

export default class ResetPasswordAPI extends BaseApi {
    async forgetPassword(dto: ForgetPasswordDto) {
        return this.post("forgot-password", dto);
    }
}
