import BaseApi from "./_baseApi";

export class LoginDto {
    email: string;
    password: string;
}

export default class AuthApi extends BaseApi {
    async login(dto: LoginDto) {
        return this.post("auth/login", dto);
    }
}
