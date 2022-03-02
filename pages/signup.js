import Head from "next/head";
import Link from "next/link";
import Breadcrumbs from "nextjs-breadcrumbs";
import Layout from "../components/layouts";
import SignupStyle from "../public/css/signup.module.css";
export default function Signup()
{
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
                    <p>If you are already a user, login​
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
                        <form className="my-5">
                           <div className="form-group">
                                <input type="ematextil" className="form-control py-4" id="exampleInputUsername" aria-describedby="emailHelp" placeholder="User Name" />
                            </div>
                            <div className="form-group">
                                <input type="email" className="form-control py-4" id="exampleInputUsername" aria-describedby="emailHelp" placeholder="Email" />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control py-4" id="exampleInputPassword1" placeholder="Password" />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control py-4" id="exampleInputPassword1" placeholder="Confirm Password" />
                            </div>
                            <div className="form-group">
                                <input type="tel" className="form-control py-4" id="exampleInputPhone" placeholder="Phone" />
                            </div>
                            <div className="form-group form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                                <label className="form-check-label" for="exampleCheck1">You accept our <a href="" className={SignupStyle.link}>Terms and Conditions and Privacy Policy</a></label>
                            </div>
                            <button type="submit" className="btn btn-dark w-100 d-block p-3 my-5">Register now</button>
                        </form>
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