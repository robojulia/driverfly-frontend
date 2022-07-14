import Link from "next/link";
import { useAuth } from '../../hooks/useAuth';
import LoginButton from '../../components/buttons/Login';
import SignupButton from '../../components/buttons/Signup';
import LogoutButton from '../../components/buttons/Logout';
import DashboardButton from "../buttons/DashboardButton";
import { useTranslation } from "../../hooks/useTranslation";
import { Bell, List } from 'react-bootstrap-icons';
import React from "react";
import { Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
export default function MyNav() {
    const { user } = useAuth();
    const { t } = useTranslation();
    return (
        <>
            <Navbar collapseOnSelect expand="lg" variant="dark">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link className="nav-item ml-30">
                            <Link href="/">
                                <div href="/" className="">{t("HOME")}</div >
                            </Link>
                        </Nav.Link>
                        <Nav.Link className="nav-item ml-30">
                            <Link href="/about">
                                <div href="/about" className="">{t("ABOUT_US")}</div >
                            </Link>
                        </Nav.Link>
                        <Nav.Link className="nav-item ml-30">
                            <Link href="/find-jobs">
                                <div href="/find-jobs" className="">{t("FIND_A_Job")}</div >
                            </Link>
                        </Nav.Link >
                        <NavDropdown title="Driver Resources" id="collasible-nav-dropdown" >
                            <NavDropdown.Item>
                                <Link href="/faq">
                                   <a className="dropdown-item" href="/faq" >{t("FAQ")}</a>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="/find-schools">
                                   <a className="dropdown-item" href="/">{t("GET_YOUR_CDL")} </a>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="/owner-operators">
                                   <a className="dropdown-item" href="/owner-operators"> {t("OWNER_OPERATORS")} </a>
                                </Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Motor Carrier Solutions" id="collasible-nav-dropdown" >
                            <NavDropdown.Item>
                                <Link href="http://go.driverfly.co/">
                                   <a className="dropdown-item" href="http://go.driverfly.co/">{t("OUR_SOLUTION")}  </a>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="http://go.driverfly.co/motor-carriers">
                                   <a className="dropdown-item"  href="http://go.driverfly.co/motor-carriers">{t("OPTIOS_&_PRICING")} </a>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="http://go.driverfly.co/sign-up">
                                   <a className="dropdown-item" href="http://go.driverfly.co/sign-up">{t("REQUESR_AQUOTE")} </a>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="https://digitalhiringapp.com/">
                                   <a className="dropdown-item" href="https://digitalhiringapp.com/">{t("FREE_DIGITAL_APPLICATION")} </a>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="/third-party-resources">
                                   <a className="dropdown-item" href="/third-party-resources"> {t("THIRD_PARTY_RESOURCES")} </a>
                                </Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <ul className="d-flex align-items-center mb-0">
                        <li><a href="#" className="nav-link"> < Bell /></a></li>
                        {user ?
                            <>
                                <DashboardButton className="theme-secondary-btn mr-4" />
                                <LogoutButton as={Button} className="theme-secondary-btn mr-4" />
                            </>
                            :
                            <>
                                <LoginButton className="theme-secondary-btn mr-4" />
                                <SignupButton className="theme-secondary-btn mr-4" />
                            </>}
                    </ul>
                </Navbar.Collapse>
            </Navbar>

        </>
    )
}
