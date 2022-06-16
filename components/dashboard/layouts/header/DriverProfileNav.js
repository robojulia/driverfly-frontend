import { Dropdown } from "react-bootstrap";
import React from "react";
import Image from "next/image";
import LogoutButton from '../../../buttons/Logout';
import user1 from "../../../../public/dashboard/assets/images/users/user1.jpg";
import { useTranslation } from "../../../../hooks/useTranslation";
import useAuth from "../../../../hooks/useAuth";
import Impersonate from "../../../impersonate/impersonate";


export default function DriverProfileNav() {

  const { user, authenticateDriver } = useAuth();

  const { t } = useTranslation();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  authenticateDriver();


  return (
    <>
      <div className="profile">
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <Dropdown.Toggle variant="light">
            <Image
              src={user1}
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

