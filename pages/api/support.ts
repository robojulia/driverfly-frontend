import { FlagInappropriateApplicantDto } from "../../models/support/flag-inappropriate-applicant.dto";
import { FlagInappropriateJobDto } from "../../models/support/flag-inappropriate-job.dto";
import { FlagInappropriateCompanyDto } from "../../models/support/flag-inappropriate-company.dto";
import { SupportDto } from "../../models/support/support.dto";
import BaseApi from "./_baseApi";

export default class SupportApi extends BaseApi {
  baseUrl: string = "support";
  constructor() {
    super();
  }

  async reportIssue(entity: SupportDto): Promise<SupportDto> {
    const { data } = await this.post(this.baseUrl, entity);
    return data;
  }

  async FlagInappropriateJob(entity: FlagInappropriateJobDto): Promise<FlagInappropriateJobDto> {
    const { data } = await this.post(`${this.baseUrl}/flag-inappropriate-job`, entity);
    return data;
  }

  async FlagInappropriateApplicant(entity: FlagInappropriateApplicantDto): Promise<FlagInappropriateApplicantDto> {
    const { data } = await this.post(`${this.baseUrl}/flag-inappropriate-applicant`, entity);
    return data;
  }

  async FlagInappropriateCompany(entity: FlagInappropriateCompanyDto): Promise<FlagInappropriateCompanyDto> {
    const { data } = await this.post(`${this.baseUrl}/flag-inappropriate-company`, entity);
    return data;
  }

}