import {useRouter} from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { useState } from 'react'
import Layout from "../../components/layouts"
import login from '../../public/css/Login.module.css'

export default function Login () {
  const router = useRouter()
  const [formData, setFormData] = useState( {
    email: '',
    password: ''
  } )

  let [formErrors, setErrors] = useState()

  const submit = async ( e ) => {
    e.preventDefault()
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let errors = {}
    if ( !formData.email ) {
      errors.email = "Email is required"
    }
    if ( !emailRegex.test( formData.email ) ) {
      errors.email = "Invalid email address"
    }
    if ( !formData.password ) {
      errors.password = "Password is required"
    }
    setErrors( errors )
    if ( Object.keys( errors ).length == 0 ) {
      const resp = await axios.post( 'http://localhost:4000/api/auth/login', formData )
      // login successful, redirect to home page
      if (resp.status === 201) {
        router.push("/")
      }
    }

  }
  return (
    <>
      <div className="top-links-sec">
        <div className="container">
          <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>Login</h2>
            <ul className="d-flex">
              <li><a href="index.html" className="nav-link text-dark px-0">Home <i className="fa fa-caret-right px-2" aria-hidden="true"></i></a></li>
              <li><a href="#" className="nav-link text-dark px-0">Login</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mb-5 p-lg-2 p-0">
        <p className=" mt-5 text-secondary  p-lg-0 p-2">Don't have an account? Make one<a className={login.link} href="#"> here!</a></p>
        <h2 className='text-center mt-5'>Quick Login</h2>
        <p className="mt-3  text-center">Login Your Account</p>
      </div>
      <div className="container">
        <div className='row'>
          <div className='col-lg-2'></div>
          <div className='col-lg-8'>
            <form className={login.loginform}>
              <div className="form-group">
                <input type="email" onChange={e => setFormData( { ...formData, email: e.target.value } )} className="form-control" placeholder="Enter email" id="email" />
                <p style={{ fontStyle: "italic", color: "red" }}>{formErrors?.email}</p>
              </div>
              <div className="form-group">
                <input onChange={e => setFormData( { ...formData, password: e.target.value } )} type="password" className="form-control" placeholder="Enter password" id="pwd" />
                <p style={{ fontStyle: "italic", color: "red" }}>{formErrors?.password}</p>
              </div>
              <div className="form-group form-check">
                <label className="form-check-label w-75">
                  <input className="form-check-input" type="checkbox" /> Keep me signed in
                </label>
                <Link href="/forgot-password">
                  <a className={login.pricol}>Lost Your Password?</a>
                </Link>
                {/* <a href='#' className={login.pricol}>Lost Your Password?</a> */}
              </div>
              <button type="submit" onClick={submit} className={login.submit}>Login</button>
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
Login.getLayout = function getLayout ( page ) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}