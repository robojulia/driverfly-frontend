import * as yup from "yup";

export class FelonyConvictionDto {
  is_convicted_felony: boolean;
  criminal_history?: string;

  static yupSchema() {
    return yup.object({
      is_convicted_felony: yup.boolean().optional().nullable(),
    });
  }
}
