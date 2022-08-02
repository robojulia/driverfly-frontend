import { Dropdown } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useTranslation } from "../../../../hooks/useTranslation";

import { useAuth } from "../../../../hooks/useAuth";
import { Bell } from "react-bootstrap-icons";

export default function Notifications() {

    const { user } = useAuth();

    const { t } = useTranslation();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const menu_options = []

    return (
        <>
            <Dropdown show={dropdownOpen} onToggle={toggle} >
                <Dropdown.Toggle variant="light">
                    <Bell />
                </Dropdown.Toggle >
                <Dropdown.Menu>
                    <Dropdown.Divider />
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

