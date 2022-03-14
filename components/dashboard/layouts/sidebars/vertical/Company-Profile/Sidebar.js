import { Button, Nav, NavItem } from "reactstrap";
import Link from "next/link";
import { useRouter } from "next/router";


const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard/company",
    icon: "bi bi-speedometer2",
    
  },
  {
    title: "Job Listings",
    href: "/dashboard/company/job-listing",
    icon: "bi bi-hdd-stack",
  },
  {
    title: "Add new Jobs",
    href: "/dashboard/company/new-job",
    icon: "bi bi-card-text",
  },
  {
    title: "Applicants ",
    href: "/dashboard/company/applicants",
    icon: "bi bi-columns",
  },
  {
    title: "Send SMS",
    href: "/dashboard/company/sms",
    icon: "bi bi-layout-split",
  },
  {
    title: "Driver applications and resume",
    href: "/dashboard/company/driver-applications-and-resume",
    icon: "bi bi-layout-split",
  },
  {
    title: "Driver Directory",
    href: "/dashboard/company/driver-directory",
    icon: "bi bi-layout-split",
  },
  {
    title: "Safety and Complience",
    href: "/dashboard/company/safety-and-complience",
    icon: "bi bi-layout-split",
  },
  {
    title: "Company settings",
    href: "/dashboard/company/company-settings",
    icon: "bi bi-layout-split",
  },
  
  {
    title: "Admin approval for jobs",
    href: "/dashboard/company/admin-approval-jobs",
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
