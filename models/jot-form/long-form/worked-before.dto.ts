import * as yup from "yup";

export class WorkedBeforeDto {
  already_applied_to_company?: boolean;
  already_worked_to_company?: boolean;
  already_worked_start_date?: Date;
  already_worked_end_date?: Date;

  static yupSchema() {
    return yup.object({
      already_applied_to_company: yup
        .boolean()
        .default(false)
        .optional()
        .nullable(),
      already_worked_to_company: yup
        .boolean()
        .default(false)
        .optional()
        .nullable(),
      already_worked_start_date: yup.date().max(new Date()).nullable(),
      already_worked_end_date: yup
        .date()
        .test({
          test: (value, context) => {
            const start_date = context.resolve(
              yup.ref("already_worked_start_date")
            );
            if (!Boolean(value)) return true;
            if (value > start_date) return true;

            return context.createError({
              path: context.path,
              message: "END_DATE_MUST_BE_AFTER_START_DATE",
            });
          },
        })
        .nullable(),
    });
  }
}
