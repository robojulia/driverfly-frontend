import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import { useFormik } from "formik";
import * as yup from "yup";
import Head from 'next/head';
import Back from '../components/back-to-login/back-login'
import { PublicLayout } from "../components/layouts/public-layout";
import Forgotpassword from '../public/css/forgot.module.css'
import AuthApi from "./api/auth";
import { useTranslation } from "../hooks/use-translation"
import BaseInput from "../components/forms/base-input";

export default function Forgot() {
  const { t } = useTranslation();

  const form = useFormik({
    initialValues: {
      email: null
    },
    validationSchema: yup.object({
      email: yup.string().email(t("INVALID_EMAIL_FORMAT")).required().nullable()
    }),
    onSubmit: async (values) => {
      const api = new AuthApi();

      try {
        const dto = {
          email: values.email
        };
        const apicall = await api.forgotPassword(dto);
        console.log(apicall, "++++++++++++++++++++++++++")

        toast.success(t("PLEASE_CHECK_EMAIL"));
      }
      catch (e) {
        console.error("Unable to submit password reset", e);

        const response = e.response?.data;

        if (response) {
          toast.error(t(response.message));
        }
        else {
          toast.error(t("UNABLE_TO_SEND_PASSWORD_RESET_EMAIL"))
        }
      }
    }
  });

  return (
    <>
      <Head>
        <title>
          {t("FORGET_PASSWORD_META_TITLE")} </title>
        <meta
          name="description"
          content={t("FORGET_PASSWORD_META_DESC")} key="desc"
        />
      </Head>

      <div className="top-links-sec">
        <div className="container">
          <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h1>{t("FORGOT_PASSWORD")}</h1>
          </div>
        </div>
      </div>
      <div className={Forgotpassword.formsec}>
        <div className="container">
          <ToastContainer />
          <div className='row'>
            <div className='col-lg-2'></div>
            <div className='col-lg-8'>
              < Back />
              <h4 className='text-center mt-5 font-weight-normal'>{t("FORGOT_PASSWORD")}</h4>
              <p className="mt-2 mb-5 text-center  text-secondary ">{t("ENTER_DETAILS_TO_RESET_YOUR_PASSWORD")}</p>
              <form onSubmit={form.handleSubmit} className={Forgotpassword.mb}>
                <BaseInput
                  className="col-12 p-0"
                  required
                  name="email"
                  label={t("EMAIL")}
                  placeholder={t("EMAIL")}
                  value={form.values.email}
                  touched={form.touched.email}
                  error={form.errors.email}
                  onChange={form.handleChange}
                  handleBlur={form.handleBlur}
                />
                <button disabled={form.isSubmitting}
                  type="submit"
                  className={`${Forgotpassword.success_btn} w-100 d-block p-3 mt-2`}>
                  {t("RESET_PASSWORD")}
                </button>
                <Link href="/login">
                  <span
                    role="button"
                    className={Forgotpassword.backlink}>
                    {t('BACK_TO_LOGIN')}
                  </span>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
Forgot.getLayout = function getLayout(page) {
  return (
    <PublicLayout title="FORGOT_PASSWORD">
      {page}
    </PublicLayout>
  )
}
