import axios from "axios"
import { useRouter } from 'next/router'
import Link from 'next/link'
import Breadcrumbs from 'nextjs-breadcrumbs'
import { useState } from "react"
import Back from '../components/back-to-login/Back-Login'
import Layout from "../components/layouts"
import Forgotpassword from '../public/css/Forgot.module.css'

export default function Forgot () {
  const [password, setPassword] = useState( "" )
  const [passwordError, setPasswordError] = useState( "" )
  const [confirmPassword, setConfirmPassword] = useState( "" )
  const [confirmPasswordError, setConfirmPasswordError] = useState( "" )
  const router = useRouter()
  const { passwordResetToken } = router.query

  const submitHandler = async ( e ) => {
    e.preventDefault()

    // validate password
    if ( !password ) {
      setPasswordError( "password is required" )
      return
    }

    if ( !confirmPassword ) {
      setConfirmPasswordError( "password confirmation is required" )
      return
    }

    if ( confirmPassword !== password ) {
      setConfirmPasswordError( "password does not match confirmation password" )
      return
    }

    // clear errors
    if ( passwordError || confirmPasswordError ) {
      setPasswordError( "" )
      setConfirmPasswordError( "" )
    }


    await axios.post( "http://localhost:4000/api/new-password", {
      password,
      passwordConfirm: confirmPassword,
      passwordResetToken
    } )


  }

  return (
    <>


      <div className="top-links-sec">
        <div className="container">
          <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>Reset Password</h2>
            < Breadcrumbs />
          </div>
        </div>
      </div>
      <div className={Forgotpassword.formsec}>
        <div className="container">
          <div className='row'>
            <div className='col-lg-2'></div>
            <div className='col-lg-8'>

              <h4 className='text-center mt-5 font-weight-normal'>Reset Password</h4>
              <p className="mt-2 mb-5 text-center  text-secondary ">Please Enter Your New Password</p>
              <form onSubmit={submitHandler} className={Forgotpassword.mb}>
                <div className="form-group">
                  <input value={password} onChange={( e ) => setPassword( e.target.value )} type="password" className="form-control py-4" placeholder="Password" id="password" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{passwordError}</p>
                </div>
                <div className="form-group">
                  <input value={confirmPassword} onChange={( e ) => setConfirmPassword( e.target.value )} type="password" className="form-control py-4" placeholder="Confirmed Password" id="password" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{confirmPasswordError}</p>
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