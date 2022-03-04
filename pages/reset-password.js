import Link from 'next/link';
import Breadcrumbs from 'nextjs-breadcrumbs';
import Back from '../components/back-to-login/Back-Login';
import Layout from "../components/layouts";
import Forgotpassword from '../public/css/Forgot.module.css'

export default function Forgot() {
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
                            <form action="/action_page.php" className={Forgotpassword.mb}>
                                <div className="form-group">
                                    <input type="password" className="form-control py-4" placeholder="Password" id="password" />
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control py-4" placeholder="Confirmed Password" id="password" />
                                </div>


                                <button type="submit" className={Forgotpassword.success_btn}>Get New Password</button>
                                <Link href="/login">
                                    <button type="submit" className={Forgotpassword.danger_btn}>
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
Forgot.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}