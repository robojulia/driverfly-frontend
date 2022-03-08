import React from "react";
import Link from "next/link";
import Logo from "../logo/Logo";
import Image from "next/image";
import LogoutButton from '../../../buttons/Logout';


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


const Header = ({ showMobmenu }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Navbar color="" dark expand="md">
      <div className="d-flex align-items-center">
        <NavbarBrand href="/" className="d-lg-none">
          <Image src={LogoWhite} alt="logo" />
        </NavbarBrand>
        <Button color="" className="d-lg-none" onClick={showMobmenu}>
          <i className="bi bi-list"></i>
        </Button>
      </div>
      <div className="hstack gap-2 bg-success">
        <Button
          color="secondary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div>
      <div className="d-flex align-items-center bg_color">
          <Logo />
        </div>

      <Collapse navbar isOpen={isOpen}>
        <div className="input-group rounded w-25 m-auto py-2">
          <i className="fas fa-search"></i>
          <i class="fa fa-search" aria-hidden="true"></i>
          <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
          <span className="input-group-text border-0" id="search-addon">
          </span>
        </div>
        
        <div className="alerts">
          <h3>Alerts (5)</h3>
        </div>
        {/* <Nav className="me-auto" navbar>
          <NavItem>
            <Link href="/">
              <a className="nav-link">Starter</a>
            </Link>
          </NavItem>
          <NavItem>
            <Link href="/about">
              <a className="nav-link">About</a>
            </Link>
          </NavItem>
          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle caret nav>
              DD Menu
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem>Option 1</DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav> */}
        <div className="profile">
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle>
              
              <div style={{ lineHeight: "0px" }}>
              
                <Image
                  src={user1}
                  alt="profile"
                  className="rounded-circle"
                  width="30"
                  height="30"

                />
                <span>Timothy N.</span>
                <p></p>
              </div>

            </DropdownToggle >
            <DropdownMenu>
              <DropdownItem>Account Settings</DropdownItem>
              <DropdownItem>Integrations</DropdownItem>
              <DropdownItem>Billing & Subscriptions</DropdownItem>
              <DropdownItem>Company Profile</DropdownItem>
              <DropdownItem>My Referrals</DropdownItem>
              <DropdownItem divider />
              <DropdownItem><LogoutButton /></DropdownItem>
            </DropdownMenu>

          </Dropdown>
        </div>
      </Collapse>
    </Navbar>
  );
};

export default Header;
