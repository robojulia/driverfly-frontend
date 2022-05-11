import React from "react";
import Link from "next/link";
import Logo from "../logo/Logo";
import Image from "next/image";
import LogoutButton from '../../../buttons/Logout';
import useAuth from "../../../../hooks/useAuth";


import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import LogoWhite from "../../../../public/dashboard/assets/images/logos/amplelogowhite.svg";
import user1 from "../../../../public/dashboard/assets/images/users/user1.jpg";
import DriverProfileNav from "./DriverProfileNav";
import CompanyProfileNav from "./CompanyProfileNav";

const Header = ({ showMobmenu }) => {

  const { authCheck, isDriver, isCompany, setAuth } = useAuth();

  const user = authCheck();


  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Navbar color="" dark expand="md">
      <div className="logo_container">
        <Logo />
      </div>

      <Collapse className="d-block">


        {
          isDriver() ? < DriverProfileNav user={user} /> : ""
        }

        {
          isCompany() ? < CompanyProfileNav user={user} /> : ""
        }

      </Collapse>

     
    </Navbar>

  );
};

export default Header;
