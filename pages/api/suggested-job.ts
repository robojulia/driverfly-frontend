import BaseApi from "./_baseApi";

export default class SuggestedJobApi extends BaseApi {
    baseUrl: string = "suggested-jobs";
    constructor() {
        super();
    }
    async list() {
        const { data } = await this.get(this.baseUrl);
        return data;
    }
    async getByJobId(jobId: number) {
        return await this.get(`${this.baseUrl}/job/${jobId}`);
    }
}
