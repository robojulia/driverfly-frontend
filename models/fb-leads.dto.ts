
import * as yup from "yup";

export class FbLeadsDto {
  name: string;
  follow_up_action_url: string;
  questions: string;
  legal_content_id: string;
  // privacy_policy: string;



  static yupSchema() {
    return yup.object({
      name: yup.string().trim().required().nullable(),
      follow_up_action_url: yup.string().trim().required().nullable(),
      questions: yup.string().trim().required().nullable(),
      legal_content_id: yup.string().trim().required().nullable(),
      // privacy_policy: yup.string().trim().required().nullable(),

    });
  }
}
  