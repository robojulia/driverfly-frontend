import { ApplicantStatus } from "../../enums/applicants/applicant-status.enum";
import { ApplicantJobEntity } from "../../models/applicant/applicant-job.entity";
import { ApplicantNoteEntity } from "../../models/applicant/applicant-note.entity";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import BaseApi from "./_baseApi";

export default class ApplicantApi extends BaseApi {
    baseUrl: string = "applicants";
    constructor() {
        super();
    }

    async upsertByUserId(dto: ApplicantEntity) : Promise<ApplicantEntity> {
        const { data } = await this.post(this.baseUrl, dto);

        return data;
    }

    async list(params: { jobId: number }) : Promise<ApplicantEntity[]> {
        const { data } = await this.get(this.buildUrl(this.baseUrl + "/list", params));

        return data;
    }
    async getById(id: number) : Promise<ApplicantEntity> {
        const { data } = await this.get(this.buildUrl(this.baseUrl + `/${id}`));

        return data;
    }

    notes = {
        baseUrl: (applicantId: number) => `${this.baseUrl}/${applicantId}/notes`,
        create: async (applicantId: number, dto: ApplicantNoteEntity) : Promise<ApplicantNoteEntity> => {
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
        update: async (applicantId: number, jobId: number, dto: ApplicantJobEntity) : Promise<ApplicantEntity> => {
            const { data } = await this.put(this.jobs.baseUrl(applicantId) + `/${jobId}`, dto);

            return data;
        },
    }
}