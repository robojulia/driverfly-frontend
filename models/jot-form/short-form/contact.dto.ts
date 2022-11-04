import * as yup from "yup";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class ContactDto {
    email: string;
    phone: string;
    zip_code: string;
    AUTHORIZE_TO_COMMUNICATE: ApplicantExtrasEntity;

    static yupSchema() {
        return yup.object({
            email: yup.string().email().required().nullable(),
            phone: yup.string().required().nullable(),
            zip_code: yup.string().required().nullable(),
            AUTHORIZE_TO_COMMUNICATE: ApplicantExtrasEntity.yupSchema(),
        });
    }
}
