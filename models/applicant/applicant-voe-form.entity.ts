import * as yup from "yup";
import { ApplicantVoeFormEnum } from "../../enums/applicants/applicant-voe-form.enum";
import { ReasonsForLeavingEmployment } from "../../enums/users/reasons-for-leaving-employment";
import { RefisteredAccidentDetailsDto } from "../jot-form/voe-form/registered_accident_details/index.dto";
import { SenderInfoDto } from "../jot-form/voe-form/sender_info/index.dto";
import { WasEmployedAsDto } from "../jot-form/voe-form/was-employed-as/index.dto.";


export class ApplicantVoeFormEntity {
  constructor(type?: ApplicantVoeFormEnum) {
    if (!!type) this.type = type;
  }
  id?: number;
  type: ApplicantVoeFormEnum;
  value?: any;

  static yupSchema() {
    return yup.object({
      type: (yup.string().required().nullable() as any).enum(
        ApplicantVoeFormEnum
      ),
      value: yup
        .mixed()
        .when("type", {
          is: ApplicantVoeFormEnum.EMPLOYED_BY_US,
          then: yup.boolean().default(false).required().nullable(),
        })
        .when("type", {
          is: ApplicantVoeFormEnum.WAS_EMPLOYED_AS,
          then: WasEmployedAsDto.yupSchema(),
        })
        .when("type", {
          is: ApplicantVoeFormEnum.DID_DRIVE_FOR_YOU,
          then: yup.string().optional().nullable(),
        })
        .when("type", {
          is: ApplicantVoeFormEnum.SAFETY_PERFORMANCE_HISTROY_REPORT,
          then: yup.boolean().default(false).optional().nullable(),
        })
        .when("type", {
          is: ApplicantVoeFormEnum.REGISTERED_ACCIDENTS_DETAILS,
          then: yup.array(RefisteredAccidentDetailsDto.yupSchema()),
        })
        .when("type", {
          is: ApplicantVoeFormEnum.ACCIDENT_REPORTED_TO_GOVERNMENT,
          then: yup.string().optional().nullable(),
        })
        .when("type", {
          is: ApplicantVoeFormEnum.REASON_TO_LEAVE_EMPLOYMENT,
          then: yup
            .array((yup.string() as any).enum(ReasonsForLeavingEmployment))
            .optional()
            .nullable(),
        })
        .when("type", {
          is: ApplicantVoeFormEnum.SIGNATURE_VOE,
          then: yup.string().optional().nullable(),
        })
        .when("type", {
          is: ApplicantVoeFormEnum.SENDER_INFO,
          then: SenderInfoDto.yupSchema(),
        }),
    });
  }
}
