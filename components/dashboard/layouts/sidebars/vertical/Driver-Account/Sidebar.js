import { Button, Nav, Navbar, Container, NavDropdown, Item, NavItem, Dropdown } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import React from 'react';
import { ArrowRight } from 'react-bootstrap-icons';
import { HouseFill, BagFill, PersonFill, FileEarmarkFill, FileEarmarkMedicalFill, CheckSquareFill, StarFill, Search} from 'react-bootstrap-icons';


import { useTranslation } from "react-i18next";


export default function Sidebar() {
  const { t } = useTranslation();

  const router = useRouter();
  return (

    <div className="side_bar">
      <Navbar bg="light" expand="lg">
        <Container className="p-0">
          <Navbar.Toggle aria-controls="basic-navbar-nav " />
          <Navbar.Collapse id="basic-navbar-nav">

            <ul>

              <li className={router.pathname == "/dashboard/driver" ? "active" : ""}>
                  < HouseFill className="icon_left" />
              
                <Link className="sidenav-bg" href="/dashboard/driver">{t("dashboard")}</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/my-account" ? "active" : ""}>

                  < PersonFill className="icon_left" />
              
                <Link href="/dashboard/driver/my-account">{t("my_account")}</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/my-application" ? "active" : ""}>
          
                  < FileEarmarkFill className="icon_left" />
              
                <Link href="/dashboard/driver/my-application">{t("my_application")}</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/my-docs" ? "active" : ""}>
             
                  < FileEarmarkMedicalFill className="icon_left" />
                
                <Link href="/dashboard/driver/my-docs">{t("my_docs")}</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/jobs-offered" ? "active" : ""}>
               
                  < BagFill className="icon_left" />
               
                <Link href="/dashboard/driver/jobs-offered">{t("jobs_offered")}</Link>
              </li>
              <li className={router.pathname == "/dashboard/driver/jobs-applied-to" ? "active" : ""}>
              
                  < CheckSquareFill className="icon_left" />
              
                <Link href="/dashboard/driver/jobs-applied-to">{t("jobs_applied_to")}</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/jobs-saved" ? "active" : ""}>
            
                  < StarFill className="icon_left" />
              
                <Link href="/dashboard/driver/jobs-saved">{t("jobs_saved")}</Link>
              </li>
              {/* <li style={{display: "none"}} className={router.pathname == "/dashboard/driver/suggested-jobs" ? "active" : ""}>
                <span className="float-left">
                  < WorkHistoryIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/suggested-jobs">{t("suggested_jobs")}</Link>
              </li> */}
              <li className={router.pathname == "/dashboard/driver/free-resources" ? "active" : ""}>
              
                  < Search className="icon_left" />
         
                <Link href="/dashboard/driver/free-resources">{t("free_resources")}</Link>
              </li>

            </ul>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>

  );
};


