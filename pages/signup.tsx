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
import { Row, Col, Button } from "react-bootstrap"

import { globalAjaxExceptionHandler } from "../utils/ajax";
import { SignUpDto } from "../models/auth/sign-up.dto";
import { PublicPage } from "../components/layouts/public/PublicPage";


export default function Signup() {

  const router = useRouter();

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: new SignUpDto(),
    validationSchema: SignUpDto.yupSchema(),
    onSubmit: async (dto) => {
      const api = new AuthApi();

      try {
        await api.signUp(dto);
        toast.success(t("SUCCESSFULLY_REGISTERED"));
        setTimeout(() => router.push('/login'), 3000);
      }
      catch (e) {
        globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t, defaultMessage: "UNABLE_TO_SIGNUP" });
      }
    }
  });

  return (
    <PublicPage
      title="SIGN_UP"
    >
      <Row className={`${SignupStyle.banner}`}>
        <Col>
          <h1>{t("SignUp.DRIVERS_HAVE_ACCESS")}<br />{t("SignUp.TO_OVER_1000_JOBS")}</h1>
          <p>{t("SignUp.ARE_YOU_A_MOTOR_CARRIER")} {t("SignUp.VIEW_OUR_PACKAGES")}
            <Link href="http://go.driverfly.co/motor-carriers">
              <a className="mx-1">{t("HERE")}</a>
            </Link>
            {t("OR")}
            <Link href="/contact">
              <a className="mx-1">{t("SignUp.CONTACT_US")}</a>
            </Link>
            {t("SignUp.FOR_AN_ACCOUNT")}</p>
          <p>{t("SignUp.IF_YOU_ARE_ALREADY_A_USER_LOGIN")}
            <Link href="/login">
              <a className="ml-1">{t("HERE")}</a>
            </Link>.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="text-center">{t("CREATE_NEW_ACCOUNT")}</h2>
        </Col>
      </Row>
      <Row className="justify-content-lg-center">
        <Col lg="8">
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
            </Row>
            <Row className="mt-2">
              <Col className="d-flex">
                <BaseCheck
                  // className="col-12 mt-2"
                  label="YOU_ACCEPT_OUR_TOS"
                  name="accept_tos"
                  formik={form}
                />
                <Link href="/terms-and-policies">
                  <a className="mx-1 primary" >{t("terms_and_condition")}</a>
                </Link>
                <span>{t("AND")}</span>
                <Link href="/privacy-policy">
                  <a className="mx-1 primary">{t("privacy_policy")}</a>
                </Link>
              </Col>

            </Row>
            <div className="d-grid gap-2 my-4">
                <Button disabled={form.isSubmitting} size="lg" type="submit">{t("REGISTER_NOW")}</Button>
                <div className="my-1 w-100 text-center">
                    <span>{t("OR")}</span>
                </div>
                <Link href="/login">
                    <Button size="lg">{t("IF_YOURE_ALREADY_A_USER_LOGIN_HERE")}</Button>
                </Link>
            </div>
          </form>
        </Col>
      </Row>

    </PublicPage>
  )
}

Signup.getLayout = function getLayout(page) {
  return (
    <PublicLayout
      title="SIGN_UP"
    >
      {page}
    </PublicLayout>
  )
}