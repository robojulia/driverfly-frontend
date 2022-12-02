import moment from "moment";
import * as yup from "yup";

export class WasEmployedAsDto {
  position: string;
  start_date: string;
  end_date: string;

  static yupSchema() {
    return yup.object({
      position: yup.string().required().nullable(),
      start_date: yup.date().required().nullable(),
      end_date: yup.date().required().nullable(),
    });
  }
}
