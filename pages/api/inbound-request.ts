import { InboundRequestDTO } from "../../models/campaigns/inbound-request.dto";
import BaseApi from "./_baseApi";

export default class InboundRequestApi extends BaseApi {
    baseUrl: string = "inbound-requests";

    constructor() {
        super();
    }

    async submitRequest(dto: InboundRequestDTO): Promise<any> {
        const { data } = await this.post(this.baseUrl, dto);
        return data;
    }
}
