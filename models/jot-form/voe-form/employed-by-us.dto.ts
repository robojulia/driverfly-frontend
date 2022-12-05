import * as yup from "yup";
import { ApplicantVoeFormEntity } from "../../applicant/applicant-voe-form.entity";

export class EmployedByUsDto {
  EMPLOYED_BY_US: ApplicantVoeFormEntity;
  static yupSchema() {
    return yup.object({
      EMPLOYED_BY_US: ApplicantVoeFormEntity.yupSchema(),
    });
  }
}
