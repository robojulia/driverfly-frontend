import Link from "next/link";
import useAuth from '../../hooks/useAuth';
import LoginButton from '../../components/buttons/Login';
import SignupButton from '../../components/buttons/Signup';
import LogoutButton from '../../components/buttons/Logout';
import DashboardButton from "../buttons/DashboardButton";
import { useTranslation } from "../../hooks/useTranslation";

export default function Nav() {
    const { authCheck } = useAuth();
    const { t } = useTranslation();
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
                            <a className="nav-link active">{t("HOME")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/about">
                            <a className="nav-link">{t("ABOUT_US")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/find-jobs">
                            <a className="nav-link">{t("FIND_A_Job")}</a>
                        </Link>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link  dropdown-toggle" href="#"
                            data-bs-toggle="dropdown"> {t("DRIVER_RESOURCES")}</a>
                        <ul className="dropdown-menu">
                            <li>
                                <Link href="/faq">
                                    <a className="dropdown-item">{t("FAQ")}</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/">
                                    <a className="dropdown-item" href="#">{t("GET_YOUR_CDL")} </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/owner-operators">
                                    <a className="dropdown-item"> {t("OWNER_OPERATORS")} </a>
                                </Link>

                            </li>

                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        {/* <a className="nav-link  dropdown-toggle" href="http://go.driverfly.co/motor-carriers"
                            data-bs-toggle="">{t("MOTOR_CARRIER_SOLUTIONS")} </a> */}
                        <a className="nav-link  dropdown-toggle" href="#"
                            data-bs-toggle="dropdown">{t("MOTOR_CARRIER_SOLUTIONS")}</a>

                        <ul className="dropdown-menu">
                            <li>
                                <Link href="http://go.driverfly.co/">
                                    <a className="dropdown-item">{t("OUR_SOLUTION")}  </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="http://go.driverfly.co/motor-carriers">
                                    <a className="dropdown-item">{t("OPTIOS_&_PRICING")} </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="http://go.driverfly.co/sign-up">
                                    <a className="dropdown-item">{t("REQUESR_AQUOTE")} </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="https://digitalhiringapp.com/">
                                    <a className="dropdown-item">{t("FREE_DIGITAL_APPLICATION")} </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/third-party-resources">
                                    <a className="dropdown-item" href="#"> {t("THIRD_PARTY_RESOURCES")} </a>
                                </Link>
                            </li>
                        </ul>
                    </li>

                </ul>
                <ul className="d-flex align-items-center mb-0">
                    <li><a href="#" className="nav-link"> <i className="fa fa-bell-o pt-1"
                        aria-hidden="true"></i></a></li>
                    {authCheck() ?
                        <>
                            <DashboardButton className="btn btn-primary mr-4" />
                            <LogoutButton className="btn btn-primary mr-4" />
                        </>
                        :
                        <>
                            <LoginButton className="btn btn-primary mr-4" />
                            <SignupButton className="btn btn-primary mr-4" />
                        </>}
                </ul>
            </div>
        </>
    )
}