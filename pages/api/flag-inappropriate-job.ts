import { FlagInappropriateJobDto } from "../../models/flag-inappropriate-job/flag-inappropriate-job.dto";
import BaseApi from "./_baseApi";
export default class FlagInappropriateJobApi extends BaseApi {
    baseUrl: string = "support/flag-inappropriate-job";
    constructor() {
        super();
    }

    async FlagInappropriateJob(entity: FlagInappropriateJobDto): Promise<FlagInappropriateJobDto> {

        const { data } = await this.post(this.baseUrl, entity);
        return data;
    }

}