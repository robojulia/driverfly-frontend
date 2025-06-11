import { ForgotPasswordDto } from "../../models/auth/forgot-password.dto";
import { LoginDto } from "../../models/auth/login.dto";
import { SignUpDto } from "../../models/auth/sign-up.dto";
import { VerifyEmailDto } from "../../models/auth/verify-email.dto";
import { VerifyPhoneDto } from "../../models/auth/verify-phone.dto";
import { CompanyEntity } from "../../models/company/company.entity";
import { UserEntity } from "../../models/user/user.entity";
import BaseApi from "./_baseApi";

export default class AuthApi extends BaseApi {
  private baseUrl: string = "auth"

  async login(dto: LoginDto): Promise<UserEntity> {
    const { data } = await this.post(`${this.baseUrl}/login`, dto);
    return data;
  }
  async signUp(dto: SignUpDto) {
    await this.post(`${this.baseUrl}/sign-up`, dto);
  }
  async forgotPassword(dto: ForgotPasswordDto) {
    await this.post(`${this.baseUrl}/forgot-password`, dto);
  }

  async verifyEmail(dto: VerifyEmailDto) {
    await this.post(`${this.baseUrl}/verify-email`, dto);
  }

  async sendVerifyEmail(email: string) {
    await this.post(`${this.baseUrl}/verify-email/resend`, { email: email });
  }

  async verifyPhone(dto: VerifyPhoneDto) {
    await this.post(`${this.baseUrl}/verify-phone`, dto);
  }

  async sendVerifyPhone(dto: VerifyPhoneDto) {
    await this.post(`${this.baseUrl}/verify-phone/resend`, dto);
  }

  async findCompanies(): Promise<CompanyEntity[]> {
    const { data } = await this.get(`${this.baseUrl}/companies`);

    return data;
  }

  async refreshToken(token: string): Promise<UserEntity> {
    const { data } = await this.get(`${this.baseUrl}/refresh-token`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return data;
  }

  async impersonate(dto: { companyId: number, userId: number }): Promise<UserEntity> {
    const { data } = await this.post(`${this.baseUrl}/impersonate`, dto);

    return data;
  }

  async changeOrganization(dto: { companyId: number }): Promise<UserEntity> {
    const { data } = await this.get(this.buildUrl(`${this.baseUrl}/change-organization`, dto));

    return data;
  }
}
