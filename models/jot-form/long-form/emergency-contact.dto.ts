import moment from "moment";
import * as yup from "yup";

export class EmergenyContactDto {
  emergency_contact_name: string;
  emergency_contact_number: string;
  emergency_contact_relationship: string;

  static yupSchema() {
    return yup.object({
      emergency_contact_name: yup.string().nullable(),
      emergency_contact_number: yup.string().nullable(),
      emergency_contact_relationship: yup.string().nullable(),
    });
  }
}
