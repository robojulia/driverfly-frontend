import React from "react";
import { useAuth } from "../../../../hooks/use-auth";
import ChangeCompany from "../../../impersonate/change-company";

export default function CompanyProfileNav() {
  const { user } = useAuth();

  // Debug: log user data
  console.log('CompanyProfileNav DEBUG:', {
    user: user,
    'jwt.companies': user?.jwt?.companies,
    'user.companies': user?.companies,
    'company.children': user?.company?.children,
  });

  // Check if there are additional companies to switch to
  // Check multiple sources: JWT companies, user.companies, or company.children
  const availableCompanies = user?.jwt?.companies || user?.companies || user?.company?.children;
  const hasAdditionalCompanies = availableCompanies && availableCompanies.length > 1;

  // If no company or only one company, show the company name as informational display
  if (!hasAdditionalCompanies) {
    return (
      <div className="company-profile-nav">
        <div className="company-name">
          <span style={{ fontSize: "1.25rem", fontWeight: 500 }}>{user?.company?.name || ""}</span>
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
