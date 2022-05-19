import { AxiosRequestConfig } from "axios";
import { ApplicantStatus } from "../../enums/applicants/applicant-status.enum";
import { ApplicantJobEntity } from "../../models/applicant/applicant-job.entity";
import { ApplicantNoteEntity } from "../../models/applicant/applicant-note.entity";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { DocumentEntity } from "../../models/documents/document.entity";
import { ApplicantJobsByStatusDto } from "../../models/job/applicant-jobs-by-status.dto";
import BaseApi from "./_baseApi";

class ApplicantApi extends BaseApi {
    baseUrl: string = "applicants";
    constructor() {
        super();
    }

    async create(dto: ApplicantEntity): Promise<ApplicantEntity> {
        const { data } = await this.post(this.baseUrl, dto);

        return data;
    }

    async update(id: number, dto: ApplicantEntity): Promise<ApplicantEntity> {
        const { data } = await this.put(this.baseUrl + "/" + id, dto);

        return data;
    }

    async search(params: ApplicantEntity, config?: AxiosRequestConfig): Promise<ApplicantEntity[]> {
        const { data } = await this.get(this.buildUrl(this.baseUrl + "/search", params), config);

        return data;
    }

    async list(params: { jobId?: number, email?: string }): Promise<ApplicantEntity[]> {
        const { data } = await this.get(this.buildUrl(this.baseUrl + "/list", params));

        return data;
    }
    async getById(id: number): Promise<ApplicantEntity> {
        const { data } = await this.get(this.buildUrl(this.baseUrl + `/${id}`));

        return data;
    }

    // user specific actions
    async getByUserId(): Promise<ApplicantEntity> {
        const { data } = await this.get(this.baseUrl);

        return data;
    }

    async getApplicantJobsByStatus(params: ApplicantJobsByStatusDto) {
        const { data } = await this.get(`${this.baseUrl}/applicant-jobs-by-status`, { params });

        return data;
    }

    documents = {
        baseUrl: (applicantId: number) => `${this.baseUrl}/${applicantId}/documents`,
        create: async (applicantId: number, dto: DocumentEntity): Promise<DocumentEntity> => {
            const { data } = await this.post(this.documents.baseUrl(applicantId), dto);

            return data;
        }
    }

    notes = {
        baseUrl: (applicantId: number) => `${this.baseUrl}/${applicantId}/notes`,
        create: async (applicantId: number, dto: ApplicantNoteEntity): Promise<ApplicantNoteEntity> => {
            const { data } = await this.post(this.notes.baseUrl(applicantId), dto);

            return data;
        }
    }

    jobs = {
        baseUrl: (applicantId: number) => `${this.baseUrl}/${applicantId}/jobs`,
        list: async (applicantId: number) => {
            const { data } = await this.get(this.jobs.baseUrl(applicantId));

            return data;
        },
        remove: async (applicantId: number, jobId: number) => {
            await this.delete(this.jobs.baseUrl(applicantId) + `/${jobId}`);
        },
        create: async (applicantId: number, jobId: number, dto: ApplicantJobEntity): Promise<ApplicantEntity> => {
            const { data } = await this.post(this.jobs.baseUrl(applicantId) + `/${jobId}`, dto);

            return data;
        },
        update: async (applicantId: number, jobId: number, dto: ApplicantJobEntity): Promise<ApplicantEntity> => {
            const { data } = await this.put(this.jobs.baseUrl(applicantId) + `/${jobId}`, dto);

            return data;
        },
    }
}

export default ApplicantApi;
export {
    ApplicantApi
}
