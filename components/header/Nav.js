import Link from "next/link";
import useAuth from '../../hooks/useAuth';
import LoginButton from '../../components/buttons/Login';
import SignupButton from '../../components/buttons/Signup';
import LogoutButton from '../../components/buttons/Logout';
import DashboardButton from "../buttons/DashboardButton";
import { useTranslation } from "../../hooks/useTranslation";
import { Bell, List } from 'react-bootstrap-icons';
import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";



export default function MyNav() {
    const { authCheck } = useAuth();
    const { t } = useTranslation();
    return (
        <>
            <Navbar collapseOnSelect expand="lg" variant="dark">
                <Navbar.Brand>

                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link className="nav-item ml-30">
                            <Link href="/">
                                <div>{t("HOME")}</div>
                            </Link>
                        </Nav.Link>
                        <Nav.Link className="nav-item ml-30">
                            <Link href="/about">
                                <div>{t("ABOUT_US")}</div>
                            </Link>
                        </Nav.Link>
                        <Nav.Link className="nav-item ml-30">
                            <Link href="/find-jobs">
                                <div>{t("FIND_A_Job")}</div>
                            </Link>
                        </Nav.Link >
                        <NavDropdown title="Driver Resources" id="collasible-nav-dropdown" >
                            <NavDropdown.Item>
                                <Link href="/faq">
                                    <div className="dropdown-item">{t("FAQ")}</div>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="/">
                                    <div className="dropdown-item" href="#">{t("GET_YOUR_CDL")} </div>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="/owner-operators">
                                    <div className="dropdown-item"> {t("OWNER_OPERATORS")} </div>
                                </Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Motor Carrier Solutions" id="collasible-nav-dropdown" >
                            <NavDropdown.Item>
                                <Link href="http://go.driverfly.co/">
                                    <div className="dropdown-item">{t("OUR_SOLUTION")}  </div>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="http://go.driverfly.co/motor-carriers">
                                    <div className="dropdown-item">{t("OPTIOS_&_PRICING")} </div>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="http://go.driverfly.co/sign-up">
                                    <div className="dropdown-item">{t("REQUESR_AQUOTE")} </div>
                                </Link>
                            </NavDropdown.Item>

                            <NavDropdown.Item >
                                <Link href="https://digitalhiringapp.com/">
                                    <div className="dropdown-item">{t("FREE_DIGITAL_APPLICATION")} </div>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="/third-party-resources">
                                    <div className="dropdown-item" href="#"> {t("THIRD_PARTY_RESOURCES")} </div>
                                </Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <ul className="d-flex align-items-center mb-0">
                        <li><a href="#" className="nav-link"> < Bell /></a></li>
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
                </Navbar.Collapse>

            </Navbar>
            


        </>
    )
}