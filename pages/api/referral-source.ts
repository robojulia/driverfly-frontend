import { ReferralSourceEntity } from "../../models/referral-source/referral-source.entity";
import BaseApi from "./_baseApi";

export class ReferralSourceApi extends BaseApi {
  baseUrl: string = "referral-sources";
  constructor() {
    super()
  }

  async create(dto: ReferralSourceEntity) : Promise<ReferralSourceEntity> {
    const { data } = await this.post(this.baseUrl, dto);

    return data;
  }

  async update(id: number, dto: ReferralSourceEntity) : Promise<ReferralSourceEntity> {
    const { data } = await this.put(this.baseUrl + "/"  + id, dto);

    return data;
  }

  async list() : Promise<ReferralSourceEntity[]> {
    const { data } = await this.get(this.baseUrl);

    return data;
  }

  async generateCode() : Promise<string> {
    const { data } = await this.get(this.baseUrl + "/generate-code");

    return data;
  }

  async getById(id: number) : Promise<ReferralSourceEntity> {
    const { data } = await this.get(this.baseUrl + "/" + id);

    return data;
  }

  async remove(id: number) : Promise<ReferralSourceEntity> {
    const { data } = await this.delete(this.baseUrl + "/" + id);

    return data;
  }

  async restore(id: number) : Promise<ReferralSourceEntity> {
    const { data } = await this.patch(this.baseUrl + "/" + id + "/restore", null);

    return data;
  }
}