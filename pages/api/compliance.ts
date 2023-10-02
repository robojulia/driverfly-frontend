import { SendFileDto } from './../../models/compiance/send-file.dto';
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
    async remove(id: number): Promise<void> {
        await this.delete(`${this.baseUrl}/${id}`);
    }
    async sendComplianceFile(dto: SendFileDto): Promise<void> {
        const { data } = await this.get(this.buildUrl(this.baseUrl + "/send-file", dto));

        return data;
    }
}