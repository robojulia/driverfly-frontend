import React, { useEffect }  from "react";
import Logo from "../logo/Logo";
import useAuth from "../../../../hooks/useAuth";


import {
  Navbar,
  Collapse,
} from "reactstrap";
import DriverProfileNav from "./DriverProfileNav";
import CompanyProfileNav from "./CompanyProfileNav";
import { useRouter } from "next/router";
import { useTranslation } from "../../../../hooks/useTranslation";

const Header = () => {

  const { t } = useTranslation();

  const { authCheck, isDriver, isCompany } = useAuth();

  const user = authCheck();

  // const router = useRouter();
  // if (!user) {
  //   router.push('/');
  //   return null;
  // }

  return (
    <Navbar color="" dark expand="md">
      <div className="logo_container">
        <Logo />
      </div>

      <Collapse className="d-block">


        {
          isDriver() && < DriverProfileNav user={user} />
        }

        {
          isCompany() && < CompanyProfileNav user={user} />
        }

      </Collapse>

     
    </Navbar>

  );
};

export default Header;
