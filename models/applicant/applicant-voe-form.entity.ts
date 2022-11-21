import * as yup from "yup";
import { ApplicantVoeFormEnum } from "../../enums/applicants/applicant-voe-form.enum";

export class ApplicantVoeFormEntity {
  constructor(type?: ApplicantVoeFormEnum) {
    if (!!type) this.type = type;
  }
  id?: number;
  type: ApplicantVoeFormEnum;
  value?: any;

  static yupSchema() {
    return yup.object({
      type: (yup.string().required().nullable() as any).enum(
        ApplicantVoeFormEnum
      ),
      value: yup.mixed()
      .when("type", {
        is: ApplicantVoeFormEnum.EMPLOYED_BY_US,
        then: yup.boolean().default(false).required().nullable(),
      })
      .when("type", {
        is: ApplicantVoeFormEnum.WAS_EMPLOYED_AS,
        then: yup.boolean().default(false).required().nullable(),
      })
      
      ,
    });
  }
}
