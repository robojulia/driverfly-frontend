import { Button, Nav, Navbar, Container, NavDropdown, Item, NavItem, Dropdown } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import React from 'react';
import { ArrowRight } from 'react-bootstrap-icons';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import WorkIcon from '@mui/icons-material/Work';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';

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
                <span className="float-left">
                  < HomeIcon className="icon_left" />
                </span>
                <Link className="sidenav-bg" href="/dashboard/driver">{t("dashboard")}</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/my-account" ? "active" : ""}>
                <span className="float-left">
                  < PersonIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/my-account">{t("my_account")}</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/my-application" ? "active" : ""}>
                <span className="float-left">
                  < InsertDriveFileIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/my-application">{t("my_application")}</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/my-docs" ? "active" : ""}>
                <span className="float-left">
                  < DocumentScannerIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/my-docs">{t("my_docs")}</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/jobs-offered" ? "active" : ""}>
                <span className="float-left">
                  < WorkIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/jobs-offered">{t("jobs_offered")}</Link>
              </li>
              <li className={router.pathname == "/dashboard/driver/jobs-applied-to" ? "active" : ""}>
                <span className="float-left">
                  < CheckBoxIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/jobs-applied-to">{t("jobs_applied_to")}</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/jobs-saved" ? "active" : ""}>
                <span className="float-left">
                  < StarIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/jobs-saved">{t("jobs_saved")}</Link>
              </li>
              <li style={{display: "none"}} className={router.pathname == "/dashboard/driver/suggested-jobs" ? "active" : ""}>
                <span className="float-left">
                  < WorkHistoryIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/suggested-jobs">{t("suggested_jobs")}</Link>
              </li>
              <li className={router.pathname == "/dashboard/driver/free-resources" ? "active" : ""}>
                <span className="float-left">
                  < SearchIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/free-resources">{t("free_resources")}</Link>
              </li>

            </ul>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>

  );
};


