import moment from "moment";
import * as yup from "yup";

export class WasEmployedAsDto {
  position: string;
  start_date: string;
  end_date: string;

  static yupSchema() {
    return yup.object({
      position: yup.string().required().nullable(),
      start_date: yup.date().required().nullable(),
      end_at: yup.date().required()
        .test({
          test: (value, context) => {
            const start_date = context.resolve(yup.ref('start_date'));
            if (!Boolean(value)) return true;
            if (value > start_date) return true;

            return context.createError({
              path: context.path,
              message: 'END_DATE_MUST_BE_AFTER_START_DATE'
            })
          }
        }
        )
        .nullable(),
    });
  }
}
