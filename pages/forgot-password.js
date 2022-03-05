import axios from "axios"
import Link from 'next/link'
import Breadcrumbs from 'nextjs-breadcrumbs'
import { useState } from "react"
import Back from '../components/back-to-login/Back-Login'
import Layout from "../components/layouts"
import Forgotpassword from '../public/css/Forgot.module.css'

export default function Forgot () {

  const [email, setEmail] = useState( "" )
  const [error, setError] = useState( "" )

  const submitHandler = async ( e ) => {
    e.preventDefault()
    if ( !email ) {
      setError( "Username or email is required" )
      return
    }

    // validate email
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if ( !emailRegex.test( email ) ) {
      setError( "Please enter a valid email address" )
      return
    }


    // clear error
    if ( error ) {
      setError( "" )
    }
    await axios.post( "http://localhost:4000/api/forgot-password", {
      email
    } )
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
          <div className='row'>
            <div className='col-lg-2'></div>
            <div className='col-lg-8'>
              < Back />
              <h4 className='text-center mt-5 font-weight-normal'>Reset Password</h4>
              <p className="mt-2 mb-5 text-center  text-secondary ">Please Enter Username or Email</p>
              <form onSubmit={submitHandler} className={Forgotpassword.mb}>
                <div className="form-group">
                  <input value={email} onChange={( e ) => setEmail( e.target.value )} type="text" className="form-control py-4" placeholder="Username or E-mail" id="useremail" />
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
Forgot.getLayout = function getLayout ( page ) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}