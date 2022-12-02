import moment from "moment";
import * as yup from "yup";

export class SenderInfoDto {
  name: string;
  title: string;
  phone: string;
  email: string;
  date: string;

  static yupSchema() {
    return yup.object({
      name: yup
        .string()
        .matches(/^[A-Za-z ]*$/, "Please enter valid name")
        .required()
        .nullable(),
      title: yup.string().optional().nullable(),
      phone: yup.string().optional().nullable(),
      email: yup.string().email().required().nullable(),
      date: yup.date().optional().nullable(),
    });
  }
}
