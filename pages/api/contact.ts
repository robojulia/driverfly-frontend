import { ContactUsEntity } from "../../models/contact/contact-us.entity";
import BaseApi from "./_baseApi";

export default class ContactApi extends BaseApi {
  baseUrl: string = "contact-us";
  constructor() {
    super();
  }

  async sendMail(dto: ContactUsEntity): Promise<ContactUsEntity> {
    const { data } = await this.post(this.baseUrl, dto);
    return data;
  }
}