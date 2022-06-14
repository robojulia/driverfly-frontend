import { ForgotPasswordDto } from "../../models/auth/forgot-password.dto";
import { LoginDto } from "../../models/auth/login.dto";
import { SignUpDto } from "../../models/auth/sign-up.dto";
import { UserEntity } from "../../models/user/user.entity";
import BaseApi from "./_baseApi";

export default class AuthApi extends BaseApi {
    private baseUrl: string = "auth"

    async login(dto: LoginDto) {
        return await this.post(`${this.baseUrl}/login`, dto);
    }
    async signUp(dto: SignUpDto) {
        await this.post(`${this.baseUrl}/sign-up`, dto);
    }
    async forgotPassword(dto: ForgotPasswordDto) {
        await this.post(`${this.baseUrl}/forgot-password`, dto);
    }

    async impersonate(dto: { companyId: number, userId: number }) : Promise<UserEntity> {
        const { data: { user } } = await this.post(`${this.baseUrl}/impersonate`, dto);

        return user;
    }
}
