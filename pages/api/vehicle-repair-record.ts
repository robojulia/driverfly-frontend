import { VehicleRepairRecordEntity } from '../../models/company/vehicle-repair-record.entity';
import BaseApi from './_baseApi';

export default class VehicleRepairRecordApi extends BaseApi {
  baseUrl: string = 'vehicles';

  async list(vehicleId: number): Promise<VehicleRepairRecordEntity[]> {
    const { data } = await this.get(`${this.baseUrl}/${vehicleId}/repairs`);
    return data;
  }

  async getById(vehicleId: number, id: number): Promise<VehicleRepairRecordEntity> {
    const { data } = await this.get(`${this.baseUrl}/${vehicleId}/repairs/${id}`);
    return data;
  }

  async create(
    vehicleId: number,
    entity: VehicleRepairRecordEntity
  ): Promise<VehicleRepairRecordEntity> {
    const { data } = await this.post(`${this.baseUrl}/${vehicleId}/repairs`, entity);
    return data;
  }

  async update(
    vehicleId: number,
    id: number,
    entity: VehicleRepairRecordEntity
  ): Promise<VehicleRepairRecordEntity> {
    const { data } = await this.put(`${this.baseUrl}/${vehicleId}/repairs/${id}`, entity);
    return data;
  }

  async remove(vehicleId: number, id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${vehicleId}/repairs/${id}`);
  }
}
