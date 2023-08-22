import { useRouter } from 'next/router'
import Link from 'next/link'
import Breadcrumb from "../components/breadcrumbs/breadcrumb";
import { PublicLayout } from "../components/layouts/public-layout";
import Forgotpassword from '../public/css/forgot.module.css'
import ResetPasswordAPI from "./api/reset-account"
import { ToastContainer, toast } from 'react-toastify'

import { useTranslation } from "../hooks/use-translation";
import BaseInput from '../components/forms/base-input';
import { useFormik } from "formik";
import * as yup from "yup";
import { Col, Container, Row } from "react-bootstrap";
import Head from 'next/head';
export default function ResetPassword({ passwordResetToken }) {

  const router = useRouter();
  const { t } = useTranslation();
  const resetPasswordAPI = new ResetPasswordAPI();

  const translations = {
    passwordsDoNotMatch: t("PASSWORDS_DO_NOT_MATCH")
  };

  const form = useFormik({
    initialValues: {
      password: null,
      passwordConfirm: null,
      passwordResetToken: passwordResetToken,
    },
    validationSchema: yup.object({
      passwordResetToken: yup.string().required().nullable(),
      password: yup.string().required().nullable(),
      passwordConfirm: yup.string().test({
        test: (value, context) => {
          const password = context.resolve(yup.ref("password"));
          if (value === password) return true;

          return context.createError({
            path: context.path,
            message: translations.passwordsDoNotMatch
          });
        }
      }).nullable(),
    }),
    onSubmit: async (dto) => {
      await resetPasswordAPI.newPassword(dto)
        .then(res => {
          if (res.status == 200) {
            toast.success(t("SUCCESS_RESET_PASSWORD"));
            setTimeout(() => {
              router.push("/login")
            }, 3000);
          }
        })
        .catch(error => {
          if (error?.response?.status == 422) {
            toast.error(t('INVALID_RESET_PASSWORD_TOKEN'))
          } else {
            toast.error(t('FAILED_RESET_PASSWORD'))
          }
        })
    }
  })

  return (
    <>
    <Head>
        <title>Reset Password - Regain Access to Your DriverFly Account </title>
        <meta
          name="description"
          content="Regain access to your DriverFly account by resetting your password. Ensure a secure and seamless experience in the trucking industry."
          key="desc"
        />
        </Head>
      <ToastContainer />
      <div className="top-links-sec">
        <Container>
          <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>{t('RESET_PASSWORD')}</h2>
            < Breadcrumb />
          </div>
        </Container>
      </div>
      <div className={Forgotpassword.formsec}>
        <Container>
          <Row>
            <Col xs={{ span: 8, offset: 2 }}>
              <h4 className='text-center mt-5 font-weight-normal'>{t('RESET_PASSWORD')}</h4>
              <p className="mt-2 mb-5 text-center  text-secondary ">{t('ENTER_NEW_PASSWORD')}</p>
              <form
                onSubmit={form.handleSubmit}
                className={Forgotpassword.mb}>
                <div className="form-group">
                  <BaseInput
                    required
                    type="password"
                    name="password"
                    placeholder="PASSWORD"
                    formik={form}
                  />
                </div>
                <div className="form-group">
                  <BaseInput
                    required
                    type="password"
                    name="passwordConfirm"
                    placeholder="CONFIRM_PASSWORD"
                    formik={form}
                  />
                </div>
                <button disabled={form.isSubmitting}
                  type="submit"
                  className={Forgotpassword.success_btn}>
                  {t("UPDATE_PASSWORD")}
                </button>
                <Link href="/login">
                  <button
                    className={Forgotpassword.danger_btn}>
                    {t('CANCEL')}
                  </button>
                </Link>
                <Link href="/login">
                  <span
                    role="button"
                    className={Forgotpassword.backlink}>
                    {t('BACK_TO_LOGIN')}
                  </span>
                </Link>
              </form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  if (!!!context.query.passwordResetToken) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      ...context.query
    }
  }
}

ResetPassword.getLayout = function getLayout(page) {
  return (
    <PublicLayout title="RESET_PASSWORD">
      {page}
    </PublicLayout>
  )
}