import React, { useEffect } from 'react';
import Logo from '../logo/logo';

import { Navbar, Collapse } from 'reactstrap';

const Header = ({ children }) => {
  return (
    <Navbar color="" dark expand="md">
      <div className="logo_container">
        <Logo />
      </div>

      <Collapse className="d-block">{children}</Collapse>
    </Navbar>
  );
};

export default Header;
