import moment from "moment";
import * as yup from "yup";

export class HighestLevelEducationDto {
  education_level: string;

  static yupSchema() {
    return yup.object({
      education_level: yup.string().nullable().required(),
    });
  }
}
