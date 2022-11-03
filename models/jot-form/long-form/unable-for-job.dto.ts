import * as yup from "yup";

export class UnableForJobDto {
  unable_declaration: boolean = false;
  explanations: string;
  static yupSchema() {
    return yup.object({
      explanations: yup.string().when("unable_declaration", {
        is: (v) => !!v,
        then: yup.string().required().nullable(),
        otherwise: yup.string().optional().nullable(),
      }),
    });
  }
}
