import * as yup from "yup";
import { ApplicantExtrasEntity } from "../applicant/applicant-extras.entity";
import { ApplicantVoeFormEntity } from "../applicant/applicant-voe-form.entity";
import { ApplicantEntity } from "../applicant/applicant.entity";

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
