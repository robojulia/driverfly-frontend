import useAuth from '../../hooks/useAuth';
import Router from 'next/router'
import axios from 'axios';
import { withRouter } from 'next/router'

import { useState } from 'react';
import Layout from "../../components/layouts";
import login from '../../public/css/Login.module.css'
import Link from 'next/link';
import Breadcrumbs from 'nextjs-breadcrumbs';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AuthApi from "../api/auth";

import { useTranslation } from "react-i18next";
import i18next from "i18next";


export default function Login() {

    const { authCheck, isDriver, isCompany, setAuth } = useAuth();

    if (isDriver()) {
        Router.push('/dashboard/driver')
    }

    if (isCompany()) {
        Router.push('/dashboard/company')
    }

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [serverValidation, setServerValidation] = useState([]);
    const [validation, setValidation] = useState();

    const validateForm = () => {

        let errors = {};

        if (!formData.email) {
            errors.email = "Email is required";
        }

        if (!formData.password) {
            errors.password = "Password is required";
        }

        setValidation(errors);
        return Object.keys(errors).length == 0;
    }

    const submit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const api = new AuthApi();

            //await axios.post(`${process.env.BASE_URL_API}/auth/login`, formData)
            await api.login(formData)
                .then(data => {

                    // console.log("handle success", data);
                    if (data.status == 201) {
                        console.log("handle success data", data.data);
                        console.log(data.data);
                        i18next.changeLanguage(data.data.user.language);
                        setAuth(data.data.user)

                        if (isDriver()) {
                            Router.push('/dashboard/driver')
                        }

                        if (isCompany()) {
                            Router.push('/dashboard/company')
                        }

                        // Router.push('/')
                    } else {
                        console.log('not 201')
                        setServerValidation("Something went south");
                    }
                })
                .catch(function (error) {
                    // handle error

                    if (error?.response?.data?.errors?.user) {
                        setServerValidation(error.response.data.errors.user);
                    } else {
                        setServerValidation("Invalid Credentials");
                        toast.warning("Invalid Credentials", {
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

    }

    return (
        <>
          <ToastContainer />
            <div className="top-links-sec">
                <div className="container">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>Login</h2>
                        <Breadcrumbs />
                    </div>
                </div>
            </div>
            <div className="container mb-5 p-lg-2 p-0">
                <p className=" mt-5 text-secondary  p-lg-0 p-2">Don't have an account? Make one
                    <Link href="/signup">
                        <a className={login.link}> here!</a>
                    </Link>
                </p>
                <h2 className='text-center mt-5'>Quick Login</h2>
                <p className="mt-3  text-center">Login Your Account</p>
            </div>
            <div className="container">
                <div className='row'>
                    <div className='col-lg-2'></div>
                    <div className='col-lg-8'>
                        <form
                            onSubmit={submit}
                            className={login.loginform}>
                            <div className="form-group">
                                <input type="email"
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="form-control"
                                    placeholder="Username or email" id="email" />
                                <div className="text-danger">{validation?.email}</div>
                            </div>
                            <div className="form-group">
                                <input type="password"
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="form-control" placeholder="Enter password" id="pwd" />
                                <div className="text-danger">{validation?.password}</div>
                            </div>
                            <div className="form-group form-check">
                                <label className="form-check-label w-50">
                                    <input className="form-check-input" type="checkbox" /> Keep me signed in
                                </label>
                                <a href='#' className={login.pricol}>Lost Your Password?</a>
                            </div>
                            {serverValidation instanceof Array ? serverValidation.map((inValid) => {
                                return (
                                    <div className="text-danger">{inValid}</div>
                                )

                            }) : <div className="text-danger">{serverValidation}</div>}
                            <button type="submit" className={login.submit}>Login</button>
                        </form>
                        <div className={login.sociallogin}>
                            <div className={login.lineheader}>
                                <span>or</span>
                            </div>
                            <div className={login.innersocial}>
                                <div className={login.facebooklogin}>
                                    <a className={login.facebook} href="#"><i className="fa fa-facebook"></i> Facebook</a>
                                </div>
                            </div></div>
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