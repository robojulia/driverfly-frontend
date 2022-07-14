import { Dropdown } from "react-bootstrap";
import React, { useEffect } from "react";
import Image from "next/image";
import LogoutButton from '../../../buttons/Logout';
import { useTranslation } from "../../../../hooks/useTranslation";
import Impersonate from "../../../impersonate/impersonate";

import { useAuth } from "../../../../hooks/useAuth";

export default function DriverProfileNav() {

  const { user } = useAuth();

  const { t } = useTranslation();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);


  return (
    <>
      <div className="profile">
        <Dropdown show={dropdownOpen} onToggle={toggle} >
          <Dropdown.Toggle variant="light">
            <img src="/dashboard/assets/images/users/user1.jpg"
              alt="profile"
              className="rounded-circle"
              width="30"
              height="30"
            />
            <span>{user?.first_name}  {user?.last_name}</span>
          </Dropdown.Toggle >
          <Dropdown.Menu>
            <Impersonate />
            <LogoutButton />
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  )
}

