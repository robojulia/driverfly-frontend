import * as yup from "yup";
import { BooleanTypeExtra } from "./../../../enums/jotform/bool-and-not-sure.enum";

export class ContactDto {
  email: string;
  zip_code: string;
  authorize_to_communicate: BooleanTypeExtra;

  static yupSchema() {
    return yup.object({
      email: yup.string().email().required().nullable(),
      zip_code: yup
        .string()
        .required()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(5, "Must be exactly 5 digits")
        .max(5, "Must be exactly 5 digits"),
      authorize_to_communicate: yup
        .string()
        .required()
        .nullable(),
    });
  }
}
