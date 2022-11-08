import moment from "moment";
import * as yup from "yup";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class EmploymentHistoryDto {
    CURRENT_EMPLOYER: ApplicantExtrasEntity;

    static yupSchema() {
        return yup.object({
            CURRENT_EMPLOYER: ApplicantExtrasEntity.yupSchema()
        });
    }
}
