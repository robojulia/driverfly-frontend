import Link from "next/link";
import { useAuth } from '../../hooks/use-auth';
import LoginButton from '../buttons/login';
import SignupButton from '../buttons/signup';
import LogoutButton from '../buttons/logout';
import DashboardButton from "../buttons/dashboard-button";
import { useTranslation } from "../../hooks/use-translation";
import { Bell, List } from 'react-bootstrap-icons';
import React from "react";
import { Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

export default function MyNav() {
    const { user } = useAuth();
    const { t } = useTranslation();

    const [expanded, setExpanded] = useState(false);

    const handleNavToggle = () => {
        setExpanded(!expanded);
    };

    const closeNav = () => {
        setExpanded(false);
    };


    return (
        <>
            <Navbar collapseOnSelect expand="lg" variant="dark" expanded={expanded}>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={handleNavToggle} />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link className="nav-item ml-30" onClick={closeNav}>
                            <Link href="/">
                                <div>{t("HOME")}</div >
                            </Link>
                        </Nav.Link>
                        <Nav.Link className="nav-item ml-30" onClick={closeNav}>
                            <Link href="/about">
                                <div>{t("ABOUT_US")}</div >
                            </Link>
                        </Nav.Link>
                        <Nav.Link className="nav-item ml-30" onClick={closeNav}>
                            <Link href="/find-jobs">
                                <div>{t("FIND_A_Job")}</div >
                            </Link>
                        </Nav.Link  >
                        <NavDropdown title="Driver Resources" id="collasible-nav-dropdown" >
                            <NavDropdown.Item>
                                <Link href="/faq">
                                    <a className="dropdown-item">{t("FAQ")}</a>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link href="resources">
                                    <a className="dropdown-item">{t("RESOURCES")}</a>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="/find-schools">
                                    <a className="dropdown-item">{t("GET_YOUR_CDL")} </a>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="/owner-operators">
                                    <a className="dropdown-item"> {t("OWNER_OPERATORS")} </a>
                                </Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Motor Carrier Solutions" id="collasible-nav-dropdown" >
                            <NavDropdown.Item
                                href="http://driverfly.co/motor-carriers" target="_blank" >{t("OUR_SOLUTION")}
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                href="https://driverfly.co/pricing" target="_blank" >{t("OPTIOS_&_PRICING")}
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                className="dropdown-item" href="https://driverfly.co/request-a-quote" target="_blank">{t("REQUESR_AQUOTE")}
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                className="dropdown-item" href="https://digitalhiringapp.com/" target="_blank">{t("FREE_DIGITAL_APPLICATION")}
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="/third-party-resources">
                                    <a className="dropdown-item p-0"> {t("THIRD_PARTY_RESOURCES")} </a>
                                </Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link className="nav-item ml-30">
                            <Link href="http://blog.driverfly.co" target="_blank">
                                <div >{t("BLOGS")}</div>
                            </Link>
                        </Nav.Link>
                    </Nav>
                    <ul className="d-flex align-items-center mb-0 ">

                        {user ?
                            <>
                                <li><a href="#" className="nav-link"> < Bell /></a></li>
                                <DashboardButton className="theme-secondary-btn mr-4" />
                                <LogoutButton as={Button} className="theme-secondary-btn mr-4" />
                            </>
                            :
                            <div className="d-flex justify-content-around dashboard-nav-btns">
                             <Nav.Link className="nav-item ml-30 left-child" onClick={closeNav}>
                                <LoginButton className="theme-secondary-btn mr-4" />
                            </Nav.Link>
                            <Nav.Link className="nav-item ml-20" onClick={closeNav}>
                                <SignupButton className="theme-secondary-btn mr-4" />
                            </Nav.Link>

                                {/* <LoginButton className="theme-secondary-btn mr-4" /> */}
                                {/* <SignupButton className="theme-secondary-btn mr-4" /> */}
                            </div>
                            }
                    </ul>
                </Navbar.Collapse>
            </Navbar>

        </>
    )
}
