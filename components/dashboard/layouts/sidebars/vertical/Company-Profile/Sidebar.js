import { Button, Nav, NavItem } from "reactstrap";
import Link from "next/link";
import { useRouter } from "next/router";


const Sidebar = ({ showMobilemenu }) => {

  const router = useRouter();
  let curl = useRouter();
  const location = curl.pathname;

  return (

    <div className="">
      <div className="d-flex align-items-center bg_color">
        <Button
          close
          size="sm"
          className="ms-auto d-lg-none"
          onClick={showMobilemenu}
        ></Button>
      </div>
      <div className="">
          <ul className="dashboardsidebar">
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
       
        {

        },

      </div>
    </div>

  );
};

export default Sidebar;
