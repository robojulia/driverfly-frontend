import useAuth from '../../hooks/useAuth';
import Router from 'next/router'
import axios from 'axios';
import { useRouter } from 'next/router'

import { useState } from 'react';
import Layout from "../../components/layouts";
import login from '../../public/css/Login.module.css'
import Link from 'next/link';
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AuthApi from "../api/auth";

import { useTranslation } from "../../hooks/useTranslation";
import BaseInput from '../../components/forms/BaseInput';
import { useFormik } from "formik";
import * as yup from "yup";


export default function Login() {

    const router = useRouter();

    const { t } = useTranslation();

    const { authCheck, isDriver, isCompany, setAuth } = useAuth();

    if (isDriver()) {
        Router.push('/dashboard/driver')
    }

    if (isCompany()) {
        Router.push('/dashboard/company')
    }

    const authApi = new AuthApi();

    const form = useFormik({
        initialValues: {
            email: null,
            password: null,
        },
        validationSchema: yup.object({
            email: yup.string().email().required().nullable(),
            password: yup.string().required().nullable(),
        }),
        onSubmit: async (values) => {

            await authApi.login({
                email: values.email,
                password: values.password,
            })
                .then(data => {

                    // console.log("handle success", data);
                    if (data.status == 201) {
                        toast.success(t('LOGIN_SUCCESSFULL'), {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });

                        // data.data.user.language = "es-mx";
                        setAuth(data.data.user)

                        if (isDriver()) {
                            Router.push('/dashboard/driver');//, undefined, { locale: data.data.user.language })
                        }

                        if (isCompany()) {
                            Router.push('/dashboard/company');//, undefined, { locale: data.data.user.language })
                        }

                        // Router.push('/')
                    } else {
                        toast.warning(t("ERROR_MESSAGE_DEFAULT"), {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }
                })
                .catch(function (error) {
                    // handle error

                    if (error?.response?.data?.user) {
                        toast.warning(t(error.response.data.user), {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    } else {
                        toast.warning(t("INVALID_CREDENTIALS"), {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }

                })
                .then(function () {
                    // always executed
                    console.log("always executed");
                });

        }
    })


    return (
        <>
            <ToastContainer />
            <div className="top-links-sec">
                <div className="container">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>{t("LOGIN")}</h2>
                        <Breadcrumb />
                    </div>
                </div>
            </div>
            <div className="container mb-5 p-lg-2 p-0">
                <p className=" mt-5 text-secondary  p-lg-0 p-2">{t("DON'T_HAVE_AN_ACCOUNT_MAKE_ONE")}
                    <Link href="/signup">
                        <a className={login.link}>{t("HERE")}</a>
                    </Link>
                </p>
                <h2 className='text-center mt-5'>{t("QUICK_LOGIN")}</h2>
                <p className="mt-3  text-center">{t("LOGIN_YOUR_ACCOUNT")}</p>
            </div>
            <div className="container">
                <div className='row'>
                    <div className='col-lg-2'></div>
                    <div className='col-lg-8'>
                        <form
                            onSubmit={form.handleSubmit}
                            className={login.loginform}>
                            <BaseInput
                                className="form-group"
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
                                className="form-group"
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

                            <div className="form-group form-check">
                                <label className="form-check-label w-50">
                                    <input className="form-check-input keep_sign_in_check" type="checkbox" /> {t("KEEP_ME_SIGNED_IN")}
                                </label>
                                <Link href="/forgot-password">
                                    <a className={login.pricol}>{t("LOST_YOUR_PASSWORD")}</a>
                                </Link>
                            </div>
                            <button type="submit" className={login.submit}>{t("LOGIN")}</button>
                        </form>

                        <div className={login.lineheader}>
                            <span>{t("OR")}</span>
                        </div>

                        <div className={login.back_to_signup}>
                            <Link href="/signup">
                                <a className={login.facebook}>{t("CREATE_AN_ACCOUNT")}</a>
                            </Link>

                        </div>
                    </div>
                    <div className='col-lg-2'></div>
                </div>
            </div>
        </>

    )
}
Login.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
