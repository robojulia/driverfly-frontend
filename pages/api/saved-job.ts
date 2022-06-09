import BaseApi from "./_baseApi";

export default class SavedJobApi extends BaseApi {
    baseUrl: string = "saved-jobs";
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
    async saveJob(jobId: number) {
        return await this.post(`${this.baseUrl}/job/${jobId}`, {});
    }
    async remove(jobId: number) {
        return await this.delete(`${this.baseUrl}/job/${jobId}`);
    }
}