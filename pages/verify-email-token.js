import axios from "axios"
import { useRouter } from 'next/router'
import Link from 'next/link'
// import Breadcrumbs from 'nextjs-breadcrumbs'
import { useEffect, useState } from "react"
import Back from '../components/back-to-login/Back-Login'
import Layout from "../components/layouts"
import Forgotpassword from '../public/css/Forgot.module.css'
import SignupAPI from "./api/signup"
import { ToastContainer, toast } from 'react-toastify'
import { useTranslation } from "../hooks/useTranslation"

export default function VerifyEmailToken(props) {
  console.log("props", props);
  const { t } = useTranslation()

  return (
    <>
      <div className="top-links-sec">
        <div className="container">
          <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>{t('VERIFYING_EMAIL_TOKEN')}</h2>
          </div>
        </div>
      </div>
      <div className={Forgotpassword.formsec}>
        <div className="container py-5 my-5">
          <div className='row'>
            <div className='col-lg-2'></div>
            <div className='col-lg-8'>

              <h4 className='text-center mt-5 font-weight-normal'>
                {props.response.message}
              </h4>
              <p className="mt-2 mb-5 text-center  text-secondary "></p>

            </div>
            <div className='col-lg-2'></div>
          </div>
        </div>
      </div>


    </>
  )
}
export async function getServerSideProps({ query }) {
  const { emailVerifyToken } = query

  const signupAPI = new SignupAPI();
  let response = {
    verified: false,
    message: "Something went wrong"
  }

  await signupAPI.verifyEmailToken({ emailVerifyToken })
    .then(res => {
      if (res?.status == 200) {
        response.verified = true
        response.message = "Account activated Successfully! please proceed to login."
      }
    }).catch(error => {
      response.message = (error?.response?.status == 422 || error?.response?.data?.errors?.User) ? `${error?.response?.data?.errors?.User}` : "Something went wrong"
    })

  return { props: { response } }
}

VerifyEmailToken.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}