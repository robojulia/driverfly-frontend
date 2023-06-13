import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class PreferencesDto {
  ROUTES: ApplicantExtrasEntity;
  REQUIRE_W2_EMPLOYMENT?: ApplicantExtrasEntity;
  OTHER_ABSOLUTELY_REQUIREMENTS?: ApplicantExtrasEntity;
  static yupSchema() {
    return yup.object({
      ROUTES: ApplicantExtrasEntity.yupSchema(),
      REQUIRE_W2_EMPLOYMENT: ApplicantExtrasEntity.yupSchema(),
      OTHER_ABSOLUTELY_REQUIREMENTS: ApplicantExtrasEntity.yupSchema(),
    });
  }
}
