
import { Button, Nav, Navbar, Container, NavDropdown, Item, NavItem, Dropdown } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { HouseFill, BagFill,  GearFill,  FileEarmarkFill, FileEarmarkMedicalFill,} from 'react-bootstrap-icons';


import { useTranslation } from "../../../../../../hooks/useTranslation";

export default function Sidebar() {
  const { t } = useTranslation();

  const router = useRouter();

  const menu_options = [
    {
      pathname: "/dashboard/company",
      icon: HouseFill,
      text: t("dashboard")
    },
    {
      pathname: "/dashboard/company/jobs",
      icon: BagFill,
      text: t("JOB_LISTINGS"),
      startsWith: true
    },
    {
      pathname: "/dashboard/company/applicants",
      icon: FileEarmarkFill,
      text: t("APPLICANTS"),
      startsWith: true
    },
    // {
    //   pathname: "/dashboard/company/driver-applications-and-resume",
    //   icon: AssignmentIcon,
    //   text: t("DRIVER_APPLICATION")
    // },
    // {
    //   pathname: "/dashboard/company/sms",
    //   icon: EmailIcon,
    //   text: t("MESSAGES")
    // },
    // {
    //   pathname: "/dashboard/company/driver-directory",
    //   icon: ContactPageIcon,
    //   text: t("DRIVER_DIRECTORY")
    // },
    // {
    //   pathname: "/dashboard/company/safety-and-complience",
    //   icon: GppGoodIcon,
    //   text: t("SAFETY_COMPLIANCE")
    // },
    {
      pathname: "/dashboard/company/settings",
      icon: GearFill,
      text: t("SETTINGS"),
      startsWith: true,
    },
    // {
    //   pathname: "/dashboard/company/company-profile",
    //   icon: null,
    //   text: "Company Profile"
    // },
    // {
    //   pathname: "/dashboard/company/admin-approval-jobs",
    //   icon: null,
    //   text: "Admin approval for jobs"
    // }
  ];
  return (

    <div className="side_bar">
      <Navbar bg="light" expand="lg">
        <Container className="p-0">
          <Navbar.Toggle aria-controls="basic-navbar-nav " />
          <Navbar.Collapse id="basic-navbar-nav">

            <ul className="dashboardsidebar ">
              {
                menu_options.map((v, i) => (
                  <li key={i} className={(v.startsWith ? router.asPath.startsWith(v.pathname) : router.asPath === v.pathname) ? "active" : ""}>
                    {
                      v.icon &&
                      <span className="float-left">
                        < v.icon className="icon_left" />
                      </span>
                    }
                    <Link href={v.pathname}>{v.text}</Link>
                  </li>))
              }
            </ul>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>

  );
};



