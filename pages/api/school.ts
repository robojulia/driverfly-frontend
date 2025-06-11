import { SchoolEntity } from "../../models/school/school.entity";
import BaseApi from "./_baseApi";

export default class SchoolApi extends BaseApi {
  baseUrl: string = "schools";
  constructor() {
    super();
  }
  async create(entity: SchoolEntity): Promise<SchoolEntity> {
    const { data } = await this.post(this.baseUrl, entity);

    return data;
  }
  async update(id: number, entity: SchoolEntity): Promise<SchoolEntity> {
    const { data } = await this.put(`${this.baseUrl}/${id}`, entity);

    return data;
  }
  async getById(id: number): Promise<SchoolEntity> {
    const { data } = await this.get(`${this.baseUrl}/${id}`);

    return data;
  }
  async remove(id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${id}`);
  }
  async list(): Promise<SchoolEntity[]> {
    const { data } = await this.get(this.baseUrl);
    return data;
  }
  async search(params) {
    const { data } = await this.get(`${this.baseUrl}/search`, { params });
    return data;
  }
}
