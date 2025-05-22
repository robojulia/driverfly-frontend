import { VehicleEntity } from '../../models/company/vehicle.entity';
import BaseApi from './_baseApi';
import { VehicleWithDueInspectionsDto } from '../../models/company/vehicle-with-due-inspections.dto';

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
  async getDueInspections(
    startDate?: Date,
    endDate?: Date
  ): Promise<VehicleWithDueInspectionsDto[]> {
    // If no dates provided, default to next 30 days
    if (!startDate) {
      startDate = new Date();
    }
    if (!endDate) {
      endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
    }

    const { data } = await this.get(
      `${
        this.baseUrl
      }/due-inspections?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`
    );

    return data;
  }
}
