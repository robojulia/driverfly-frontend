import * as yup from "yup";

export class PreferencesDto {
  routes_open_to: string;
  other_requirements: string;
  static yupSchema() {
    return yup.object({
      routes_open_to: yup
        .array()
        .min(1)
        .typeError("Choose atleast one!")
        .required(),
    });
  }
}
