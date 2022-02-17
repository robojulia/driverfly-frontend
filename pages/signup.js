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
                <div className={SignupStyle.form}>
                    <h2 className="text-center">Create New Driver Account</h2>
                    <form>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Email address</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
                        </div>
                        <div class="form-group form-check">
                            <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
                            <label class="form-check-label" for="exampleCheck1">Check me out</label>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
</form>
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