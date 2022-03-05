import axios from 'axios'
import Head from "next/head"
import Link from "next/link"
import Breadcrumbs from "nextjs-breadcrumbs"
import { useState } from 'react'
import Layout from "../components/layouts"
import SignupStyle from "../public/css/signup.module.css"

export default function Signup () {
  const [color, setColor] = useState( 'red' )

  const [inputValues, setInputValue] = useState( {
    firstName: null,
    lastName: null,
    name: null,
    email: null,
    password: null,
    confirmPassword: null,
    phone: null
  } )

  const [serverValidation, setServerValidation] = useState( [] )

  const [validation, setValidation] = useState()


  const handleChange = ( event ) => {
    const { name, value } = event.target
    setInputValue( ( preValue ) => {
      return {
        ...preValue,
        [name]: value,
      }
    } )
  }


  // const signUpHandler = async (e) => {
  //     e.preventDefault();
  //     //console.log(firstName, lastName, email, password, confirmPassword, phone);

  //     await axios.post('http://localhost:4000/users', inputValues)
  //         .then(data => {
  //             console.log("handle success", data);
  //         })
  //         .catch(function (error) {
  //             console.log('error', error.response)
  //         });

  // }


  const signUpHandler = async () => {
    let errors = {}

    //first Name validation
    // if (!inputValues.firstName) {
    //   errors.firstName = "First name is required";
    // }
    //last Name validation
    // if (!inputValues.lastName) {
    //   errors.lastName = "Last name is required";
    // }

    if ( !inputValues.name ) {
      errors.name = "Name is required"
    }

    //email validation
    if ( !inputValues.email ) {
      errors.email = "Email is required"
    }

    //password validation

    if ( !inputValues.password ) {
      errors.password = "password is required"
    }

    //matchPassword validation


    if ( !inputValues.confirmPassword ) {
      errors.confirmPassword = "Password confirmation is required"
    } else if ( inputValues.confirmPassword !== inputValues.password ) {
      errors.confirmPassword = "Password does not match confirmation password"
    }


    if ( !inputValues.phone ) {
      errors.phone = "Phone number is required"
    }

    setValidation( errors )

    // Call API of signup
    if ( Object.keys( errors ).length == 0 ) {
      console.log( 'you can proceed with the API' )

      await axios.post( 'http://localhost:4000/api/users', inputValues )
        .then( data => {
          console.log( "handle success", data )

        } )
        .catch( function ( error ) {
          console.log( "handle error success" )
          if ( error.response ) {
            if ( error.response.data.message ) {
              setServerValidation( error.response.data.message )
            } else if ( error.response.data.errors ) {
              setColor( "red" )
              console.log( 'here' )
              console.log( error.response.data.errors.user )
              if ( error.response.data.errors.user ) {
                setServerValidation( error.response.data.errors.user )
              } else {
                setServerValidation( error.response.data.errors.username )
              }

            } else if ( error.response.data.err ) {
              setColor( "green" )
              setServerValidation( 'User registered successfully' )
            }

          }
        } ).then( function () {
          console.log( "always executed" )
        } )
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
          <p>Are you a motor carrier? View our pricing
            <Link href="/pricing">
              <a> here</a>
            </Link>
            or
            <Link href="/contact">
              <a> contact us</a>
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
              <h2 className="text-center my-5">Create New Driver Account</h2>
              <div className="my-5">
                {/* <div class="form-group">
                                <input type="text" class="form-control" onChange={(e) => handleChange(e)} name="firstName" value={inputValues.firstName} aria-describedby="emailHelp" placeholder="First Name" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.firstName}</p>
                            </div>
                            <div class="form-group">
                                <input type="text" class="form-control" onChange={(e) => handleChange(e)} name="lastName" value={inputValues.lastName} aria-describedby="emailHelp" placeholder="Last Name" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.lastName}</p>
                            </div> */}

                <div className="form-group">
                  <input type="text" className="form-control" onChange={( e ) => handleChange( e )} name="name" value={inputValues.name} aria-describedby="emailHelp" placeholder="Name" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.name}</p>
                </div>
                <div className="form-group">
                  <input type="email" className="form-control" onChange={( e ) => handleChange( e )} name="email" id="exampleInputUsername" value={inputValues.email} aria-describedby="emailHelp" placeholder="Email" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.email}</p>
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" onChange={( e ) => handleChange( e )} name="password" id="exampleInputPassword1" value={inputValues.password} placeholder="Password" required />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.password}</p>
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" onChange={( e ) => handleChange( e )} name="confirmPassword" id="exampleInputPassword1" value={inputValues.confirmPassword} placeholder="Confirm Password" required />
                  <p style={{ fontStyle: "italic", color: "red" }}>
                    {validation?.confirmPassword
                      ? validation?.confirmPassword
                      : validation?.confirmPassword}
                  </p>
                </div>
                <div className="form-group">
                  <input type="tel" className="form-control" onChange={( e ) => handleChange( e )} name="phone" id="exampleInputPhone" placeholder="Phone" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.phone}</p>

                </div>
                <div className="form-group form-check">
                  <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                  <label className="form-check-label" htmlFor="exampleCheck1">You accept our <a href="" className={SignupStyle.link}>Terms and Conditions and Privacy Policy</a></label>
                </div>
                {console.log( serverValidation )}
                {console.log( 'serverValidation' )}
                {serverValidation instanceof Array ? serverValidation.map( ( inValid ) => {
                  return (
                    <p style={{ fontStyle: "italic", color: "red" }}>{inValid}</p>
                  )

                } ) : <p style={{ fontStyle: "italic", color: color }}>{serverValidation}</p>}
                <button type="submit" className='btn btn-dark w-100 d-block p-3 my-5' onClick={signUpHandler}>Register now</button>
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

Signup.getLayout = function getLayout ( page ) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}