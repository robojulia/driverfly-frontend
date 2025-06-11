import * as yup from "yup";
import "../utils/yup";

// Remove the useTranslation hook and use a different approach
export function yupInit(t: (key: string, params?: any, options?: any) => string) {
    yup.setLocale({
        mixed: {
          required: (ctx) => t("yup.required"),
          oneOf: (ctx) => Array.isArray(ctx.values) ? 
            t("yup.oneOf", { values: ctx.values.join(',') }) :
            t("yup.mustBe", { values: ctx.values })
          ,
          notOneOf: (ctx) => Array.isArray(ctx.values) ? 
            t("yup.notOneOf", { values: ctx.values.join(',') }) :
            t("yup.cannotBe", { values: ctx.values })
          ,
          notType: (ctx) => t("yup.notType", { type: `yup.type.${ctx.type}` }, { translateProps: true }),
        //   notType: (ctx) => t("yup.defined"),
          default: (ctx) => t("yup.default"),
        },
        string: {
          length: (ctx) => t("yup.string.length", { min: ctx.length }),
          min: (ctx) => t("yup.string.min", { min: ctx.min }),
          max: (ctx) => t("yup.string.max", { max: ctx.max }),
          matches: (ctx) => t("yup.string.matches", { regex: ctx.regex }),
          email: (ctx) => t("yup.string.email", { regex: ctx.regex }),
          url: (ctx) => t("yup.string.url", { regex: ctx.regex }),
          uuid: (ctx) => t("yup.string.uuid", { regex: ctx.regex }),
          trim: (ctx) => t("yup.string.trim"),
          lowercase: (ctx) => t("yup.string.lowercase"),
          uppercase: (ctx) => t("yup.string.uppercase"),
          unique: (ctx) => t("yup.string.unique", { field: ctx.field })
        } as any,
        number: {
          min: (ctx) => {
            return t("yup.number.min", { min: ctx.min })
          },
          max: (ctx) => t("yup.number.max", { max: ctx.max }),
          lessThan: (ctx) => t("yup.number.lessThan", { less: ctx.less }),
          moreThan: (ctx) => t("yup.number.greaterThan", { more: ctx.more }),
          positive: (ctx) => t("yup.number.positive", { more: ctx.more }),
          negative: (ctx) => t("yup.number.negative", { less: ctx.less }),
          integer: (ctx) => t("yup.number.integer")
        },
        date: {
          min: (ctx) => t("yup.date.min", { min: ctx.min instanceof Date ? ctx.min.toLocaleDateString() : ctx.min }),
          max: (ctx) => t("yup.date.max", { max: ctx.max instanceof Date ? ctx.max.toLocaleDateString() : ctx.max }),
        },
        object: {
          noUnknown: (ctx) => t("yup.object.noUnknown"),
        },
        array: {
          length: (ctx) => t("yup.array.length", { min: ctx.length }),
          min: (ctx) => t("yup.array.min", { min: ctx.min }),
          max: (ctx) => t("yup.array.max", { max: ctx.max }),
          unique: (ctx) => t("yup.array.unique", { field: ctx.field })
        } as any,
        boolean: {
          isValue: (ctx) => t("yup.boolean.isValue"),
        },
        // mixed?: MixedLocale;
        // string?: StringLocale;
        // number?: NumberLocale;
        // date?: DateLocale;
        // boolean?: BooleanLocale;
        // object?: ObjectLocale;
        // array?: ArrayLocale;
      });
}