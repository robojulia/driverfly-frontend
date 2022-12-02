import * as yup from "yup";
import { ApplicantVoeFormEntity } from "../applicant/applicant-voe-form.entity";

export class UpsertApplicantVoeformDto {
  uuid_voe_token: string;
  applicantVoeFormData: ApplicantVoeFormEntity[];

  static yupSchema(enumType?: object) {
    return yup.object({
      uuid_voe_token: yup.string().nullable().required(),
      applicantVoeFormData: ApplicantVoeFormEntity.yupSchema(),
    });
  }
}
