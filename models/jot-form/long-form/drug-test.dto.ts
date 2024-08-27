import * as yup from "yup";

export class DrugTestDto {
  positive_drug_test: boolean;
  positive_drug_test_details: string;

  static yupSchema() {
    return yup.object({
      positive_drug_test: yup.bool().nullable(),
      positive_drug_test_details: yup.string().nullable(),
    });
  }
}
