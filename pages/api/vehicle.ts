import { VehicleEntity } from '../../models/company/vehicle.entity';
import BaseApi from './_baseApi';

export default class VehicleApi extends BaseApi {
  baseUrl: string = 'vehicles';
  async list(params?: { withDocuments?: boolean }): Promise<VehicleEntity[]> {
    const { data } = await this.get(
      this.baseUrl + (params && params.withDocuments ? '?withDocuments=true' : '')
    );
    return data;
  }
  async getById(id: number, params?: { withDocuments?: boolean }): Promise<VehicleEntity> {
    const { data } = await this.get(
      `${this.baseUrl}/${id}` + (params && params.withDocuments ? '?withDocuments=true' : '')
    );

    return data;
  }
  async findById(id: number, params?: { withDocuments?: boolean }): Promise<VehicleEntity> {
    const { data } = await this.get(
      `${this.baseUrl}/${id}` + (params && params.withDocuments ? '?withDocuments=true' : '')
    );

    return data;
  }
  async create(entity: VehicleEntity): Promise<VehicleEntity> {
    const { data } = await this.post(this.baseUrl, entity);

    return data;
  }
  async update(id: number, entity: VehicleEntity): Promise<VehicleEntity> {
    const { data } = await this.put(`${this.baseUrl}/${id}`, entity);

    return data;
  }
  async remove(id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${id}`);
  }
}
