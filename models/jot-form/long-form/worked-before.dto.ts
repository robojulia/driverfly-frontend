import * as yup from "yup";

export class WorkedBeforeDto {
  applied_before: boolean = false;
  worked_before: boolean = false;
  from_date: string | Date;
  to_date: string | Date;

  static yupSchema() {
    return yup.object({
      worked_before: yup.boolean().when("applied_before", {
        is: (v) => !!v,
        then: yup.boolean().required().nullable(),
        otherwise: yup.boolean().optional().nullable(),
      }),
      from_date: yup.date().when("worked_before", {
        is: (v) => !!v,
        then: yup.date().required().nullable(),
        otherwise: yup.date().optional().nullable(),
      }),
      to_date: yup.date().when("worked_before", {
        is: (v) => !!v,
        then: yup.date().required().nullable(),
        otherwise: yup.date().optional().nullable(),
      }),
    });
  }
}
