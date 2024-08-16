import * as yup from "yup";

export class NamesDto {
  first_name?: string;
  last_name?: string;

  static yupSchema() {
    return yup.object({
      first_name: yup
        .string()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ '-]*$/, "Please enter a valid name")
        .required()
        .nullable(),
      last_name: yup
        .string()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ '-]*$/, "Please enter a valid name")
        .required()
        .nullable(),
    });
  }
}
