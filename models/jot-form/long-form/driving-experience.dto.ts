import moment from "moment";
import * as yup from "yup";

export class DrivingExperienceDto {
  cdl_number: number;
  state: string;
  expiration_date: number;
  state_issued: string;
  static yupSchema() {
    return yup.object({
      expiration_date: yup
        .date()
        .typeError("INVALID_DATE")
        .min(
          moment().endOf("day").add(0.5, "years"),
          "Your License should at least be valid for 6 more months"
        ),
      state: yup.string().required().nullable(),
      cdl_number: yup.string().required().nullable(),
      state_issued: yup.string().required().nullable(),
    });
  }
}
