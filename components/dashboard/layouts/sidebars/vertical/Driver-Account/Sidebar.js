import { Button, Nav, Navbar, Container, NavDropdown, Item, NavItem, Dropdown } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";


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
                <Link className="sidenav-bg" href="/dashboard/driver">Dashboard</Link>
              </li>
              <li className={router.pathname == "/dashboard/driver/profile" ? "active" : ""}>
                <Link href="/dashboard/driver/profile">Profile</Link>

              </li>
              <li className={router.pathname == "/dashboard/driver/my-account" ? "active" : ""}>
                <Link href="/dashboard/driver/my-account">My Account</Link>

              </li>
              <li className={router.pathname == "/dashboard/driver/my-application" ? "active" : ""}>
                <Link href="/dashboard/driver/my-application">My Application</Link>

              </li>
              <li className={router.pathname == "/dashboard/driver/jobs-offered" ? "active" : ""}>
                <Link href="/dashboard/driver/jobs-offered">Jobs Offered</Link>

              </li>
              <li className={router.pathname == "/dashboard/driver/driver-intake-information" ? "active" : ""}>
                <Link href="/dashboard/driver/driver-intake-information">Driver Intake Information</Link>
              </li>
              <li className={router.pathname == "/dashboard/driver/suggested-jobs" ? "active" : ""}>
                <Link href="/dashboard/driver/suggested-jobs">Suggested Jobs</Link>
              </li>
              <li className={router.pathname == "/dashboard/driver/prestored-document" ? "active" : ""}>
                <Link href="/dashboard/driver/prestored-document"> Prestored Resume/ documents</Link>
              </li>
            </ul>
           
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>

  );
};


