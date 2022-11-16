import * as yup from "yup";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";
import { AccidentHistoryEntity } from "./accident-last-5-years/index.dto";

export class AccidentHistoryDto {
  accident_count: number;
  // accident_detail?: AccidentHistoryEntity[] = [];
  // ACCIDENT_DETAILS?: ApplicantExtrasEntity = new ApplicantExtrasEntity(ApplicantExtras.ACCIDENT_DETAILS);
  // ACCIDENT_DETAILS?: ApplicantExtrasEntity = {
  //     ... new ApplicantExtrasEntity(ApplicantExtras.ACCIDENT_DETAILS),
  //     value: [AccidentHistoryEntity]
  // };
  ACCIDENT_DETAILS?: ApplicantExtrasEntity;

  static yupSchema() {
    return yup.object({
      accident_count: yup.number().nullable(),
      ACCIDENT_DETAILS: ApplicantExtrasEntity.yupSchema(),
    });
  }
}
