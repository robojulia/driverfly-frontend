import * as yup from "yup";
import { BooleanPreferenceType } from "../../../../enums/users/boolean-preferences.enum";
import { OtherRequirementType } from "../../../../enums/users/other-requirements.enum";
import { RouteType } from "../../../../enums/vehicles/routes-type.enum";
import "../../../../utils/yup";

export class PreferencesExtraDto {
  ROUTES: RouteType[] = [];
  REQUIRE_W2_EMPLOYMENT: BooleanPreferenceType[] = [];
  OTHER_ABSOLUTELY_REQUIREMENTS: OtherRequirementType[] = [];
  static yupSchema() {
    return yup.object({
      ROUTES: yup.array((yup.string() as any).enum(RouteType)).nullable(),
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

