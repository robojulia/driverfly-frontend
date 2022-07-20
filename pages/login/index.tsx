import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router'

import { useState } from 'react';
import { PublicLayout } from "../../components/layouts/PublicLayout";
import style from '../../public/css/Login.module.css'
import Link from 'next/link';
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AuthApi from "../api/auth";

import { useTranslation } from "../../hooks/useTranslation";
import BaseInput from '../../components/forms/BaseInput';
import { useFormik } from "formik";
import * as yup from "yup";
import { globalAjaxExceptionHandler } from '../../utils/ajax';


export default function Login() {

    const router = useRouter();

    const { t } = useTranslation();

    const { login } = useAuth();

    // if (isDriver()) {
    //     Router.push('/dashboard/driver')
    // }

    // if (isCompany()) {
    //     Router.push('/dashboard/company')
    // }

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

            try {
                const user = await authApi.login({
                    email: values.email,
                    password: values.password,
                });

                toast.success(t('LOGIN_SUCCESSFULL'));
                login(user);
            } catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, t: t, defaultMessage: "INVALID_CREDENTIALS", toast: toast});
            }
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
                        <a className={style.link}>{t("HERE")}</a>
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
                            className={style.loginform}>
                            <BaseInput
                                className="form-group"
                                label={t("EMAIL")}
                                required
                                name="email"
                                placeholder={t("EMAIL")}
                                formik={form}
                            />
                            <BaseInput
                                className="form-group"
                                label={t("PASSWORD")}
                                required
                                type="password"
                                name="password"
                                placeholder={t("PASSWORD")}
                                formik={form}
                            />

                            <div className="form-group form-check">
                                <label className="form-check-label w-50">
                                    <input className="form-check-input keep_sign_in_check" type="checkbox" /> {t("KEEP_ME_SIGNED_IN")}
                                </label>
                                <Link href="/forgot-password">
                                    <a className={style.pricol}>{t("LOST_YOUR_PASSWORD")}</a>
                                </Link>
                            </div>
                            <button type="submit" className={style.submit}>{t("LOGIN")}</button>
                        </form>

                        <div className={style.lineheader}>
                            <span>{t("OR")}</span>
                        </div>

                        <div className={style.back_to_signup}>
                            <Link href="/signup">
                                <a className={style.facebook}>{t("CREATE_AN_ACCOUNT")}</a>
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
        <PublicLayout title="Login">
            {page}
        </PublicLayout>
    )
}
