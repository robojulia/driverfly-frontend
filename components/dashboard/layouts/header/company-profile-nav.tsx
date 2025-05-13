import React from "react";
import { useAuth } from "../../../../hooks/use-auth";
import ChangeCompany from "../../../impersonate/change-company";
import { Building } from "react-bootstrap-icons";

export default function CompanyProfileNav() {
  const { user } = useAuth();

  // Check if there are additional companies to switch to
  const hasAdditionalCompanies =
    user?.company?.children && user.company.children.length > 1;

  // If no company or only one company, show the company name as informational display
  if (!hasAdditionalCompanies) {
    return (
      <div className="company-profile-nav">
        <div className="company-name">
          <Building className="company-icon me-2" />
          <span>{user?.company?.name || ""}</span>
        </div>
      </div>
    );
  }

  // If there are multiple companies, show the company selector
  return (
    <div className="company-profile-nav">
      <ChangeCompany />
    </div>
  );
}
