import { DriverLicenseType } from "../../enums/users/driver-license-type.enum";
import { LocationEntity } from "../../models/company/location.entity";
import { VehicleEntity } from "../../models/company/vehicle.entity";
import { JobEntity } from "../../models/job/job.entity";
import BaseApi from "./_baseApi";
import { ApplyJobDto } from "../../models/job/apply-job.dto"

export default class JobApi extends BaseApi {
    baseUrl: string = "jobs";
    constructor() {
        super();
    }
    async create(entity: JobEntity): Promise<JobEntity> {
        const { data } = await this.post(this.baseUrl, entity);

        return data;
    }
    async update(id: number, entity: JobEntity): Promise<JobEntity> {
        const { data } = await this.put(`${this.baseUrl}/${id}`, entity);

        return data;
    }
    async getById(id: number): Promise<JobEntity> {
        const { data } = await this.get(`${this.baseUrl}/${id}`);

        return data;
    }
    async remove(id: number): Promise<void> {
        await this.delete(`${this.baseUrl}/${id}`);
    }

    async list(): Promise<JobEntity[]> {
        const { data } = await this.get(this.baseUrl);
        return data;
    }

    async search(params) {
        const { data } = await this.get(`${this.baseUrl}/search`, { params });
        return data;
    }

    async applyForJob(id: number, body: ApplyJobDto) {
        return await this.post(`${this.baseUrl}/${id}/apply`, body)
    }
}