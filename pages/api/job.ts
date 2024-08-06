import { JobEntity } from "../../models/job/job.entity";
import BaseApi from "./_baseApi";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { SearchJobsDto } from "../../models/job/search-jobs-dto";
import { Pagination } from "../../types/pagination.type";
import { GetJobsWithApplicantsDto } from "../../models/job/get-jobs-with-applicants.dto";

export default class JobApi extends BaseApi {
    baseUrl: string = "jobs";
    constructor() {
        super();
    }
    async sitemap(): Promise<JobEntity[]> {
        const { data } = await this.get(`${this.baseUrl}/sitemap`);
        return data;
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

    async search(params: SearchJobsDto): Promise<Pagination<JobEntity> | JobEntity[]> {
        const { data } = await this.get(`${this.baseUrl}/search`, { params });
        return data;
    }

    async applicants(params: GetJobsWithApplicantsDto): Promise<Pagination<JobEntity> | JobEntity[]> {
        const { data } = await this.get(`${this.baseUrl}/applicants`, { params });
        return data;
    }

    async keywordSearchQuery(params: string): Promise<any> {
        const { data } = await this.get(`${this.baseUrl}/keyword-search-query`, { params });
        return data;
    }

    async apply(jobId: number, body: ApplicantEntity): Promise<ApplicantEntity> {
        const { data } = await this.post(`${this.baseUrl}/${jobId}/apply`, body);

        return data;
    }
}