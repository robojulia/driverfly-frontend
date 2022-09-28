import { FlagInappropriateApplicantDto } from "../../models/flag-inappropriate-applicant/flag-inappropriate-applicant.dto";
import BaseApi from "./_baseApi";
export default class FlagInappropriateApplicantApi extends BaseApi {
    baseUrl: string = "support/flag-inappropriate-applicant";
    constructor() {
        super();
    }

    async FlagInappropriateApplicantApi(entity: FlagInappropriateApplicantDto): Promise<FlagInappropriateApplicantDto> {

        const { data } = await this.post(this.baseUrl, entity);
        return data;
    }

}