import moment from "moment";
import * as yup from "yup";

export class DriverApplicationDto {
    first_name: string;
    last_name: string;
    date: string;

  static yupSchema() {
    return yup.object({
        first_name: yup
          .string()
          .matches(/^[A-Za-z ]*$/, "Please enter valid name")
          .required()
          .nullable(),
        last_name: yup
          .string()
          .matches(/^[A-Za-z ]*$/, "Please enter valid name")
          .required()
          .nullable(),
        date: yup.date().required(),
      })
  }
}
