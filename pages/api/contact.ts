import { ContactUsDto } from "../../models/contact/contact-us.dto";
import BaseApi from "./_baseApi";

export default class ContactApi extends BaseApi {
    baseUrl: string = "contact-us";
    constructor() {
        super();
    }

    async sendMail(dto:ContactUsDto): Promise<any> {
        const { data } = await this.post(this.baseUrl, dto);
        return data;
    }

    async validateCaptcha(token):Promise<any>{
        const {data} = await this.post('contact-us/recaptcha', token)
    }
}