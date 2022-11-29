import * as yup from "yup";
import { ApplicantVoeFormEntity } from "../../applicant/applicant-voe-form.entity";

export class AccidentHistoryDto {
  WAS_EMPLOYED_AS: ApplicantVoeFormEntity;
  did_drive_check: boolean;
  DID_DRIVE_FOR_YOU: ApplicantVoeFormEntity;
  SAFETY_PERFORMANCE_HISTROY_REPORT: ApplicantVoeFormEntity;
  registered_accidents_check: boolean;
  REGISTERED_ACCIDENTS_DETAILS: ApplicantVoeFormEntity;
  ACCIDENT_REPORTED_TO_GOVERNMENT: ApplicantVoeFormEntity;
  REASON_TO_LEAVE_EMPLOYMENT: ApplicantVoeFormEntity;

  static yupSchema() {
    return yup.object({
      WAS_EMPLOYED_AS: ApplicantVoeFormEntity.yupSchema(),
      DID_DRIVE_FOR_YOU: yup.object().when("did_drive_check", {
        is: (v) => !!v,
        then: ApplicantVoeFormEntity.yupSchema(),
      }),
      SAFETY_PERFORMANCE_HISTROY_REPORT: ApplicantVoeFormEntity.yupSchema(),
      REGISTERED_ACCIDENTS_DETAILS: ApplicantVoeFormEntity.yupSchema(),
      ACCIDENT_REPORTED_TO_GOVERNMENT: ApplicantVoeFormEntity.yupSchema(),
      REASON_TO_LEAVE_EMPLOYMENT: ApplicantVoeFormEntity.yupSchema(),
    });
  }
}
