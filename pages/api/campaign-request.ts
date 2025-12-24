import { CampaignRequestDTO } from "../../models/campaigns/campaign-request.dto";
import BaseApi from "./_baseApi";

export default class CampaignRequestApi extends BaseApi {
    baseUrl: string = "campaign-requests";

    constructor() {
        super();
    }

    async submitRequest(dto: CampaignRequestDTO): Promise<any> {
        const { data } = await this.post(this.baseUrl, dto);
        return data;
    }
}
