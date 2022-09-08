import BaseApi from "./_baseApi";
export default class CaptchaApi extends BaseApi {
    constructor() {
        super();
    }

    async validateCaptcha (token) {
        const baseUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
        const { data } = await this.get(baseUrl);
        return data;
    }
}