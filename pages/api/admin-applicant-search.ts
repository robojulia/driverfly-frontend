import {
  ApplicantWithAutoRecruitingData,
  ApplicantSearchResponse,
  ApplicantSearchParams,
} from '../../models/admin/admin-applicant-search.entity';
import BaseApi from './_baseApi';

export default class AdminApplicantSearchApi extends BaseApi {
  baseUrl: string = 'admin/applicants';

  async searchApplicants(params: ApplicantSearchParams = {}): Promise<ApplicantSearchResponse> {
    const { data } = await this.get(this.buildUrl(`${this.baseUrl}/search`, params));
    return data;
  }
}
