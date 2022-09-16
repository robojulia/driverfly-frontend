import { JobEntity } from "../../models/job/job.entity";
import BaseApi from "./_baseApi";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { SearchJobsDto } from "../../models/job/search-jobs-dto";
import { DocumentEntity } from "../../models/documents/document.entity";
import { StoredFileDto } from "../../models/compiance/stored-file.dto";

export default class ComplianceApi extends BaseApi {
    baseUrl: string = "compliance";
    constructor() {
        super();
    }
    async filesList(): Promise<DocumentEntity[]> {
        const { data } = await this.get(`${this.baseUrl}/files`);
        return data;
    }
    async createFile(entity: StoredFileDto): Promise<DocumentEntity> {
        const { data } = await this.post(`${this.baseUrl}/files`, entity);

        return data;
    }
    async update(id: number, entity: JobEntity): Promise<JobEntity> {
        const { data } = await this.put(`${this.baseUrl}/${id}`, entity);

        return data;
    }
    async remove(id: number): Promise<void> {
        await this.delete(`${this.baseUrl}/${id}`);
    }
}