import Link from 'next/link';
import Breadcrumbs from 'nextjs-breadcrumbs';
import Layout from "../components/layouts";
import login from '../public/css/Login.module.css'
import Back from '../components/back-to-login/Back-Login';
export default function Login() {
return (
<>
<div className="top-links-sec">
   <div className="container">
        <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>Login</h2>
            <Breadcrumbs />
        </div>
    </div>
</div>
    <div className="container mb-5 p-lg-2 p-0">
    < Back />
        <h2 className='text-center mt-5'>Quick Login</h2>
        <p className="mt-3  text-center">Login Your Account</p>
    </div>
    <div className="container">
        <div className='row'>
            <div className='col-lg-2'></div>
            <div className='col-lg-8'>
            <form action="/action_page.php" className={login.loginform}>
                <div className="form-group">
                    <input type="email" className="form-control" placeholder="Username or email" id="email" />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" placeholder="Enter password" id="pwd" />
                </div>
                <div className="form-group form-check">
                    <label className="form-check-label w-50">
                    <input className="form-check-input" type="checkbox" /> Keep me signed in
                    </label>
                    
                    <a  className={login.pricol}> <Link href='/forgot-password'>Lost Your Password?</Link></a>
                </div>
                <button type="submit" className={login.submit}>Login</button>
            </form>
            <div className={login.sociallogin}>
                <div className={login.lineheader}>
                    <span>or</span>
                </div>
                    <div className={login.innersocial}>
                       <div className={login.facebooklogin}>
    		               <a className={login.facebook} href="#"><i className="fa fa-facebook"></i> Facebook</a>
                        </div>
    	</div></div>
            </div>
            <div className='col-lg-2'></div>
        </div>
    </div>
</>
)
}
Login.getLayout = function getLayout(page){
return (
<Layout>
   {page}
</Layout>
)
}