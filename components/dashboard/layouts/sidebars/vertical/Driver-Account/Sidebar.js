import { Button, Nav, NavItem } from "reactstrap";
import Link from "next/link";
import { useRouter } from "next/router";


const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard/driver",
    icon: "bi bi-speedometer2",
    
  },

  {
    title: "Profile",
    href: "/dashboard/driver/profile",
    icon: "bi bi-patch-check",
  },
  {
    title: "My Applications",
    href: "/dashboard/driver/application",
    icon: "bi bi-hdd-stack",
  },
  {
    title: "Driver intake information",
    href: "/dashboard/driver/driver-intake-information",
    icon: "bi bi-card-text",
  },
  {
    title: "Suggested jobs",
    href: "/dashboard/driver/suggested-jobs",
    icon: "bi bi-columns",
  },
  {
    title: "Prestored Resume/ documents",
    href: "/dashboard/driver/prestored-document",
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
