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