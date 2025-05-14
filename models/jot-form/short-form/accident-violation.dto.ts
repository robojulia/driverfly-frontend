import * as yup from "yup";

export class AccidentViolationDto {
  can_pass_drug_test: boolean = false;
  accident_count: number = 0;
  moving_violations_count: number = 0;
  all_violations_count: number = 0;
  // ELIGIBLE_TO_WORK_IN_US: string;
  authorized_to_work_in_us?: boolean = true;

  static yupSchema() {
    return yup.object({
      can_pass_drug_test: yup
        .boolean()
        .required("Please select Yes or No")
        .nullable(),
      accident_count: yup
        .number()
        .min(0, "Must be 0 or greater")
        .required("Please enter a number (0 if none)")
        .transform((value) => (isNaN(value) ? 0 : value))
        .nullable(),
      moving_violations_count: yup
        .number()
        .min(0, "Must be 0 or greater")
        .required("Please enter a number (0 if none)")
        .transform((value) => (isNaN(value) ? 0 : value))
        .nullable(),
      all_violations_count: yup
        .number()
        .min(0, "Must be 0 or greater")
        .required("Please enter a number (0 if none)")
        .transform((value) => (isNaN(value) ? 0 : value))
        .nullable(),
      // ELIGIBLE_TO_WORK_IN_US: yup.string().required().nullable(),
      authorized_to_work_in_us: yup
        .boolean()
        .required("Please indicate if you are eligible to work in the US")
        .nullable(),
    });
  }
}
