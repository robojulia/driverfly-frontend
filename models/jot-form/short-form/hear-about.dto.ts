import * as yup from "yup";

export class HearAboutUsDto {
  hear_about_us: string;

  static yupSchema() {
    return yup.object({
        hear_about_us: yup.string().required().nullable(),
    });
  }
}
