import BaseApi from "./_baseApi";
import { RoleEntity } from "../../models/roles/role.enttiy";

export default class RoleApi extends BaseApi {
  baseUrl: string = "roles";
  constructor() {
    super();
  }
  async list(): Promise<RoleEntity[]> {
    const { data } = await this.get(this.baseUrl);
    return data;
  }
  async getById(id: number): Promise<RoleEntity> {
    const { data } = await this.get(`${this.baseUrl}/${id}`);

    return data;
  }
  async create(entity: RoleEntity): Promise<RoleEntity> {
    const { data } = await this.post(this.baseUrl, entity);

    return data;
  }
  async update(id: number, entity: RoleEntity): Promise<RoleEntity> {
    const { data } = await this.put(`${this.baseUrl}/${id}`, entity);

    return data;
  }
  async remove(id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${id}`);
  }
}