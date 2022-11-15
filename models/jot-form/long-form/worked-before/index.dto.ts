import * as yup from "yup";
import "../../../../utils/yup";

export class WorkedBeforeExtrasDto {
  start_date: string | Date
  end_date: string | Date
  static yupSchema() {
    return yup.object({
        start_date: yup.date().required().nullable(),
        end_date: yup.date().required().nullable(),
    });
  }
}
