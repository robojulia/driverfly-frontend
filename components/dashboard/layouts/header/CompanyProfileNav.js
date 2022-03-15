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
import user1 from "../../../../public/dashboard/assets/images/users/user1.jpg";


export default function CompanyProfileNav(props) {

    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);


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
                            <span>{props.user.name || "DriverFly User"}.</span>
                            <p></p>
                        </div>

                    </DropdownToggle >
                    <DropdownMenu>
                        <Link href="/dashboard/company/company-settings">
                            <DropdownItem >Company Settings</DropdownItem>
                        </Link>
                        <Link href="#">
                            <DropdownItem>Integrations</DropdownItem>
                        </Link>
                        <Link href="#">
                            <DropdownItem>Billing & Subscriptions</DropdownItem>
                        </Link>
                        <Link href="/dashboard/company/company-profile">
                            <DropdownItem>Company Profile</DropdownItem>
                        </Link>
                        <Link href="#">
                            <DropdownItem>My Referrals</DropdownItem>
                        </Link>
                        <DropdownItem divider />
                        <DropdownItem><LogoutButton /></DropdownItem>
                    </DropdownMenu>

                </Dropdown>
            </div>
        </>
    )
}

