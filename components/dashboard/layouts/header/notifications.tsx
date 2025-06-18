import { Dropdown } from 'react-bootstrap';
import React, { useState } from 'react';
import { useTranslation } from '../../../../hooks/use-translation';

import { useAuth } from '../../../../hooks/use-auth';
import { Bell } from 'react-bootstrap-icons';

export default function Notifications() {
  const { user } = useAuth();

  const { t } = useTranslation();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const menu_options = [];

  return (
    <>
      <Dropdown show={dropdownOpen} onToggle={toggle}>
        <Dropdown.Toggle variant="light">
          <Bell />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Divider />
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
