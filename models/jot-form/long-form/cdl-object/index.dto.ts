import * as yup from "yup";
import "../../../../utils/yup";
import moment from "moment";

export class CdlExtras {
  license_number: string;
  date: string | Date;
  state: string;

  static yupSchema() {
    return yup.object({
      date: yup
        .date()
        .typeError("INVALID_DATE")
        .required()
        .nullable(),
      state: yup.string().required().nullable(),
      license_number: yup.string().required().nullable(),
    });
  }
}
