import moment from "moment";
import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class DrugHistoryDto {
  subject_to_tests_dot: boolean;
  SUBJECT_TO_TESTS_DOT: ApplicantExtrasEntity;
  previous_employer_report: boolean;
  return_to_duty_process: boolean;
//   TYPE_OF_VEHICLE: ApplicantExtrasEntity;
//   safety_performance_history: boolean;
//   accident_register_data: boolean;


  static yupSchema() {
    return yup.object({
        type_of_vehicle: yup.boolean().required().nullable(),
        TYPE_OF_VEHICLE: yup
        .object()
        .when("type_of_vehicle", {
          is: (v) => !!v,
          then: ApplicantExtrasEntity.yupSchema(),
        })
        .nullable(),

    });
  }
}
