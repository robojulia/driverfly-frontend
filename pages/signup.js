import Head from "next/head"
import Link from "next/link"
import Breadcrumbs from "nextjs-breadcrumbs"
import { useState } from 'react'
import Layout from "../components/layouts"
import SignupStyle from "../public/css/signup.module.css"
import useAuth from '../hooks/useAuth';
import Router from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useFormik } from "formik";
import * as yup from "yup";
import "../utils/yup";

import BaseInput from "../components/forms/BaseInput";
import BaseSelect from "../components/forms/BaseSelect";
import BaseCheck from "../components/forms/BaseCheck";


import AuthApi from "./api/auth";

import { useTranslation } from "../hooks/useTranslation";
import { SignUpRole } from "../enums/auth/sign-up-role.enum"
import { Row } from "reactstrap"


export default function Signup() {

  const { authCheck, setAuth } = useAuth();

  if (authCheck()) {
    Router.push('/dashboard')
  }

  const { t } = useTranslation();

  const translations = {
    required: t("this_field_is_required"),
    passwordsDoNotMatch: t("PASSWORDS_DO_NOT_MATCH")
  };

  const form = useFormik({
    initialValues: {
      first_name: null,
      last_name: null,
      name: null,
      email: null,
      password: null,
      confirmPassword: null,
      phone: null,
      role: null,
      accept_tos: false
    },
    validationSchema: yup.object({
      first_name: yup.string().required(translations.required).nullable(),
      last_name: yup.string().required(translations.required).nullable(),
      name: yup.string().when("role", {
        is: SignUpRole.COMPANY,
        then: yup.string().required(translations.required).nullable()
      }).nullable(),
      email: yup.string().email().required(translations.required).nullable(),
      password: yup.string().required(translations.required).nullable(),
      confirmPassword: yup.string().test({
        test: (value, context) => {
          const password = context.resolve(yup.ref("password"));
          if (value === password) return true;
          
          return context.createError({
            path: context.path,
            message: translations.passwordsDoNotMatch
          });
        }
      }).nullable(),
      phone: yup.string().nullable(),
      role: yup.string().enum(SignUpRole).required(translations.required).nullable(),
      accept_tos: yup.boolean().oneOf([true], translations.required)
    }),
    onSubmit: async (values) => {
      const api = new AuthApi();

      try {
        await api.signUp({
          email: values.email,
          password: values.password,
          name: values.name,
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone,
          role: values.role
        });
        toast.success("Registered successfully! Please Check Your Email", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          Router.push('/login')
        }, 3000);
      }
      catch (e) {
        const { data, status } = e.response;
        switch (status) {
          case 409:
            Object.entries(data).forEach((err) => {
              const [ key, value ] = err;
              console.error(key, value);
              form.setFieldTouched(key, true, false);
              form.setFieldError(key, t(value));
            });
            break;
          default:
            console.error("Unable to sign up user", e);
            toast.error("Unable to create user");
            break;
        }
      }

    }
  });

  return (
    <>
      <Head>
        <title>{t("DRIVERFLY_SIGN_UP")}</title>
      </Head>

      <div className="top-links-sec">
        <div className="container">
          <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>{t("SIGN_UP")}</h2>
            <Breadcrumbs />
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
                    label={t("ROLE")}
                    name="role"
                    required
                    placeholder={t("ROLE")}
                    value={form.values.role}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    touched={form.touched.role}
                    error={form.errors.role}
                    labelPrefix="SignUpRole"
                    enumType={SignUpRole}
                    />
                  {
                    form.values.role === SignUpRole.COMPANY &&
                    <BaseInput
                      className="col-12 mt-1"
                      label={t("COMPANY_NAME")}
                      required
                      name="name"
                      placeholder={t("COMPANY_NAME")}
                      value={form.values.name}
                      touched={form.touched.name}
                      error={form.errors.name}
                      onChange={form.handleChange}
                      handleBlur={form.handleBlur}
                      />
                  }
                  <BaseInput
                    className="col-6 mt-1"
                    label={t("FIRST_NAME")}
                    required
                    name="first_name"
                    placeholder={t("FIRST_NAME")}
                    value={form.values.first_name}
                    touched={form.touched.first_name}
                    error={form.errors.first_name}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
                  <BaseInput
                    className="col-6 mt-1"
                    label={t("LAST_NAME")}
                    required
                    name="last_name"
                    placeholder={t("LAST_NAME")}
                    value={form.values.last_name}
                    touched={form.touched.last_name}
                    error={form.errors.last_name}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
                  <BaseInput
                    className="col-12 mt-1"
                    label={t("EMAIL")}
                    required
                    name="email"
                    placeholder={t("EMAIL")}
                    value={form.values.email}
                    touched={form.touched.email}
                    error={form.errors.email}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
                  <BaseInput
                    className="col-12 mt-1"
                    label={t("PHONE")}
                    name="phone"
                    type="tel"
                    placeholder={t("PHONE")}
                    value={form.values.phone}
                    touched={form.touched.phone}
                    error={form.errors.phone}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
                  <BaseInput
                    className="col-6 mt-1"
                    label={t("PASSWORD")}
                    required
                    type="password"
                    name="password"
                    placeholder={t("PASSWORD")}
                    value={form.values.password}
                    touched={form.touched.password}
                    error={form.errors.password}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
                  <BaseInput
                    className="col-6 mt-1"
                    label={t("CONFIRM_PASSWORD")}
                    required
                    type="password"
                    name="confirmPassword"
                    placeholder={t("CONFIRM_PASSWORD")}
                    value={form.values.confirmPassword}
                    touched={form.touched.confirmPassword}
                    error={form.errors.confirmPassword}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
                  <BaseCheck
                    className="col-12 mt-2"
                    label={t("YOU_ACCEPT_OUR_TOS")}
                    name="accept_tos"
                    checked={form.values.accept_tos}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    touched={form.touched.accept_tos}
                    error={form.errors.accept_tos}
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
                  <span>or</span>
                </div>
                <button
                  type="submit"
                  className='btn btn-dark w-100 d-block p-3 my-3'>
                  <Link href="/login">
                    <a className="text-white">{t("IF_YOURE_ALREADY_A_USER_LOGIN_HERE")}</a>
                  </Link>

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
    <Layout>
      {page}
    </Layout>
  )
}