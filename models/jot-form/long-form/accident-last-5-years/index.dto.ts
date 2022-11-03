import * as yup from "yup";
import "../../../../utils/yup";

export class AccidentHistoryEntity {
  date_of_accident?: string | Date;
  nature_of_accident?: string;
  number_of_accident?: string;
  location_of_accident?: string;
  number_of_fatalaties?: number;
  dot_recordable?: boolean = false;
  at_fault?: boolean = false;

  static yupSchema() {
    return yup.object({
      date_of_accident: yup.date().nullable(),
      nature_of_accident: yup.string().nullable(),
      location_of_accident: yup.string().nullable(),
      number_of_fatalaties: yup.number().nullable(),
      number_of_injured: yup.number().nullable(),
      dot_recordable: yup.boolean().default(false),
      at_fault: yup.boolean().default(false),
    });
  }

}
