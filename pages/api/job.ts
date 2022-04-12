import { LocationEntity } from "../../models/company/location.entity";
import VehicleEntity from "../../models/company/vehicle.entity";
import { JobEntity } from "../../models/job/job.entity";
import BaseApi from "./_baseApi";

export default class JobApi extends BaseApi {
    companyId: number = null;
    constructor(companyId: number) {
        super();
        this.companyId = companyId;
    }
    baseCompanyUrl(companyId?: number): string { return `companies/${companyId ?? this.companyId}/jobs` }
    async create(entity: JobEntity, companyId?: number): Promise<JobEntity> {
        const { data } = await this.post(this.baseCompanyUrl(companyId), entity);

        return data;
    }
    async fetchAll(params) {
        const { data } = await this.get(`jobs`, {params});
        return data;
    }
}