import * as yup from "yup";
import { ApplicantExtrasEntity } from "../applicant/applicant-extras.entity";
import { ApplicantEntity } from "../applicant/applicant.entity";

export class UpsertApplicantJotformDto {
  applicant?: ApplicantEntity;
  applicantExtras?: ApplicantExtrasEntity[];

  static yupSchema(enumType?: object) {
    return yup.object({
      applicant: ApplicantEntity.yupSchema(),
      applicantExtras: ApplicantExtrasEntity.yupSchema(),
    });
  }
}
