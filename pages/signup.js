import axios from 'axios'
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


export default function Signup() {

  const { authCheck, setAuth } = useAuth();

  if (authCheck()) {
    Router.push('/dashboard')
  }

  const [color, setColor] = useState('red')
  const [signupButtonDisabled, setSignupButtonDisabled] = useState(false)

  const [inputValues, setInputValue] = useState({
    first_name: null,
    last_name: null,
    name: null,
    email: null,
    password: null,
    confirmPassword: null,
    phone: null,
    role: null
  })

  const [serverValidation, setServerValidation] = useState([])

  const [validation, setValidation] = useState()


  const handleChange = (event) => {
    const { name, value } = event.target
    setInputValue((preValue) => {
      return {
        ...preValue,
        [name]: value,
      }
    })
  }

  const signUpHandler = async () => {
    let errors = {}
    setServerValidation('')

    // first Name validation
    if (!inputValues.first_name) {
      errors.first_name = "First name is required";
    }
    // last Name validation
    if (!inputValues.last_name) {
      errors.last_name = "Last name is required";
    }

    //email validation
    if (!inputValues.email) {
      errors.email = "Email is required"
    }

    //password validation

    if (!inputValues.password) {
      errors.password = "password is required"
    }

    //matchPassword validation


    if (!inputValues.confirmPassword) {
      errors.confirmPassword = "Password confirmation is required"
    } else if (inputValues.confirmPassword !== inputValues.password) {
      errors.confirmPassword = "Password does not match confirmation password"
      toast.warning("Password does not match confirmation password", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }


    if (!inputValues.phone) {
      errors.phone = "Phone number is required"
    }

    //Role Validation

    if (!inputValues.role) {
      errors.role = "Role is required"
    }

    setValidation(errors)

    // Call API of signup
    if (Object.keys(errors).length == 0) {
      setSignupButtonDisabled(true)
      console.log('you can proceed with the API')

      await axios.post(`${process.env.BASE_URL_API}/users`, inputValues)
        .then(data => {
          console.log("handle success", data)
          if (data.status == 201) {
            setColor("green")
            // setServerValidation('Registered successfully! Please Check Your Email')
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

        })
        .catch(function (error) {
          console.log("handle error success")
          if (error.response) {
            if (error.response.data.message) {
              setServerValidation(error.response.data.message)
             
            } else if (error.response.data.errors) {
              setColor("red")
              console.log('here')
              console.log(error.response.data.errors.user)
              if (error.response.data.errors.user) {
              
                toast.warning("Email must be unique.", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              } else {
                setServerValidation(error.response.data.errors.username)
              }

            } else if (error.response.data.err) {
              setColor("green")
              setServerValidation('User registered successfully')
              toast.success("User registered successfully", {
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

          }
        }).then(function () {
          console.log("always executed")
          setSignupButtonDisabled(false)
        })
    }

  }


  return (
    <>
      <Head>
        <title>Signup - DriverFly</title>
      </Head>
      
      <div className="top-links-sec">
        <div className="container">
          <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>Sign Up</h2>
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
              <h2 className="text-center my-5">Create New Account</h2>
              <div className="my-5">
                <div className="form-group">
                  <input type="text" className="form-control p-4" onChange={(e) => handleChange(e)} name="first_name" value={inputValues.first_name} aria-describedby="emailHelp" placeholder="First Name" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.first_name}</p>
                </div>
                <div className="form-group">
                  <input type="text" className="form-control p-4" onChange={(e) => handleChange(e)} name="last_name" value={inputValues.last_name} aria-describedby="emailHelp" placeholder="Last Name" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.last_name}</p>
                </div>
                <div className="form-group">
                  <input type="email" className="form-control p-4" onChange={(e) => handleChange(e)} name="email" id="exampleInputUsername" value={inputValues.email} aria-describedby="emailHelp" placeholder="Email" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.email}</p>
                </div>
                <div className="form-group">
                  <input type="password" className="form-control p-4" onChange={(e) => handleChange(e)} name="password" id="exampleInputPassword1" value={inputValues.password} placeholder="Password" required />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.password}</p>
                </div>
                <div className="form-group">
                  <input type="password" className="form-control p-4" onChange={(e) => handleChange(e)} name="confirmPassword" id="exampleInputPassword1" value={inputValues.confirmPassword} placeholder="Confirm Password" required />
                  <p style={{ fontStyle: "italic", color: "red" }}>
                    {validation?.confirmPassword
                      ? validation?.confirmPassword
                      : validation?.confirmPassword}
                  </p>
                </div>
                <div className="form-group">
                  <input type="tel" className="form-control p-4" onChange={(e) => handleChange(e)} name="phone" id="exampleInputPhone" placeholder="Phone" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.phone}</p>

                </div>
                <select class="form-select p-3" name="role" aria-label="Default select role" onChange={(e) => handleChange(e)} value={inputValues.role}>
                  <option selected>Select Role</option>
                  <option value="company">Company</option>
                  <option value="driver">Driver</option>
                </select>
                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.role}</p>
                <div className="form-group form-check">
                  <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                  <label className="form-check-label" htmlFor="exampleCheck1">You accept our <a href="" className={SignupStyle.link}>Terms and Conditions and Privacy Policy</a></label>
                </div>
                {console.log(serverValidation)}
                {console.log('serverValidation')}
                {serverValidation instanceof Array ? serverValidation.map((inValid) => {
                  return (
                    <p style={{ fontStyle: "italic", color: "red" }}>{inValid}</p>
                  )

                }) : <p style={{ fontStyle: "italic", color: color }}>{serverValidation}</p>}
                <button disabled={signupButtonDisabled}
                  type="submit"
                  className='btn btn-dark w-100 d-block p-3 my-5'
                  onClick={signUpHandler}>
                  Register now
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