import BaseApi from "./_baseApi";
export default class CaptchaApi extends BaseApi {
    constructor() {
        super();
    }

    async validateCaptcha(token) {
        try {
            const baseUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
            const data = baseUrl;
            return data;

        } catch (error) {
            console.log("error", error.message, error);

        }
    }
}