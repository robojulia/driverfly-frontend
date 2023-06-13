import * as yup from "yup";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { DriverEndorsement } from "../../../enums/users/driver-endorsement.enum";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class OtherQueuesDto {
  QUALIFIED_FOR_MANUAL_TRANSMISSION?: ApplicantExtrasEntity;
  endorsements?: DriverEndorsement[] = [];
  CDL_NUMBER?: ApplicantExtrasEntity;
  static yupSchema() {
    return yup.object({
      QUALIFIED_FOR_MANUAL_TRANSMISSION: ApplicantExtrasEntity.yupSchema(),
      endorsements: yup
        .array((yup.string() as any).enum(DriverEndorsement))
        .optional()
        .nullable(),
      CDL_NUMBER: ApplicantExtrasEntity.yupSchema(),
    });
  }
}
