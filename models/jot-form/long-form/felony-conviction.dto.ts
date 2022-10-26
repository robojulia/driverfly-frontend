import moment from "moment";
import * as yup from "yup";

export class FelonyConvictionDto {
  felony_declaration: boolean = false;
  explanations: string;
  static yupSchema() {
    return yup.object({
      explanations: yup.string().when("felony_declaration", {
        is: (v) => !!v,
        then: yup.string().required().nullable(),
        otherwise: yup.string().optional().nullable(),
      }),
    });
  }
}
