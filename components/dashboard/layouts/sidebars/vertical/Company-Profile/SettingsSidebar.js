
import { Button, Nav, Navbar, Container, NavDropdown, Item, NavItem, Dropdown } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";

import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import { useTranslation } from "react-i18next";

export default function SettingsSidebar() {
  const { t } = useTranslation();

  const router = useRouter();

  const menu_options = [
        {
            pathname: "/dashboard/company/settings",
            icon: EmojiTransportationIcon,
            text: t("company")
        },
        {
            pathname: "/dashboard/company/settings/vehicles",
            icon: LocalShippingIcon,
            text: t("VEHICLES"),
            startsWith: true
        },
    ];
    console.log(menu_options);
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



