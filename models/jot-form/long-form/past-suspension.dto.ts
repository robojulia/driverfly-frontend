import * as yup from "yup";

export class PastSuspensionDto {
  license_suspension: boolean = false;
  explanations: string;

  static yupSchema() {
    return yup.object({
      explanations: yup.string().when("license_suspension", {
        is: (v) => !!v,
        then: yup.string().required().nullable(),
        otherwise: yup.string().optional().nullable(),
      }),
    });
  }
}
