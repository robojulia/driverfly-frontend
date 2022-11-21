import * as yup from "yup";
import { ApplicantExtras } from "../../enums/applicants/applicant-extras.enum";
import { BooleanPreferenceType } from "../../enums/users/boolean-preferences.enum";
import { OtherRequirementType } from "../../enums/users/other-requirements.enum";
import { RouteType } from "../../enums/vehicles/routes-type.enum";
import { AccidentHistoryEntity } from "../jot-form/long-form/accident-last-5-years/index.dto";
import { BackgroundInfoLineAddress } from "../jot-form/long-form/backgorund-info/index.dto";
import { CdlExtras } from "../jot-form/long-form/cdl-object/index.dto";
import { EmploymentHistoryExtraDto } from "../jot-form/long-form/emplyment-history/index.dto";
import { PreferencesExtraDto } from "../jot-form/long-form/preferences/index.dto";
import { PastEmploymentHistoryExtraDto } from "../jot-form/long-form/previous-emplyment-history/index.dto";
import { VioalationExtrasEntity } from "../jot-form/long-form/violaton-history/index.dto";
import { WorkedBeforeExtrasDto } from "../jot-form/long-form/worked-before/index.dto";

export class ApplicantExtrasEntity {
  constructor(type?: ApplicantExtras) {
    if (!!type) this.type = type;
  }
  id?: number;
  type: ApplicantExtras;
  value?: any;

  static yupSchema() {
    return yup.object({
      type: (yup.string().required().nullable() as any).enum(ApplicantExtras),
      value: yup
        .mixed()
        .when("type", {
          is: ApplicantExtras.AUTHORIZE_TO_COMMUNICATE,
          then: yup.string().required().nullable(),
        })
        .when("type", {
          is: ApplicantExtras.ACCIDENT_DETAILS,
          then: yup.array(AccidentHistoryEntity.yupSchema()),
        })
        .when("type", {
          is: ApplicantExtras.VIOLATION_DETAILS,
          then: yup.array(VioalationExtrasEntity.yupSchema()),
        })
        .when("type", {
          is: ApplicantExtras.VIOLATION_COUNT,
          then: yup.number().optional().nullable(),
        })
        .when("type", {
          is: ApplicantExtras.APPLY_DATE,
          then: yup.string().required().nullable(),
        })
        .when("type", {
          is: ApplicantExtras.SIGNATURE,
          then: yup.string().optional().nullable(),
        })
        .when("type", {
          is: ApplicantExtras.LINE_ADDRESS,
          then: BackgroundInfoLineAddress.yupSchema(),
        })
        .when("type", {
          is: ApplicantExtras.HEAR_ABOUT_US,
          then: yup.string().required().nullable(),
        })
        .when("type", {
          is: ApplicantExtras.QUALIFIED_FOR_MANUAL_TRANSMISSION,
          then: yup.string().optional().nullable(),
        })
        .when("type", {
          is: ApplicantExtras.CDL_NUMBER,
          then: yup.array(CdlExtras.yupSchema()),
        })
        .when("type", {
          is: ApplicantExtras.ROUTES,
          then: yup
            .array((yup.string() as any).enum(RouteType))
            .min(1)
            .typeError("Choose atleast one!")
            .required()
            .nullable(),
        })
        .when("type", {
          is: ApplicantExtras.REQUIRE_W2_EMPLOYMENT,
          then: yup.string().optional().nullable(),
        })
        .when("type", {
          is: ApplicantExtras.OTHER_ABSOLUTELY_REQUIREMENTS,
          then: yup
            .array((yup.string() as any).enum(OtherRequirementType))
            .optional()
            .nullable(),
        })
        .when("type", {
          is: ApplicantExtras.CURRENT_EMPLOYER,
          then: EmploymentHistoryExtraDto.yupSchema(),
        })
        .when("type", {
          is: ApplicantExtras.PAST_EMPLOYER,
          then: PastEmploymentHistoryExtraDto.yupSchema(),
        })
        .when("type", {
          is: ApplicantExtras.PAST_LICENSE_SUSPENSION,
          then: yup.string().required().nullable(),
        })
        .when("type", {
          is: ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB,
          then: yup.string().required().nullable(),
        })
        .when("type", {
          is: ApplicantExtras.CONVICTED_OF_FELONY,
          then: yup.string().required().nullable(),
        })
        .when("type", {
          is: ApplicantExtras.DOT_REGULATION,
          then: yup.string().required().nullable(),
        })
        .when("type", {
          is: ApplicantExtras.ALREADY_APPLIED_TO_COMPANY,
          then: yup.boolean().default(false).optional().nullable(),
        })
        .when("type", {
          is: ApplicantExtras.ALREADY_WORKED_TO_COMPANY,
          then: WorkedBeforeExtrasDto.yupSchema(),
        }),
    });
  }
}
