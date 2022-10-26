import { Dropdown } from "react-bootstrap";
import React, { useEffect } from "react";
import LogoutButton from '../../../buttons/logout';
import { useTranslation } from "../../../../hooks/use-translation";
import Impersonate from "../../../impersonate/impersonate";
import UserPhoto from "../../driver/user-photo"

import { useAuth } from "../../../../hooks/use-auth";

export default function DriverProfileNav() {

    const { user } = useAuth();

    const { t } = useTranslation();

    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);


    return (
        <>
            <div className="profile profile-logo">
                <Dropdown show={dropdownOpen} onToggle={toggle} >
                    <Dropdown.Toggle variant="light">
                        < UserPhoto className="rounded-circle" width="30" height="30" />
                        <span>{user?.first_name}  {user?.last_name}</span>
                    </Dropdown.Toggle >
                    <Dropdown.Menu>
                        <Impersonate />
                        <LogoutButton className="text-dark" />
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </>
    )
}

