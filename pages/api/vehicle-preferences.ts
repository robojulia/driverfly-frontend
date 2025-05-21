import { VehiclePreferencesEntity } from '../../models/company/vehicle-preferences.entity';
import BaseApi from './_baseApi';

export default class VehiclePreferencesApi extends BaseApi {
  baseUrl: string = 'vehicles';

  async getByVehicleId(vehicleId: number): Promise<VehiclePreferencesEntity> {
    try {
      const { data } = await this.get(`${this.baseUrl}/${vehicleId}/preferences`);
      return data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async create(
    vehicleId: number,
    entity: Partial<VehiclePreferencesEntity>
  ): Promise<VehiclePreferencesEntity> {
    const { data } = await this.post(`${this.baseUrl}/${vehicleId}/preferences`, entity);
    return data;
  }

  async update(
    vehicleId: number,
    entity: Partial<VehiclePreferencesEntity>
  ): Promise<VehiclePreferencesEntity> {
    const { data } = await this.put(`${this.baseUrl}/${vehicleId}/preferences`, entity);
    return data;
  }
}
