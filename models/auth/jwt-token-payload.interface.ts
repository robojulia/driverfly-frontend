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
    // enumerated list of CAN* permissions assigned to user
    permissions: string[];
    // companies
    companies: CompanyEntity[];

    iat?: number;
    nbf?: number;
    exp?: number;
  }
  