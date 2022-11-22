import { ApplicantAccordion } from "../../enums/applicants/applicant-accordion.enum";
import * as yup from "yup";
import { AccordianExtras } from "../jot-form/long-form/accordian-info/index.dto";


export class ApplicantAccordionEntity {
    constructor(type?: ApplicantAccordion) {
        if(!!type) this.type = type;
    }

    id?: number;
    type: ApplicantAccordion;
    value?: any;

    static yupSchema(){
        return yup.object({
            type: (yup.string().required().nullable() as any).enum(ApplicantAccordion),
            value: yup
                .mixed()
                .when("type",{
                    is: ApplicantAccordion.DISCLOSURE_AND_AUTHORIZATION_DATE,
                    then: yup.date().optional().nullable(),
                })
                .when("type", {
                    is: ApplicantAccordion.EMPLOYEE_SS_OR_ID,
                    then: yup.string().optional().nullable(),
                })
                .when("type",{
                    is: ApplicantAccordion.IMPORTANT_DISCLOSURE_BACKGROUND_DATE,
                    then: yup.date().optional().nullable(),
                })
                .when("type",{
                    is: ApplicantAccordion.GENERAL_CONSENT,
                    then: yup.array(AccordianExtras.yupSchema()),
                })
        })
    }
}