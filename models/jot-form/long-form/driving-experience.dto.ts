import moment from "moment";
import * as yup from "yup";
import stateList from "../../../utils/stateList";

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
          "LICENSE_MUST_BE_VALID_FOR_6_MONTHS"
        ),
      state: yup.string().required().nullable(),
      license_state: yup
        .string()
        .required()
        .oneOf(stateList.map((state) => state.value))
        .nullable(),
      license_number: yup
        .string()
        // .when("license_state", {
        //   is: (value) => value == "AL",
        //   then: yup.string().max(8),
        // })
        .required()
        .nullable(),
    });
  }
}
