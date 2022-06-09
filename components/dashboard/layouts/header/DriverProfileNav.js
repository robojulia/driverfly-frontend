import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap";
import React from "react";
import Image from "next/image";
import LogoutButton from '../../../buttons/Logout';
import user1 from "../../../../public/dashboard/assets/images/users/user1.jpg";
import { useTranslation } from "../../../../hooks/useTranslation";
import useAuth from "../../../../hooks/useAuth";


export default function DriverProfileNav() {

  const { t } = useTranslation();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const { user, removeAuth } = useAuth();


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
              <span>{user?.first_name}  {user?.last_name}</span>
            </div>
          </DropdownToggle >
          <DropdownMenu>
            <DropdownItem onClick={removeAuth}>{t("LOGOUT")}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  )
}

