import * as yup from "yup";

export class FelonyConvictionDto {
  is_convicted_felony: boolean = null;
  criminal_history?: string = "";

  static yupSchema() {
    return yup.object({
      is_convicted_felony: yup
        .boolean()
        .required("Please indicate whether you have been convicted of a felony")
        .nullable(),
      criminal_history: yup
        .string()
        .transform((value) => (value === null ? "" : value))
        .when("is_convicted_felony", {
          is: true,
          then: yup
            .string()
            .required("Please provide details about your conviction"),
        })
        .nullable(),
    });
  }
}
