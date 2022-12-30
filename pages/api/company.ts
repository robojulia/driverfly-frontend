import { CompanyEntity } from "../../models/company/company.entity";
import BaseApi from "./_baseApi";
import { FindManyOptions } from "../../models/general/find-many-options.dto";
import { AxiosRequestConfig } from "axios";

export default class CompanyApi extends BaseApi {
    baseUrl: string = "companies"
    async list(params?: { withPhoto?: boolean }): Promise<CompanyEntity[]> {
        const { data } = await this.get(this.buildUrl(this.baseUrl + "/list", params));

        return data;
    }
    async findById(id: number, params?: { withPhoto?: boolean }): Promise<CompanyEntity> {
        const { data } = await this.get(this.buildUrl(`${this.baseUrl}/${id}`, params));

        return data;
    }
    async create(dto: CompanyEntity): Promise<CompanyEntity> {
        const { data } = await this.post(this.baseUrl, dto);

        return data;
    }
    async update(id: number, dto: CompanyEntity): Promise<CompanyEntity> {
        const { data } = await this.put(`${this.baseUrl}/${id}`, dto);

        return data;
    }
    async remove(id: number): Promise<void> {
        await this.delete(`${this.baseUrl}/${id}`);
    }

    me = {
        get: async (): Promise<CompanyEntity> => {
            const { data } = await this.get(this.baseUrl);

            return data;
        },
        update: async (dto: CompanyEntity): Promise<CompanyEntity> => {
            const { data } = await this.put(this.baseUrl, dto);

            return data;
        },
        remove: async () : Promise<void> => {
            await this.delete(this.baseUrl);
        },

    };

    employer = {
        baseUrl: "employer",
        getById: async (id: number, config?: AxiosRequestConfig): Promise<CompanyEntity> => {
            const { data } = await this.get(`${this.employer.baseUrl}/${id}`, config);

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