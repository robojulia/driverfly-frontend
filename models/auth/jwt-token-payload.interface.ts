import { CompanyEntity } from "../company/company.entity";
import { JwtUser } from "./jwt-user.inteface";

export interface JwtTokenPayload extends JwtUser {
    // userId
    sub: number;
    // email
    email: string;
    // roles == "admin"
    super_admin: boolean;
    company_admin: boolean;
    // company owner, company admin or super admin (set by the backend at login). Only decides
    // which controls to show: the backend re-checks every administrative request itself.
    company_administrator?: boolean;
    // enumerated list of CAN* permissions assigned to user
    permissions: string[];
    // companies
    companies: CompanyEntity[];

    iat?: number;
    nbf?: number;
    exp?: number;
  }
  