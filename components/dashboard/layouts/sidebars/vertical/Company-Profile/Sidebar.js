
import { Button, Nav, Navbar, Container, NavDropdown, Item, NavItem, Dropdown } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";

import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EmailIcon from '@mui/icons-material/Email';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import GppGoodIcon from '@mui/icons-material/GppGood';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { t } = useTranslation();

  const router = useRouter();

  const menu_options = [
    {
      pathname: "/dashboard/company",
      icon: HomeIcon,
      text: t("dashboard")
    },
    {
      pathname: "/dashboard/company/jobs",
      icon: WorkIcon,
      text: t("JOB_LISTINGS"),
      startsWith: true
    },
    // {
    //   pathname: "/dashboard/company/applicants",
    //   icon: PeopleIcon,
    //   text: t("APPLICANTS")
    // },
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
      icon: SettingsIcon,
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



