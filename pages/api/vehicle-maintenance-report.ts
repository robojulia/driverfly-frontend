import { VehicleMaintenanceReportEntity } from '../../models/company/vehicle-maintenance-report.entity';
import BaseApi from './_baseApi';

export default class VehicleMaintenanceReportApi extends BaseApi {
  baseUrl: string = 'vehicles';

  async list(vehicleId: number): Promise<VehicleMaintenanceReportEntity[]> {
    const { data } = await this.get(`${this.baseUrl}/${vehicleId}/maintenance-reports`);
    return data;
  }

  async getById(vehicleId: number, id: number): Promise<VehicleMaintenanceReportEntity> {
    const { data } = await this.get(`${this.baseUrl}/${vehicleId}/maintenance-reports/${id}`);
    return data;
  }

  async create(
    vehicleId: number,
    entity: VehicleMaintenanceReportEntity
  ): Promise<VehicleMaintenanceReportEntity> {
    const { data } = await this.post(`${this.baseUrl}/${vehicleId}/maintenance-reports`, entity);
    return data;
  }

  async update(
    vehicleId: number,
    id: number,
    entity: VehicleMaintenanceReportEntity
  ): Promise<VehicleMaintenanceReportEntity> {
    const { data } = await this.put(`${this.baseUrl}/${vehicleId}/maintenance-reports/${id}`, entity);
    return data;
  }

  async remove(vehicleId: number, id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${vehicleId}/maintenance-reports/${id}`);
  }
}
