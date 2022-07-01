import BaseApi from "./_baseApi";

export default class CallApi extends BaseApi {
    baseUrl: string = "calls";
    constructor() {
        super();
    }
    async generateToken() {
        const { data } = await this.get(`${this.baseUrl}/generate-token`);
        return data;
    }
}