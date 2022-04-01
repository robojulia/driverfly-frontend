import Link from "next/link";
import useAuth from '../../hooks/useAuth';
import LoginButton from '../../components/buttons/Login';
import SignupButton from '../../components/buttons/Signup';
import LogoutButton from '../../components/buttons/Logout';

export default function Nav() {
    const { authCheck } = useAuth();

    return (
        <>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                aria-label="Toggle navigation">
                <i className="fa fa-bars" aria-hidden="true"></i>
            </button>
            <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link href="/">
                            <a className="nav-link active">Home</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/about">
                            <a className="nav-link">About Us</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/find-jobs">
                            <a className="nav-link">Find A Job</a>
                        </Link>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link  dropdown-toggle" href="#"
                            data-bs-toggle="dropdown"> Driver Resources</a>
                        <ul className="dropdown-menu">
                            <li>
                                <Link href="/faq">
                                    <a className="dropdown-item">FAQ</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/">
                                    <a className="dropdown-item" href="#"> Get Your CDL </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/owner-operators">
                                    <a className="dropdown-item"> Owner Operators </a>
                                </Link>

                            </li>

                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link  dropdown-toggle" href="#"
                            data-bs-toggle="dropdown"> Motor Carrier Solutions</a>
                        <ul className="dropdown-menu">
                            <li>
                                <Link href="http://go.driverfly.co/">
                                    <a className="dropdown-item">Over Solution  </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing">
                                    <a className="dropdown-item">Option & Pricing </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="http://go.driverfly.co/sign-up">
                                    <a className="dropdown-item">Request A Quote</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="https://digitalhiringapp.com/">
                                    <a className="dropdown-item">Free Digital Application </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/third-party-resources">
                                    <a className="dropdown-item" href="#"> Third Party Resources </a>
                                </Link>
                            </li>
                        </ul>
                    </li>

                </ul>
                <ul className="d-flex align-items-center mb-0">
                    <li><a href="#" className="nav-link"> <i className="fa fa-bell-o pt-1"
                        aria-hidden="true"></i></a></li>
                    {authCheck() ? <LogoutButton className="btn btn-primary mr-4" /> : <><LoginButton className="btn btn-primary mr-4" /> <SignupButton className="btn btn-primary mr-4" /></>}
                </ul>
            </div>
        </>
    )
}