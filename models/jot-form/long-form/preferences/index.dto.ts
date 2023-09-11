import * as yup from "yup";
import { BooleanPreferenceType } from "../../../../enums/users/boolean-preferences.enum";
import { OtherRequirementType } from "../../../../enums/users/other-requirements.enum";
import "../../../../utils/yup";
import { JobSchedule } from "../../../../enums/jobs/job-schedule.enum";

export class PreferencesExtraDto {
  ROUTES: JobSchedule[] = [];
  REQUIRE_W2_EMPLOYMENT: BooleanPreferenceType[] = [];
  OTHER_ABSOLUTELY_REQUIREMENTS: OtherRequirementType[] = [];
  static yupSchema() {
    return yup.object({
      ROUTES: yup.array((yup.string() as any).enum(JobSchedule)).nullable(),
      REQUIRE_W2_EMPLOYMENT: yup
        .array((yup.string() as any).enum(BooleanPreferenceType))
        .optional()
        .nullable(),
      OTHER_ABSOLUTELY_REQUIREMENTS: yup
        .array((yup.string() as any).enum(OtherRequirementType))
        .optional()
        .nullable(),
    });
  }
}

