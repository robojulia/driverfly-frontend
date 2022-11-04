import * as yup from "yup";
import { ApplicantExtras } from "../../enums/applicants/applicant-extras.enum";
import { AccidentHistoryEntity } from "../jot-form/long-form/accident-last-5-years/index.dto";
import { VioalationExtrasEntity } from "../jot-form/long-form/violaton-history/index.dto";

export class ApplicantExtrasEntity {
  constructor(type?: ApplicantExtras) {
    if (!!type) this.type = type;
  }
  id?: number;
  type?: ApplicantExtras;
  value?: any;

  static yupSchema() {
    return yup.object({
      type: (yup.string().required().nullable() as any).enum(ApplicantExtras),
      value: yup
        .mixed()
        .when("type", {
          is: ApplicantExtras.AUTHORIZE_TO_COMMUNICATE,
          then: yup.string().required().nullable(),
        })
        .when("type", {
          is: ApplicantExtras.ACCIDENT_DETAILS,
          then: yup.array(AccidentHistoryEntity.yupSchema()),
        })
        .when("type", {
          is: ApplicantExtras.VIOLATION_DETAILS,
          then: yup.array(VioalationExtrasEntity.yupSchema()),
        })
        .when("type", {
          is: ApplicantExtras.APPLY_DATE,
          then: yup.date().required().nullable(),
        })
        .when("type", {
          is: ApplicantExtras.HEAR_ABOUT_US,
          then: yup.string().required().nullable(),
        }),
    });
  }
}
