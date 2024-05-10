import moment from "moment";
import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class BackgroundInfoDto {
  birthdate: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  zip_code: string;

  static yupSchema() {
    return yup.object({
      address_1: yup.string().required().nullable(),
      address_2: yup.string().optional().nullable(),
      birthdate: yup
        .date()
        .required()
        .typeError("Invalid Date")
        .max(moment().endOf("day").subtract(18, "years"), "TOO YOUNG TO DRIVE"),
      city: yup.string().required().nullable(),
      state: yup.string().required().nullable(),
      zip_code: yup.string().required().nullable(),
    });
  }
}
