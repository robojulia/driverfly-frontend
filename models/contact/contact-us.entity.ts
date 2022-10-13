import * as yup from "yup";

export class ContactUsEntity {

    name: string;
    email: string;
    subject: string;
    message: string;
    recaptchaValue: string;


    static yupSchema() {
        return yup.object({
            name: yup.string().trim().required().nullable(),
            email: yup.string().trim().email().required().nullable(),
            subject: yup.string().trim().required().nullable(),
            message: yup.string().trim().required().nullable(),
            recaptchaValue: yup.string().required().nullable(),
        });
    }
}
