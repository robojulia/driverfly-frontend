import VehicleEntity from "../../models/company/vehicle.entity";
import BaseApi from "./_baseApi";

export default class VehicleApi extends BaseApi {
    baseUrl: string = "vehicles";
    async list(params?: { withPhoto?: boolean }): Promise<VehicleEntity[]> {
        const { data } = await this.get(this.baseUrl + (params && params.withPhoto ? "?withPhoto=true" : ""));
        return data;
    }
    async getById (id: number, params?: { withPhoto?: boolean }): Promise<VehicleEntity> {
        const { data } = await this.get(`${this.baseUrl}/${id}` + (params && params.withPhoto ? "?withPhoto=true" : ""));

        return data;
    }
    async create (entity: VehicleEntity): Promise<VehicleEntity> {
        const { data } = await this.post(this.baseUrl, entity);

        return data;
    }
    async update (id: number, entity: VehicleEntity): Promise<VehicleEntity> {
        const { data } = await this.put(`${this.baseUrl}/${id}`, entity);

        return data;
    }
    async remove (id: number): Promise<void> {
        await this.delete(`${this.baseUrl}/${id}`);
    }
}