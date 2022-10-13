import * as yup from "yup";

export class LoginDto {
    email: string;
    password: string;

    static yupSchema() {
        return yup.object({
            email: yup.string().email().required().nullable(),
            password: yup.string().required().nullable(),
        });
    }
}
