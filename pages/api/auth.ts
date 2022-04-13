import { LoginDto } from "../../models/auth/login.dto";
import { SignUpDto } from "../../models/auth/sign-up.dto";
import BaseApi from "./_baseApi";

export default class AuthApi extends BaseApi {
    async login(dto: LoginDto) {
        return await this.post("auth/login", dto);
    }
    async signUp(dto: SignUpDto) {
        await this.post("auth/sign-up", dto);
    }
}
