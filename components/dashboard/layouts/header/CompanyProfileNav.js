import {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Dropdown,
} from "reactstrap";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from '../../../buttons/Logout';
import user1 from "../../../../public/dashboard/assets/images/users/user1.jpg";

import { useTranslation } from "../../../../hooks/useTranslation";
import useAuth from "../../../../hooks/useAuth";

export default function CompanyProfileNav({ user }) {
    const { authenticateCompany } = useAuth();

    authenticateCompany();

    const { t } = useTranslation();

    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const menu_options = [
        {
            href: "/dashboard/company/settings",
            label: t("COMPANY_SETTINGS")
        },
        // {
        //     href: "/dashboard/company/settings",
        //     label: t("INTEGRATIONS")
        // },
        // {
        //     href: "/dashboard/company/settings",
        //     label: t("BILLING_AND_SUBSCRIPTIONS")
        // },
        // {
        //     href: "/dashboard/company/settings",
        //     label: t("MY_REFERRALS")
        // },
        {}, // divider
        {
            href: "/dashboard/company/settings/profile",
            label: t("MY_PROFILE")
        },
    ];

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
                            <span> {user.first_name}    {user.last_name}
                                {/* {user.company?.name || "Driverfly Company"} */}
                                .</span>
                            {/* <br />
<span style={{ paddingLeft: "35px"}}>
{user.name || "DriverFly User"}
.</span> */}
                        </div>

                    </DropdownToggle >
                    <DropdownMenu>
                        {menu_options.map((v, i) => {
                            if (!v.label) return <DropdownItem key={i} divider />

                            return (
                                <Link key={i} href={v.href || "#"}>
                                    <DropdownItem>{v.label}</DropdownItem>
                                </Link>
                            );
                        })}
                        <DropdownItem divider />
                        <DropdownItem><LogoutButton /></DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </>
    )
}

