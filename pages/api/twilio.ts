import BaseApi from "./_baseApi";

export default class TwilioApi extends BaseApi {
  baseUrl: string = "twilio";
  constructor() {
    super();
  }

  async generateToken(): Promise<any> {
    const { data } = await this.get(`${this.baseUrl}/generate-token`);
    return data;
  }

  // return type wil be changed to user_integration entity when created   
  async getPhoneNumber(): Promise<any> {
    const { data } = await this.get(`${this.baseUrl}/phone-number`);
    return data;
  }

  // will return call logs from twilio
  async getMissedCall(): Promise<any> {
    const { data } = await this.get(`${this.baseUrl}/missed-call`);
    return data;
  }
}