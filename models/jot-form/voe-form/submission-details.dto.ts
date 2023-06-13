import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";
import { ApplicantVoeFormEntity } from "../../applicant/applicant-voe-form.entity";

export class SubmissionDetailsDto {
  SIGNATURE_VOE: ApplicantVoeFormEntity;
  SENDER_INFO: ApplicantVoeFormEntity;
  
  static yupSchema() {
    return yup.object({
        SIGNATURE_VOE: ApplicantVoeFormEntity.yupSchema(),
        SENDER_INFO: ApplicantVoeFormEntity.yupSchema(),
    });
  }
}
