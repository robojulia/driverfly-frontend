import moment from "moment";
import * as yup from "yup";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class EmploymentHistoryDto {
    is_current_employed: boolean;
    CURRENT_EMPLOYER: ApplicantExtrasEntity;

    static yupSchema() {
        return yup.object({
            is_current_employed: yup.boolean().optional().nullable(),
            CURRENT_EMPLOYER: yup.object().when("is_current_employed", {
                is: v => !!v,
                then: ApplicantExtrasEntity.yupSchema()
            }).nullable()
        });
    }
}
