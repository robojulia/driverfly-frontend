
import { Button, Nav, Navbar, Container, NavDropdown, Item, NavItem, Dropdown } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { Building, CardImage, PersonFill, GeoAltFill} from 'react-bootstrap-icons';


import { useTranslation } from "react-i18next";

export default function SettingsSidebar() {
  const { t } = useTranslation();

  const router = useRouter();

  const menu_options = [
      {
          pathname: "/dashboard/company/settings",
          icon: Building,
          text: t("company")
      },
      {
          pathname: "/dashboard/company/settings/vehicles",
          icon: CardImage,
          text: t("VEHICLES"),
          startsWith: true
      },
      {
        pathname: "/dashboard/company/settings/locations",
        icon: GeoAltFill,
        text: t("LOCATIONS"),
        startsWith: true
      },
      {
        pathname: "/dashboard/company/settings/profile",
        icon: PersonFill,
        text: t("MY_PROFILE"),
      },
  ];
  return (

    <div className="side_bar">
      <Navbar bg="light" expand="lg">
        <Container className="p-0">
          <Navbar.Toggle aria-controls="basic-navbar-nav " />
          <Navbar.Collapse id="basic-navbar-nav">
           
            <ul>
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



