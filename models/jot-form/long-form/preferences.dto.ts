import * as yup from "yup";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { JobSchedule } from "../../../enums/jobs/job-schedule.enum";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class PreferencesDto {
  preferred_location?: JobGeography[] = [];
  routes?: JobSchedule[];
  REQUIRE_W2_EMPLOYMENT?: ApplicantExtrasEntity;
  OTHER_ABSOLUTELY_REQUIREMENTS?: ApplicantExtrasEntity;
  static yupSchema() {
    return yup.object({
      preferred_location: yup
        .array((yup.string() as any).enum(JobGeography))
        .nullable(),
      routes: yup
        .array((yup.string() as any).enum(JobSchedule))
        .min(0)
        .nullable(),
      REQUIRE_W2_EMPLOYMENT: ApplicantExtrasEntity.yupSchema(),
      OTHER_ABSOLUTELY_REQUIREMENTS: ApplicantExtrasEntity.yupSchema(),
    });
  }
}
