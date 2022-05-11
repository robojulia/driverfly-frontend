import "../public/css/owl.carousel.css";
import "../public/css/owl.theme.default.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "../public/css/style.css";
import "../public/css/responsive.css";
import "../public/dashboard/styles/css/global.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../public/bootstrap/css/bootstrap.min.css";



// import "../lang/i18nextconfig";
// import { appWithTranslation } from 'next-i18next';
// import { i18n } from 'next-i18next'
import { useRouter } from "next/router";
import * as yup from "yup";

import { useTranslation } from "../hooks/useTranslation";

import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const { locale } = useRouter()

  const { t } = useTranslation();

  const getLayout = Component.getLayout || ((page) => page)

  yup.setLocale({
    mixed: {
      required: (ctx) => t("yup.required"),
      oneOf: (ctx) => t("yup.oneOf", { values: ctx.values.join(',') }),
      notOneOf: (ctx) => t("yup.notOneOf", { values: ctx.values.join(',') }),
      notType: (ctx) => t("yup.notType", { type: `yup.type.${ctx.type}` }, { translateProps: true }),
      notType: (ctx) => t("yup.defined"),
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
    },
    number: {
      min: (ctx) => t("yup.number.min", { min: ctx.min }),
      max: (ctx) => t("yup.number.max", { max: ctx.max }),
      lessThan: (ctx) => t("yup.number.lessThan", { more: ctx.more }),
      greaterThan: (ctx) => t("yup.number.greaterThan", { more: ctx.more }),
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
    },
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

  useEffect(async () => {
    import("bootstrap/dist/js/bootstrap");
    console.log("CURRENT LOCALE", locale);
    // i18n.addResourceBundle(locale, 'common');
    // await i18n.init();

  }, []);

  return getLayout(<Component {...pageProps} />)
}

export default MyApp;
// export default appWithTranslation(MyApp);
