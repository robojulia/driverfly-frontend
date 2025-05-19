import { VehicleInspectionEntity } from '../../models/company/vehicle-inspection.entity';
import BaseApi from './_baseApi';

export default class VehicleInspectionApi extends BaseApi {
  baseUrl: string = 'vehicles';

  async list(vehicleId: number): Promise<VehicleInspectionEntity[]> {
    const { data } = await this.get(`${this.baseUrl}/${vehicleId}/inspections`);
    return data;
  }

  async getById(vehicleId: number, id: number): Promise<VehicleInspectionEntity> {
    const { data } = await this.get(`${this.baseUrl}/${vehicleId}/inspections/${id}`);
    return data;
  }

  async create(
    vehicleId: number,
    entity: VehicleInspectionEntity
  ): Promise<VehicleInspectionEntity> {
    const { data } = await this.post(`${this.baseUrl}/${vehicleId}/inspections`, entity);
    return data;
  }

  async update(
    vehicleId: number,
    id: number,
    entity: VehicleInspectionEntity
  ): Promise<VehicleInspectionEntity> {
    const { data } = await this.put(`${this.baseUrl}/${vehicleId}/inspections/${id}`, entity);
    return data;
  }

  async remove(vehicleId: number, id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${vehicleId}/inspections/${id}`);
  }
}
