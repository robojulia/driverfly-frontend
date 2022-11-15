import * as yup from "yup";

export class VioalationExtrasEntity {
  date_of_violation?: string;
  location?: string;
  charge?: string;
  penalty?: string;

  static yupSchema() {
    return yup.object({
      date_of_violation: yup.string().required().nullable(),
      location: yup.string().required().nullable(),
      charge: yup.string().required().nullable(),
      penalty: yup.string().required().nullable(),
    });
  }
}
