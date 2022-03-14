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
} from "reactstrap"
import React, { useState } from "react"
import Link from "next/link"
import Logo from "../logo/Logo"
import Image from "next/image"
import LogoutButton from '../../../buttons/Logout'
import useAuth from "../../../../hooks/useAuth"
import { useRouter } from "next/router"
import useStorage from "../../../../hooks/useStorage"


export default function DriverProfileNav () {
  const localStorage = useStorage()

  const [isOpen, setIsOpen] = useState( false )

  const toggle = () => setIsOpen( !isOpen )

  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <>
      <div className="profile">
        <Dropdown isOpen={isOpen} toggle={toggle} />
        <Dropdown >
          <DropdownToggle>

            <div style={{ lineHeight: "0px" }}>

              {/* <Image
                src="https://cdn.pixabay.com/photo/2018/08/28/13/29/avatar-3637561_1280.png"
                alt="profile"
                className="rounded-circle"
                width="30"
                height="30"
              /> */}
              <span>{user.name || "DriverFly User"}</span>
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