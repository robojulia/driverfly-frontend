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

  // Debug: log user data at component start
  console.log('ChangeCompany DEBUG:', {
    user: user,
    'jwt.companies': user?.jwt?.companies,
    'user.companies': user?.companies,
    'company.children': user?.company?.children,
  });

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

  // Get companies from multiple possible sources:
  // 1. user.jwt.companies (JWT token)
  // 2. user.companies (direct property)
  // 3. user.company.children (child companies)
  const availableCompanies = user?.jwt?.companies || user?.companies || user?.company?.children;

  // If no companies available, return null
  if (!availableCompanies || availableCompanies.length === 0) return null;

  // Filter only active companies
  const activeCompanies = availableCompanies.filter((v) => v.status == Status.ACTIVE);

  // If only one company, don't render a dropdown
  if (activeCompanies.length <= 1) return null;

  return (
    <div className="company-selector">
      <Dropdown show={dropdownOpen} onToggle={toggle}>
        <Dropdown.Toggle variant="light" className="company-toggle">
          <Building className="company-icon" color="black" />
          <span>{user.company.name}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {activeCompanies.map((company) => (
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
