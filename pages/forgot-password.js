import axios from "axios"
import Link from 'next/link'
import Breadcrumbs from 'nextjs-breadcrumbs'
import { useState } from "react"
import Back from '../components/back-to-login/Back-Login'
import Layout from "../components/layouts"
import Forgotpassword from '../public/css/Forgot.module.css'
import ResetPasswordAPI from "./api/reset-account"
import { ToastContainer, toast } from 'react-toastify'

export default function Forgot() {

  const resetPasswordAPI = new ResetPasswordAPI();
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: '',
  });

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!formData.email) {
      setError("Username or email is required")
      toast.error("Username or email is required", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return
    }

    // validate email
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }


    // clear error
    if (error) {
      setError("")
    }
    await resetPasswordAPI.forgetPassword(formData)
      .then(res => {
        if (res?.status == 201) {
          toast.success("Please check your email", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

        }
      }).catch(error => {
        if (error?.response?.status == 422) {
          setError("Password Reset Email Already Sent, Please check your email ")
          toast.error("Password Reset Email Already Sent, Please check your email", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

        } else {
          setError("Something went wrong")
          toast.error("Something went wrong", {
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
  }

  return (
    <>
      

      <div className="top-links-sec">
        <div className="container">
          <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>Forgot Password</h2>
            < Breadcrumbs />
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
              <h4 className='text-center mt-5 font-weight-normal'>Reset Password</h4>
              <p className="mt-2 mb-5 text-center  text-secondary ">Please Enter Username or Email</p>
              <form onSubmit={submitHandler} className={Forgotpassword.mb}>
                <div className="form-group">
                  <input
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    type="text" className="form-control py-4" placeholder="Username or E-mail" id="useremail" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{error}</p>
                </div>


                <button type="submit" className={Forgotpassword.success_btn}>Get New Password</button>
                <Link href="/login">
                  <button className={Forgotpassword.danger_btn}>
                    Cancel </button>
                </Link>
                <Link href="/login">
                  <div><a href="" className={Forgotpassword.backlink}>Back To Login</a></div>
                </Link>
              </form>

            </div>
            <div className='col-lg-2'></div>
          </div>
        </div>
      </div>


    </>
  )
}
Forgot.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}