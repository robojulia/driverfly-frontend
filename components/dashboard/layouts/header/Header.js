import React, { useEffect }  from "react";
import Logo from "../logo/Logo";
import { useAuth } from "../../../../hooks/useAuth2";


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

  const { user, loginGuard } = useAuth();

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
          user && !user.company && < DriverProfileNav user={user} />
        }

        {
          user && user.company && < CompanyProfileNav user={user} />
        }

      </Collapse>

     
    </Navbar>

  );
};

export default Header;
