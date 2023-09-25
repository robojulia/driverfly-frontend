import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class WorkedBeforeDto {
  ALREADY_APPLIED_TO_COMPANY: ApplicantExtrasEntity;
  ALREADY_WORKED_TO_COMPANY: ApplicantExtrasEntity
  is_worked_before: boolean
  // ALREADY_WORKED_TO_COMPANY: boolean = false;
  from_date: string ;
  to_date: string ;

  static yupSchema() {
    return yup.object({
      ALREADY_APPLIED_TO_COMPANY: ApplicantExtrasEntity.yupSchema(),
      
      is_worked_before: yup.boolean().default(false).optional().nullable(),
      ALREADY_WORKED_TO_COMPANY: yup
        .object()
        .when("is_worked_before", {
          is: (v) => !!v,
          then: ApplicantExtrasEntity.yupSchema(),
        })
        .nullable(),
      // from_date: yup.date().when("worked_before", {
      //   is: (v) => !!v,
      //   then: yup.date().required().nullable(),
      //   otherwise: yup.date().optional().nullable(),
      // }),
      // to_date: yup.date().when("worked_before", {
      //   is: (v) => !!v,
      //   then: yup.date().required().nullable(),
      //   otherwise: yup.date().optional().nullable(),
      // }),
    });
  }
}
