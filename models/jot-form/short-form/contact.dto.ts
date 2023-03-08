import * as yup from "yup";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class ContactDto {
    email: string;
    zip_code: string;
    AUTHORIZE_TO_COMMUNICATE: ApplicantExtrasEntity;

    static yupSchema() {
        return yup.object({
            email: yup.string().email().required().nullable(),
            zip_code: yup.string()
                .required()
                .matches(/^[0-9]+$/, "Must be only digits")
                .min(5, 'Must be exactly 5 digits')
                .max(5, 'Must be exactly 5 digits'),
            AUTHORIZE_TO_COMMUNICATE: ApplicantExtrasEntity.yupSchema(),
        });
    }
}
