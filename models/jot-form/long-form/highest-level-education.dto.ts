import moment from "moment";
import * as yup from "yup";

export class HighestLevelEducationDto {
  highest_degree: string;

  static yupSchema() {
    return yup.object({
      highest_degree: yup.string().nullable().required(),
    });
  }
}
