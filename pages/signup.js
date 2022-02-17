import Head from "next/head";
import Layout from "../components/layouts";
import SignupStyle from "../public/css/signup.module.css";
export default function Signup()
{
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
                    <p>Are you a motor carrier? View our pricing <a href="#"> here</a> or <a href="#">contact us</a> for an account.</p>
                    <p>If you are already a user, login​<a href="#"> here.</a></p>
                </div>
            </div>
            <div className="container">
                <div class="row">
                    <div class="col-lg-2">
                    </div>
                    <div class="col-lg-8">
                    <div className={SignupStyle.form}>
                        <h2 className="text-center my-5">Create New Driver Account</h2>
                        <form className="my-5">
                           <div class="form-group">
                                <input type="ematextil" class="form-control" id="exampleInputUsername" aria-describedby="emailHelp" placeholder="User Name" />
                            </div>
                            <div class="form-group">
                                <input type="email" class="form-control" id="exampleInputUsername" aria-describedby="emailHelp" placeholder="Email" />
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Confirm Password" />
                            </div>
                            <div class="form-group">
                                <input type="tel" class="form-control" id="exampleInputPhone" placeholder="Phone" />
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