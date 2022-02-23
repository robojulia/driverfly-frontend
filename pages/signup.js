import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layouts";
import SignupStyle from "../public/css/signup.module.css";
import { useState, useEffect } from 'react';

export default function Signup()
{


    const [inputValues, setInputValue] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    const [validation, setValidation] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      
    function handleChange(event) {
        const { name, value } = event.target;
        setInputValue({ ...inputValues, [name]: value });
    }
    
    const signUpHandler = (event) => {
        event.preventDefault();

        // console.log(firstName, lastName, email, password, confirmPassword, phone);
    }


    const checkValidation = () => {
        let errors = validation;
    
        //first Name validation
        if (!inputValues.firstName.trim()) {
          errors.firstName = "First name is required";
        } else {
          errors.firstName = "";
        }
        //last Name validation
        if (!inputValues.lastName.trim()) {
          errors.lastName = "Last name is required";
        } else {
          errors.lastName = "";
        }
    
        // email validation
        if (!inputValues.email.trim()) {
          errors.email = "Email is required";
        } else {
          errors.email = "";
        }
    
        //password validation
        const password = inputValues.password;
        if (!password) {
          errors.password = "password is required";
        }else {
          errors.password = "";
        }
    
        //matchPassword validation

        console.log(inputValues);
        if (!inputValues.confirmPassword) {
          errors.confirmPassword = "Password confirmation is required";
        } else if (inputValues.confirmPassword !== inputValues.password) {
          errors.confirmPassword = "Password does not match confirmation password";
        } else {
          errors.password = "";
          errors.confirmPassword = "";
        }
    
        setValidation(errors);
      };

      useEffect(() => {
        checkValidation();
      }, [inputValues]);

    
    return (
        <>
            <Head>
                <title>Signup - DriverFly</title>
            </Head>

            <div class="top-links-sec">
                <div class="container">
                    <div class="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>Sign Up</h2>
                        <ul class="d-flex">
                            <li><a href="index.html" class="nav-link text-dark px-0">Home <i class="fa fa-caret-right px-2" aria-hidden="true"></i></a></li>
                            <li><a href="#" class="nav-link text-dark px-0">Sign Up</a></li>
                        </ul>
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
                    <p>If you are already a user, login​
                         <Link href="/login">
                            <a> here.</a>
                        </Link> 
                    </p>
                </div>
            </div>
            <div className="container">
                <div class="row">
                    <div class="col-lg-2">
                    </div>
                    <div class="col-lg-8">
                    <div className={SignupStyle.form}>
                        <h2 className="text-center my-5">Create New Driver Account</h2>
                        <form className="my-5" onSubmit={signUpHandler}>
                           <div class="form-group">
                                <input type="ematextil" class="form-control" onChange={(e) => handleChange(e)} name="firstName" value={inputValues.firstName} aria-describedby="emailHelp" placeholder="First Name" />
                                {validation.firstName && <p>{validation.firstName}</p>}
                            </div>
                            <div class="form-group">
                                <input type="ematextil" class="form-control" onChange={(e) => handleChange(e)} name="lastName" value={inputValues.lastName} aria-describedby="emailHelp" placeholder="Last Name" />
                                {validation.lastName && <p>{validation.lastName}</p>}
                            </div>
                            <div class="form-group">
                                <input type="email" class="form-control" onChange={(e) => handleChange(e)} name="email" id="exampleInputUsername" value={inputValues.email} aria-describedby="emailHelp" placeholder="Email" />
                                {validation.email && <p>{validation.email}</p>}
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" onChange={(e) => handleChange(e)} name="password" id="exampleInputPassword1" value={inputValues.password} placeholder="Password" required/>
                                {validation.password && <p>{validation.password}</p>}
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" onChange={(e) => handleChange(e)} name="confirmPassword" id="exampleInputPassword1" value={inputValues.confirmPassword} placeholder="Confirm Password" required />
                            </div>
                            <div class="form-group">
                                <input type="tel" class="form-control" onChange={(e) => handleChange(e)} name="phone" id="exampleInputPhone" placeholder="Phone" />
                               
                            </div>
                            <div class="form-group form-check">
                                <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
                                <label class="form-check-label" for="exampleCheck1">You accept our <a href="" className={SignupStyle.link}>Terms and Conditions and Privacy Policy</a></label>
                            </div>
                            <button type="submit" class="btn btn-dark w-100 d-block p-3 my-5">Register now</button>
                        </form>
                     </div>
                    </div>
                    <div class="col-lg-2">
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