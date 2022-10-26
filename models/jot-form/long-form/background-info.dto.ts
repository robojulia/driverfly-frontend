import moment from "moment";
import * as yup from "yup";

export class BackgroundInfoDto {
  birthdate: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  zip_code: number;

  static yupSchema() {
    return yup.object({
      birthdate: yup
        .date()
        .typeError("INVALID_DATE")
        .max(moment().endOf("day").subtract(18, "years"), "TOO YOUNG TO DRIVE"),
      address_line_1: yup.string().required().nullable(),
      city: yup.string().required().nullable(),
      state: yup.string().required().nullable(),
      zip_code: yup.number().required(),
    });
  }
}
