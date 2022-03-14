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
  import React from "react";
import Link from "next/link";
import Logo from "../logo/Logo";
import Image from "next/image";
import LogoutButton from '../../../buttons/Logout';
import useAuth from "../../../../hooks/useAuth";
import { useRouter } from "next/router"


export default function DriverProfileNav() {
   


    return (
        <>
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
                        <DropdownItem>My Referrals</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem><LogoutButton /></DropdownItem>
                    </DropdownMenu>

                </Dropdown>
            </div>
        </>
    )
}