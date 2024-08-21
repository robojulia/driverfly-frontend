import * as yup from "yup";

export class NamesDto {
  first_name?: string;
  last_name?: string;

  static yupSchema() {
    return yup.object({
      first_name: yup.string().required().nullable().trim(),
      last_name: yup.string().required().nullable().trim(),
    });
  }
}
