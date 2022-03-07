import Link from "next/link";
import useAuth from '../hooks/useAuth';
import LoginButton from '../components/buttons/Login';
import SignupButton from '../components/buttons/Signup';
import LogoutButton from '../components/buttons/Logout';

export default function Header() {
    const { authCheck } = useAuth();

    return (
        <>
            <header>
                <div className="header-sec">
                    <div className="container-fluid">
                        <nav className="navbar navbar-expand-lg navbar p-0">
                            <div className="logo">
                                <img src="/img/DriverFly-Official-Favicon.png" className="logo" />
                            </div>
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
                                            <li><a className="dropdown-item" href="#"> Get Your CDL </a></li>
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
                                            <li><a className="dropdown-item" >Over Solution </a></li>
                                            <Link href="/pricing">
                                                <a className="dropdown-item">Option & Pricing </a>
                                            </Link>
                                            <li><a className="dropdown-item" href="#"> Request A Quote </a></li>
                                            <li><a className="dropdown-item" href="#"> Free Digital Application </a>
                                            </li>
                                            <li>
                                                <Link href="/third-party-resources">
                                                    <a className="dropdown-item" href="#"> Third Party Resources </a>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/resources">
                                                    <a className="dropdown-item" href="#"> Trucking Industry Resources </a>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>

                                </ul>
                                <ul className="d-flex align-items-center mb-0">
                                    <li><a href="#" className="nav-link"> <i className="fa fa-bell-o pt-1"
                                        aria-hidden="true"></i></a></li>
                                    {authCheck() ? <LogoutButton /> : <><LoginButton /> <SignupButton /></>}
                                </ul>
                            </div>
                        </nav>

                    </div>
                </div>
            </header>
        </>
    )
}
