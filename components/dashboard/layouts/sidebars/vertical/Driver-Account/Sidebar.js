import { Button, Nav, NavItem } from "reactstrap";
import Link from "next/link";
import { useRouter } from "next/router";


const Sidebar = ({ showMobilemenu }) => {
  const router = useRouter();

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
        <div className="">
          <ul className="dashboardsidebar">
            <li className={router.pathname == "/dashboard/driver" ? "active" : ""}>
              <Link className="sidenav-bg" href="/dashboard/driver">Dashboard</Link>
            </li>
            <li className={router.pathname == "/dashboard/driver/profile" ? "active" : ""}>
              <Link href="/dashboard/driver/profile">Profile</Link>

            </li>
            <li className={router.pathname == "/dashboard/driver/application" ? "active" : ""}>
              <Link href="/dashboard/driver/application">My Application</Link>
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

        </div>
      </div>
    </div>

  );
};

export default Sidebar;
