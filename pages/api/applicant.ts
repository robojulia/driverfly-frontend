import { ApplicantStatus } from "../../enums/applicants/ApplicantStatus.enum";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import BaseApi from "./_baseApi";

export default class ApplicantApi extends BaseApi {
    baseUrl: string = "applicants";
    constructor() {
        super();
    }
    user = {
        baseUrl:`${this.baseUrl}/user`,
        list: async (params: { jobId: number }) : Promise<ApplicantEntity[]> => {
            const { data } = await this.get(this.buildUrl(this.user.baseUrl, params));

            return data;
        },
        getById: async (id: number) : Promise<ApplicantEntity> => {
            const { data } = await this.get(this.buildUrl(this.user.baseUrl + `/${id}`));

            return data;
        },
        withdraw: async (id: number) : Promise<ApplicantEntity> => {
            const { data } = await this.put(this.buildUrl(this.user.baseUrl + `/${id}/status`), { status: ApplicantStatus.WITHDRAWN });

            return data;
        }
    }
    company = {
        baseUrl:`${this.baseUrl}/company`,
        list: async (params: { jobId: number }) : Promise<ApplicantEntity[]> => {
            const { data } = await this.get(this.buildUrl(this.company.baseUrl, params));

            return data;
        },
        getById: async (id: number) : Promise<ApplicantEntity> => {
            const { data } = await this.get(this.buildUrl(this.company.baseUrl + `/${id}`));

            return data;
        },
        updateStatus: async (id: number, status: ApplicantStatus) : Promise<ApplicantEntity> => {
            const { data } = await this.put(this.buildUrl(this.company.baseUrl + `/${id}/status`), { status });

            return data;
        }
    }
}