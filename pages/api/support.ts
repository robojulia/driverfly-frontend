import { FlagInappropriateApplicantDto } from "../../models/flag-inappropriate-applicant/flag-inappropriate-applicant.dto";
import { FlagInappropriateJobDto } from "../../models/support/flag-inappropriate-job.dto";
import { SupportDto } from "../../models/support/support.dto";
import BaseApi from "./_baseApi";

export default class SupportApi extends BaseApi {
    baseUrl: string = "support";
    constructor() {
        super();
    }

    async ReportFlag(entity: SupportDto): Promise<SupportDto> {
        const { data } = await this.post(this.baseUrl, entity);

        return data;
    }

    async FlagInappropriateJob(entity: FlagInappropriateJobDto): Promise<FlagInappropriateJobDto> {

        const { data } = await this.post(`${this.baseUrl}/inappropriate-job-flag`, entity);

        return data;
    }

    async FlagInappropriateApplicantApi(entity: FlagInappropriateApplicantDto): Promise<FlagInappropriateApplicantDto> {

        const { data } = await this.post(`${this.baseUrl}/inappropriate-applicant-flag`, entity);

        return data;
    }

}