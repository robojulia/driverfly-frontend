import { CompanyEntity } from "../../models/company/company.entity";
import BaseApi from "./_baseApi";
import { JobEntity } from "../../models/job/job.entity";
import { FindManyOptions } from "../../models/general/find-many-options.dto";

export default class CompanyApi extends BaseApi {
    baseUrl: string = "companies"
    async list(): Promise<CompanyEntity[]> {
        const { data } = await this.get(this.baseUrl + "/list");

        return data;
    }
    async getById(): Promise<CompanyEntity> {
        const { data } = await this.get(this.baseUrl);

        return data;
    }
    async update(dto: CompanyEntity): Promise<CompanyEntity> {
        const { data } = await this.put(this.baseUrl, dto);

        return data;
    }
    async remove(): Promise<void> {
        await this.delete(this.baseUrl);
    }

    employer = {
        baseUrl: "employer",
        getById: async (id: number): Promise<CompanyEntity> => {
            const { data } = await this.get(`${this.employer.baseUrl}/${id}`);

            return data;
        },
        getJobCount: async (id: number): Promise<number> => {
            const { data } = await this.get(`${this.employer.baseUrl}/${id}/jobs-count`);

            return data;
        },
        list: async (params: FindManyOptions): Promise<CompanyEntity[]> => {
            const { data } = await this.get(`${this.employer.baseUrl}`, { params });

            return data;
        },
    }

}