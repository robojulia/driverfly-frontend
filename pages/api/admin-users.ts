import { UserWithCompany, UpdateSuperAdminDto } from '../../models/user/user-with-company.entity';
import BaseApi from './_baseApi';

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
}
