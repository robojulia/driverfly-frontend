import moment from "moment";
import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class FelonyConvictionDto {
  is_convicted_felony: boolean;
  criminal_history?: string;
  CONVICTED_OF_FELONY: ApplicantExtrasEntity;

  static yupSchema() {
    return yup.object({
      is_convicted_felony: yup.boolean().optional().nullable(),
      CONVICTED_OF_FELONY: yup
        .object()
        .when("is_convicted_felony", {
          is: (v) => !!v,
          then: ApplicantExtrasEntity.yupSchema(),
        })
        .nullable(),
    });
  }
}
