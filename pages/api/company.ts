import { LocationEntity } from "../../models/company/location.entity";
import VehicleEntity from "../../models/company/vehicle.entity";
import BaseApi from "./_baseApi";
import { JobEntity } from "../../models/job/job.entity";

export default class CompanyApi extends BaseApi {
    companyId: number = null;
    constructor(companyId: number) {
        super();
        this.companyId = companyId;
    }
    baseUrl(companyId?: number): string { return `companies/${companyId ?? this.companyId}` }
    locations = {
        baseUrl: (companyId?: number) => `${this.baseUrl(companyId)}/locations`,
        get: async (companyId?: number): Promise<LocationEntity[]> => {
            const { data } = await this.get(this.locations.baseUrl(companyId));
            return data;
        },
        getById: async (id: number, companyId?: number): Promise<LocationEntity> => {
            const { data } = await this.get(`${this.locations.baseUrl(companyId)}/${id}`);

            return data;
        },
        create: async (entity: LocationEntity, companyId?: number): Promise<LocationEntity> => {
            const { data } = await this.post(this.locations.baseUrl(companyId), entity);

            return data;
        },
        update: async (id: number, entity: LocationEntity, companyId?: number): Promise<LocationEntity> => {
            const { data } = await this.put(`${this.locations.baseUrl(companyId)}/${id}`, entity);

            return data;
        },
        remove: async (id: number, companyId?: number): Promise<void> => {
            await this.delete(`${this.locations.baseUrl(companyId)}/${id}`);
        }
    }
    vehicles = {
        baseUrl: (companyId?: number) => `${this.baseUrl(companyId)}/vehicles`,
        get: async (params?: { withPhoto?: boolean }, companyId?: number): Promise<VehicleEntity[]> => {
            const { data } = await this.get(this.vehicles.baseUrl(companyId) + (params && params.withPhoto ? "?withPhoto=true" : ""));
            return data;
        },
        getById: async (id: number, params?: { withPhoto?: boolean }, companyId?: number): Promise<VehicleEntity> => {
            const { data } = await this.get(`${this.vehicles.baseUrl(companyId)}/${id}` + (params && params.withPhoto ? "?withPhoto=true" : ""));

            return data;
        },
        create: async (entity: VehicleEntity, companyId?: number): Promise<VehicleEntity> => {
            const { data } = await this.post(this.vehicles.baseUrl(companyId), entity);

            return data;
        },
        update: async (id: number, entity: VehicleEntity, companyId?: number): Promise<VehicleEntity> => {
            const { data } = await this.put(`${this.vehicles.baseUrl(companyId)}/${id}`, entity);

            return data;
        },
        remove: async (id: number, companyId?: number): Promise<void> => {
            await this.delete(`${this.vehicles.baseUrl(companyId)}/${id}`);
        }
    }
    jobs = {
        baseUrl: (companyId?: number) => `${this.baseUrl(companyId)}/jobs`,
        get: async (companyId?: number): Promise<JobEntity[]> => {
            const { data } = await this.get(this.jobs.baseUrl(companyId));
            return data;
        },
        getById: async (id: number, companyId?: number): Promise<JobEntity> => {
            const { data } = await this.get(`${this.jobs.baseUrl(companyId)}/${id}`);

            return data;
        },
        create: async (entity: JobEntity, companyId?: number): Promise<JobEntity> => {
            const { data } = await this.post(this.jobs.baseUrl(companyId), entity);

            return data;
        },
        update: async (id: number, entity: JobEntity, companyId?: number): Promise<JobEntity> => {
            const { data } = await this.put(`${this.jobs.baseUrl(companyId)}/${id}`, entity);

            return data;
        },
        remove: async (id: number, companyId?: number): Promise<void> => {
            await this.delete(`${this.jobs.baseUrl(companyId)}/${id}`);
        }
    }

}