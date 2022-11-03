import * as yup from "yup";
import { ApplicantExtras } from "../../enums/applicants/applicant-extras.enum";

export class ApplicantExtrasEntity {
    constructor(type?: ApplicantExtras) {
        if (!!type) this.type = type
    }
    id?: number;
    type?: ApplicantExtras;
    value?: any;

    static yupSchema() {
        return yup.object({
            type: (yup.string().required().nullable() as any).enum(ApplicantExtras),
            value: yup.mixed()
                .when("type", {
                    is: ApplicantExtras.AUTHORIZE_TO_COMMUNICATE,
                    then: yup.string().required().nullable()
                })
                .when("type", {
                    is: ApplicantExtras.LINE_ADDRESS,
                    then: yup.string().required().nullable()
                })

        });
    }
}
