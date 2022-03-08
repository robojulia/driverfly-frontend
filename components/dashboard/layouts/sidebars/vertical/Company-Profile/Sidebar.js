import { Button, Nav, NavItem } from "reactstrap";
import Link from "next/link";
import { useRouter } from "next/router";


const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard/company-profile",
    icon: "bi bi-speedometer2",
    
  },
  // {
  //   title: "Account Settings",
  //   href: "/dashboard/account-settings",
  //   icon: "bi bi-bell",
  // },

  {
    title: "Job Listings",
    href: "//dashboard/company-profile/job-listing",
    icon: "bi bi-hdd-stack",
  },
  {
    title: "Add new Jobs",
    href: "/dashboard/company-profile/new-job",
    icon: "bi bi-card-text",
  },
  {
    title: "Applicants ",
    href: "/dashboard/company-profile/applicants",
    icon: "bi bi-columns",
  },
  {
    title: "Send SMS",
    href: "/dashboard/company-profile/sms",
    icon: "bi bi-layout-split",
  },
  {
    title: "Driver applications and resume",
    href: "/dashboard/company-profile/driver-applications-and-resume",
    icon: "bi bi-layout-split",
  },
  {
    title: "Driver Directory",
    href: "/dashboard/company-profile/driver-directory",
    icon: "bi bi-layout-split",
  },
  {
    title: "Safety and Complience",
    href: "/dashboard/company-profile/safety-and-complience",
    icon: "bi bi-layout-split",
  },
  {
    title: "Account settings",
    href: "/dashboard/company-profile/account-settings",
    icon: "bi bi-layout-split",
  },
  {
    title: "Admin approval for jobs",
    href: "/dashboard/company-profile/admin-approval-jobs",
    icon: "bi bi-layout-split",
  },




];

const Sidebar = ({ showMobilemenu }) => {
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
          <Nav vertical className="sidebarNav">
            {navigation.map((navi, index) => (
              <NavItem key={index} className="sidenav-bg">
                <Link href={navi.href}>
                  <a
                    className={
                      location === navi.href
                        ? "text-primary nav-link py-3"
                        : "nav-link text-secondary py-3"
                    }
                  >
                    <i className={navi.icon}></i>
            
                    <span className="ms-3 d-inline-block">{navi.title}</span>
                  </a>
                </Link>
              </NavItem>
            ))}
          </Nav>
        </div>
      </div>
   
  );
};

export default Sidebar;
