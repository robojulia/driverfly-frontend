import * as yup from "yup";

export class OtherQueuesDto {
  manual_qualification: string;
  endorsements_twic: string;

  static yupSchema() {
    return yup.object({
      manual_qualification: yup.string().nullable(),
      endorsements_twic: yup.string().nullable(),
    });
  }
}
