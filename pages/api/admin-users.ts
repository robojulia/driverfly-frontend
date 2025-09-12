import { UserWithCompany, UpdateSuperAdminDto } from '../../models/user/user-with-company.entity';
import BaseApi from './_baseApi';

export interface GdprDeleteUserResponse {
  success: boolean;
  message: string;
  deletedData: {
    userScrubbed: boolean;
    companyDeprecated: boolean;
    companyDisabled: boolean;
    applicantsDeleted: number;
  };
}

export default class AdminUsersApi extends BaseApi {
  baseUrl: string = 'admin/users';

  async getAllUsers(): Promise<UserWithCompany[]> {
    const { data } = await this.get(this.baseUrl);
    return data;
  }

  async updateSuperAdminStatus(userId: number, superAdmin: boolean): Promise<void> {
    const dto: UpdateSuperAdminDto = { super_admin: superAdmin };
    await this.put(`${this.baseUrl}/${userId}/super-admin`, dto);
  }

  async gdprDeleteUser(userId: number): Promise<GdprDeleteUserResponse> {
    const { data } = await this.delete(`${this.baseUrl}/${userId}/gdpr-delete`, { confirm: true });
    return data;
  }
}
