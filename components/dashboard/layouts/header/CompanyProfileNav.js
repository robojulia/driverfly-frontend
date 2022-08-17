import { Dropdown } from "react-bootstrap";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from '../../../buttons/Logout';

import { useTranslation } from "../../../../hooks/useTranslation";
import { useAuth } from "../../../../hooks/useAuth";
import Impersonate from "../../../impersonate/impersonate";
import BaseSelect from "../../../forms/BaseSelect";
import ChangeCompany from "../../../impersonate/change-company";

export default function CompanyProfileNav() {

    const { getUser } = useAuth();

    const user = getUser();

    const { t } = useTranslation();

    const router = useRouter();

    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const toggle = (e) => {
        setDropdownOpen(!dropdownOpen);
    }

    const menu_options = [
        {
            href: "/dashboard/company/settings",
            label: "COMPANY_SETTINGS"
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
            label: "MY_PROFILE"
        },
    ];

    return (
        <>
            <div className="profile profile-logo btn-group">
                <ChangeCompany />
                <Dropdown show={dropdownOpen} onToggle={toggle} >
                    <Dropdown.Toggle variant="light">
                        <img src="/dashboard/assets/images/users/user1.jpg"
                            alt="profile"
                            className="rounded-circle"
                            width="30"
                            height="30"
                        />
                        <span> {user.first_name}    {user.last_name}</span>
                    </Dropdown.Toggle >
                    <Dropdown.Menu>
                        {menu_options.map((v, i) => {
                            if (!v.label) return <Dropdown.Divider key={i} />

                            return (
                                <Dropdown.Item key={i} onClick={e => router.push(v.href || "#")}>{t(v.label)}</Dropdown.Item>
                            );
                        })}
                        <Dropdown.Divider />
                        <Impersonate />
                        <LogoutButton />
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </>
    )
}

