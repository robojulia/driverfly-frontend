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
      // from_date: yup.date().required().max(new Date()).nullable(),
      end_date:  yup.date().required()
      .test({
        test : (value , context)=>{
          const start_date = context.resolve(yup.ref('ALREADY_WORKED_TO_COMPANY'));
          // if(!Boolean(value)) return true;
          if (value > start_date) return true;

          return context.createError({
            path:context.path,
            message : 'END_DATE_MUST_BE_AFTER_START_DATE'
          })
        }
      }).nullable(),
    });
  }
}
