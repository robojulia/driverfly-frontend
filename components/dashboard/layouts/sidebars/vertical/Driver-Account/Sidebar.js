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



export default function Sidebar() {

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
                <Link className="sidenav-bg" href="/dashboard/driver">Dashboard</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/my-account" ? "active" : ""}>
                <span className="float-left">
                  < PersonIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/my-account">My Account</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/my-application" ? "active" : ""}>
                <span className="float-left">
                  < InsertDriveFileIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/my-application">My Application</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/my-docs" ? "active" : ""}>
                <span className="float-left">
                  < DocumentScannerIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/my-docs">My Docs</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/jobs-offered" ? "active" : ""}>
                <span className="float-left">
                  < WorkIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/jobs-offered">Jobs Offered</Link>
              </li>
              <li className={router.pathname == "/dashboard/driver/jobs-applied-to" ? "active" : ""}>
                <span className="float-left">
                  < CheckBoxIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/jobs-applied-to">Jobs Applied To</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/jobs-saved" ? "active" : ""}>
                <span className="float-left">
                  < StarIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/jobs-saved">Jobs Saved</Link>
              </li>
              <li className={router.pathname == "/dashboard/driver/free-resources" ? "active" : ""}>
                <span className="float-left">
                  < SearchIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/free-resources">Free Resources</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/profile" ? "active" : ""}>
                <span className="float-left">
                  < AccountBoxIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/profile">Profile</Link>
              </li>

              <li className={router.pathname == "/dashboard/driver/suggested-jobs" ? "active" : ""}>
                <span className="float-left">
                  < WorkHistoryIcon className="icon_left" />
                </span>
                <Link href="/dashboard/driver/suggested-jobs">Suggested Jobs</Link>
              </li>

            </ul>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>

  );
};


