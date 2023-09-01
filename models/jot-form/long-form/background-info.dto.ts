import moment from "moment";
import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class BackgroundInfoDto {
  birthdate: string;
  LINE_ADDRESS?: ApplicantExtrasEntity;
  city: string;
  state: string;
  zip_code: string;

  static yupSchema() {
    return yup.object({
      birthdate: yup
        .date()
        .required()
        .typeError("Invalid Date")
        .max(moment().endOf("day").subtract(18, "years"), "TOO YOUNG TO DRIVE"),
      LINE_ADDRESS: ApplicantExtrasEntity.yupSchema(),
      city: yup.string().required().nullable(),
      state: yup.string().required().nullable(),
      zip_code: yup.string().required().nullable(),
    });
  }
}
