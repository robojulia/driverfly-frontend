import * as yup from "yup";

export class DrugTestDto {
  positive_drug_test: boolean;
  positive_drug_test_details: string;
  is_sap_participant: boolean;

  static yupSchema() {
    return yup.object({
      positive_drug_test: yup.bool().nullable(),
      positive_drug_test_details: yup.string().nullable(),
      is_sap_participant: yup.bool().nullable(),
    });
  }
}
