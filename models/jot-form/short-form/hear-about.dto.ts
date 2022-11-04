import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class HearAboutUsDto {
  HEAR_ABOUT_US: ApplicantExtrasEntity;

  static yupSchema() {
    return yup.object({
      HEAR_ABOUT_US: ApplicantExtrasEntity.yupSchema(),
    });
  }
}
