import moment from "moment";
import * as yup from "yup";

export class WasEmployedAsDto {
  position: string;
  start_date: string;
  end_date: string;

  static yupSchema() {
    return yup.object({
      position: yup.string().optional().nullable(),
      start_date: yup.date().optional().nullable(),
      end_date: yup.date().optional().nullable(),
    });
  }
}
