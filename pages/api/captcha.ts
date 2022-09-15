import axios from "axios";
import BaseApi from "./_baseApi";
export default class CaptchaApi extends BaseApi {
    constructor() {
        super();
    }

    async validateCaptcha (token) {
        // const baseUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
        // const { data } = await this.get(baseUrl);

        const res = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
          );
        debugger
        console.log(res,'res')
        return res;
    }
}