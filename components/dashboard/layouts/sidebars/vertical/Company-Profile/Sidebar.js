
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
           
          <ul className="dashboardsidebar ">
          <li className={router.pathname == "/dashboard/company" ? "active" : ""}>
            <Link className="sidenav-bg" href="/dashboard/company">Dashboard</Link>
          </li>
          <li className={router.pathname == "/dashboard/company/job-listing" ? "active" : ""}>
            <Link href="/dashboard/company/job-listing">Job Listings</Link>

          </li>
          <li className={router.pathname == "/dashboard/company/new-job" ? "active" : ""}>
            <Link href="/dashboard/company/new-job">Add new Jobs</Link>
          </li>
          <li className={router.pathname == "/dashboard/company/applicants" ? "active" : ""}>
            <Link href="/dashboard/company/applicants">Applicants</Link>
          </li>
          <li className={router.pathname == "/dashboard/company/sms" ? "active" : ""}>
            <Link href="/dashboard/company/sms"> Send SMS</Link>
          </li>
          <li className={router.pathname == "/dashboard/company/driver-applications-and-resume" ? "active" : ""}>
            <Link href="/dashboard/company/driver-applications-and-resume"> Driver applications and resume</Link>
          </li>
          <li className={router.pathname == "/dashboard/company/driver-directory" ? "active" : ""}>
            <Link href="/dashboard/company/driver-directory"> Driver Directory</Link>
          </li>
          <li className={router.pathname == "/dashboard/company/safety-and-complience" ? "active" : ""}>
            <Link href="/dashboard/company/safety-and-complience">Safety and Complience</Link>
          </li>
          <li className={router.pathname == "/dashboard/company/company-settings" ? "active" : ""}>
            <Link href="/dashboard/company/company-settings"> Company Settings</Link>
          </li>
          <li className={router.pathname == "/dashboard/company/company-profile" ? "active" : ""}>
            <Link href="/dashboard/company/company-profile">Company Profile</Link>
          </li>
          <li className={router.pathname == "/dashboard/company/admin-approval-jobs" ? "active" : ""}>
            <Link href="/dashboard/company/admin-approval-jobs">Admin approval for jobs</Link>
          </li>
        </ul>
           
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>

  );
};



