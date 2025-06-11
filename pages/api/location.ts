import { LocationEntity } from "../../models/company/location.entity";
import BaseApi from "./_baseApi";

export default class LocationApi extends BaseApi {
  baseUrl: string = "locations";
  async list(): Promise<LocationEntity[]> {
    const { data } = await this.get(this.baseUrl);
    return data;
  }
  async getById(id: number): Promise<LocationEntity> {
    const { data } = await this.get(`${this.baseUrl}/${id}`);

    return data;
  }
  async findById(id: number): Promise<LocationEntity> {
    const { data } = await this.get(`${this.baseUrl}/${id}`);

    return data;
  }
  async create (entity: LocationEntity): Promise<LocationEntity> {
    const { data } = await this.post(this.baseUrl, entity);

    return data;
  }
  async update (id: number, entity: LocationEntity): Promise<LocationEntity> {
    const { data } = await this.put(`${this.baseUrl}/${id}`, entity);

    return data;
  }
  async remove (id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${id}`);
  }

}