import moment from "moment";
import * as yup from "yup";

export class DrivingExperienceDto {
  license_number: string;
  state: string;
  license_expiry: string | Date;
  license_state: string;
  static yupSchema() {
    return yup.object({
      license_expiry: yup
        .date()
        .typeError("INVALID_DATE")
        .min(
          moment().endOf("day").add(0.5, "years"),
          "Your License should at least be valid for 6 more months"
        ),
      state: yup.string().required().nullable(),
      license_number: yup.string().required().nullable(),
      license_state: yup.string().required().nullable(),
    });
  }
}
