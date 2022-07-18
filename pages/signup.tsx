import Head from "next/head"
import Link from "next/link"
import Breadcrumb from "../components/breadcrumbs/Breadcrumb";
import { PublicLayout } from "../components/layouts/PublicLayout";
import SignupStyle from "../public/css/signup.module.css"
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useFormik } from "formik";

import BaseInput from "../components/forms/BaseInput";
import BaseSelect from "../components/forms/BaseSelect";
import BaseCheck from "../components/forms/BaseCheck";
import BaseInputPhone from "../components/forms/BaseInputPhone";



import AuthApi from "./api/auth";

import { useTranslation } from "../hooks/useTranslation";
import { SignUpRole } from "../enums/auth/sign-up-role.enum"
import { Row } from "reactstrap"

import { globalAjaxExceptionHandler } from "../utils/ajax";
import { SignUpDto } from "../models/auth/sign-up.dto";


export default function Signup() {

  const router = useRouter();

  const { user } = useAuth();

  if (user) {
    router.push('/dashboard')
  }

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: new SignUpDto(),
    validationSchema: SignUpDto.yupSchema(),
    onSubmit: async (dto) => {
      const api = new AuthApi();

      try {
        await api.signUp(dto);
        toast.success(t("SUCCESSFULLY_REGISTERED"));
        setTimeout(goToLogin, 3000);
      }
      catch (e) {
        globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t, defaultMessage: "UNABLE_TO_SIGNUP" });
      }
    }
  });

  const goToLogin = function () {
    router.push('/login')
  }

  return (
    <>
      <Head>
        <title>{t("DRIVERFLY_SIGN_UP")}</title>
      </Head>

      <div className="top-links-sec">
        <div className="container">
          <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>{t("SIGN_UP")}</h2>
            <Breadcrumb />
          </div>
        </div>
      </div>
      <div className={SignupStyle.banner}>
        <div className="container">
          <h1>Drivers, have access<br />to over 1,000 jobs for free.</h1>
          <p>Are you a motor carrier? View our packages
            <Link href="http://go.driverfly.co/motor-carriers">
              <a> here </a>
            </Link>
            or
            <Link href="/contact">
              <a>  contact us </a>
            </Link>
            for an account.</p>
          <p>If you are already a user, login
            <Link href="/login">
              <a> here.</a>
            </Link>
          </p>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-2">
          </div>
          <div className="col-lg-8">
            <div className={SignupStyle.form}>
              <ToastContainer />
              <h2 className="text-center my-5">{t("CREATE_NEW_ACCOUNT")}</h2>
              <form onSubmit={form.handleSubmit}>
                <Row>
                  <BaseSelect
                    className="col-12 mt-1"
                    label="ROLE"
                    name="role"
                    required
                    placeholder
                    formik={form}
                    labelPrefix="SignUpRole"
                    enumType={SignUpRole}
                  />
                  {
                    form.values.role === SignUpRole.COMPANY &&
                    <BaseInput
                      className="col-12 mt-1"
                      label="COMPANY_NAME"
                      required
                      name="name"
                      placeholder
                      formik={form}
                    />
                  }
                  <BaseInput
                    className="col-6 mt-1"
                    label="FIRST_NAME"
                    required
                    name="first_name"
                    placeholder
                    formik={form}
                  />
                  <BaseInput
                    className="col-6 mt-1"
                    label="LAST_NAME"
                    required
                    name="last_name"
                    placeholder
                    formik={form}
                  />
                  <BaseInput
                    className="col-12 mt-1"
                    label="EMAIL"
                    required
                    name="email"
                    placeholder
                    formik={form}
                  />

                  <BaseInputPhone
                    className="col-12 mt-1"
                    label="PHONE"
                    name="phone"
                    placeholder
                    formik={form}
                  />

                  <BaseInput
                    className="col-6 mt-1"
                    label="PASSWORD"
                    required
                    type="password"
                    name="password"
                    placeholder
                    formik={form}
                  />
                  <BaseInput
                    className="col-6 mt-1"
                    label="CONFIRM_PASSWORD"
                    required
                    type="password"
                    name="confirmPassword"
                    placeholder
                    formik={form}
                  />
                  {
                    form.values.role === SignUpRole.COMPANY &&
                    <BaseInput
                      className="col-12 mt-1"
                      label="INVITE_CODE"
                      required
                      name="invite_code"
                      placeholder
                      formik={form}
                    />
                  }
                  <BaseCheck
                    className="col-12 mt-2"
                    label="YOU_ACCEPT_OUR_TOS"
                    name="accept_tos"
                    formik={form}
                  />
                </Row>
                <button disabled={form.isSubmitting}
                  type="submit"
                  className='btn btn-dark w-100 d-block p-3 mt-5 mb-4'>
                  {t("REGISTER_NOW")}
                </button>
              </form>
              <div className="my-5">
                <div className={SignupStyle.lineheader}>
                  <span>{t("OR")}</span>
                </div>
                <button
                  type="button"
                  className='btn btn-dark w-100 d-block p-3 my-3'
                  onClick={goToLogin}
                  >
                  {t("IF_YOURE_ALREADY_A_USER_LOGIN_HERE")}
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-2">
          </div>

        </div>
      </div>
    </>
  )
}

Signup.getLayout = function getLayout(page) {
  return (
    <PublicLayout>
      {page}
    </PublicLayout>
  )
}