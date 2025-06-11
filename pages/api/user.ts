import { Status } from './../../enums/status.enum';
import BaseApi from "./_baseApi";

import { UserEntity } from "../../models/user/user.entity";
import { UserPreferenceCategory } from "../../enums/users/user-preference-category.enum";
import { UserPreferenceEntity } from "../../models/user/user-preference.entity";

export default class UserApi extends BaseApi {
  async create(user: UserEntity): Promise<UserEntity> {
    const { data } = await this.post(`user`, user);

    return data;
  }

  async update(id: number, user: UserEntity): Promise<UserEntity> {
    const { data } = await this.put(`user/${id}`, user);

    return data;
  }

  async remove(id: number): Promise<void> {
    await this.delete(`user/${id}`);
  }

  async restore(id: number): Promise<void> {
    const { data } = await this.put(`user/${id}/restore`, null);
  }

  async list(companyId?: number): Promise<UserEntity[]> {
    const { data } = await this.get(this.buildUrl("user/list", { companyId }));

    return data;
  }

  async findById(id: number): Promise<UserEntity> {
    const { data } = await this.get(`user/${id}`);

    return data;
  }

  me = {
    get: async (): Promise<UserEntity> => {
      const { data } = await this.get("user");

      return data;
    },
    update: async (user: UserEntity): Promise<UserEntity> => {
      const { data } = await this.put("user", user);

      return data;
    },
    remove: async (): Promise<void> => {
      await this.delete("user");
    },
  }

  preferences = {
    baseUrl: (userId: number) => `user/${userId}/preferences`,
    list: async (userId: number, query?: { category?: UserPreferenceCategory, label?: string }): Promise<UserPreferenceEntity[]> => {
      const { data } = await this.get(this.buildUrl(this.preferences.baseUrl(userId), query));

      return data;
    },
    create: async (userIda: number, dto: UserPreferenceEntity): Promise<UserPreferenceEntity> => {
      const { data } = await this.post(this.preferences.baseUrl(userIda), dto);

      return data;
    },
    update: async (userId: number, id: number, dto: UserPreferenceEntity): Promise<UserPreferenceEntity> => {
      const { data } = await this.put(`${this.preferences.baseUrl(userId)}/${id}`, dto);

      return data;
    },
    remove: async (userId: number, id: number): Promise<void> => {
      await this.delete(`${this.preferences.baseUrl(userId)}/${id}`);
    }
  }
}
