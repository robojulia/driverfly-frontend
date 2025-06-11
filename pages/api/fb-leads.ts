import { FbLeadsDto } from "../../models/fb-leads.dto";
import BaseApi from "./_baseApi";
export default class FbLeadsApi extends BaseApi {
  baseUrl: string = "fb-leads";
  constructor() {
    super();
  }

  async fbLeads(dto: FbLeadsDto): Promise<FbLeadsDto> {
    const { data } = await this.post(this.baseUrl, dto);

    return data;
  }
  async fbLogin() {
    const baseUrl ="http://localhost:4000/api/fb-leads/facebook"
    const { data } = await this.get(baseUrl);
    return data;
  }  
  
}