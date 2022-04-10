import BaseApi from "./_baseApi";

export class VerifyEmailTokenDto {
    emailVerifyToken: number;
}

export default class SignupAPI extends BaseApi {
    async verifyEmailToken(dto: VerifyEmailTokenDto) {
        return this.get(`email/verify/${dto.emailVerifyToken}`);
    }
}
