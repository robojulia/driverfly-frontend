import * as yup from "yup";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";
import { ApplicantAccordion } from "../../../enums/applicants/applicant-accordion.enum";

export class AccordianDto {
    SIGNATURE: ApplicantExtrasEntity;

    static yupSchema(){
        return yup.object({
            SIGNATURE: ApplicantExtrasEntity.yupSchema()
        });
    }
}