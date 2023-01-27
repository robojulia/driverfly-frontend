import { Dropdown } from "react-bootstrap";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import LogoutButton from '../../../buttons/logout';
import { useTranslation } from "../../../../hooks/use-translation";
import { useAuth } from "../../../../hooks/use-auth";
import Impersonate from "../../../impersonate/impersonate";
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
                    <Dropdown.Menu className="w-100">
                        {menu_options.map((v, i) => {
                            if (!v.label) return <Dropdown.Divider key={i} />

                            return (
                                <Dropdown.Item className="text-dark" key={i} onClick={e => router.push(v.href || "#")}>{t(v.label)}</Dropdown.Item>
                            );
                        })}
                        <Dropdown.Divider />
                        <Impersonate />
                        <LogoutButton className="text-dark" />
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </>
    )
}

