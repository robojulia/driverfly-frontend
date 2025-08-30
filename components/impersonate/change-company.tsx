import { useRouter } from 'next/router';
import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Status } from '../../enums/status.enum';
import { useAuth } from '../../hooks/use-auth';
import { useTranslation } from '../../hooks/use-translation';
import { CompanyEntity } from '../../models/company/company.entity';
import AuthApi from '../../pages/api/auth';
import { Building } from 'react-bootstrap-icons';

export default function ChangeCompany() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onClick = async (e: React.MouseEvent<HTMLElement>, company: CompanyEntity) => {
    const api = new AuthApi();
    const auth = await api.changeOrganization({ companyId: company.id });
    updateUser(auth);

    // Reload the page to ensure all data is fresh for the new company
    window.location.reload();
  };

  const toggle = (e) => {
    setDropdownOpen(!dropdownOpen);
  };

  // If no company or no children, return null
  if (!user?.company?.children) return null;

  // Filter only active children companies
  const activeChildren = user.company.children.filter((v) => v.status == Status.ACTIVE);

  // If only one company (itself), don't render a dropdown
  if (activeChildren.length <= 1) return null;

  return (
    <div className="company-selector">
      <Dropdown show={dropdownOpen} onToggle={toggle}>
        <Dropdown.Toggle variant="light" className="company-toggle">
          <Building className="company-icon" />
          <span>{user.company.name}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {activeChildren.map((company) => (
            <Dropdown.Item
              key={company.id}
              onClick={(e) => onClick(e, company)}
              active={company.id === user.company.id}
            >
              {company.name}
              {company.id === user.company.id && (
                <span className="current-indicator">({t('CURRENT')})</span>
              )}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
