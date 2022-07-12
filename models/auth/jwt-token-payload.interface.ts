import { CompanyEntity } from "../company/company.entity";

export interface JwtTokenPayload {
    // userId
    sub: number;
    // email
    email: string;
    // userId
    user: number;
    // roles == "admin"
    super_admin: boolean;
    // enumerated list of CAN* permissions assigned to user
    permissions: string[];
    // companyId
    company: number;
    // companies
    companies: CompanyEntity[];

    iat?: number;
    nbf?: number;
    exp?: number;
  
    // used when impersonating another company/user
    impersonatedBy?: {
      user: number;
      company: number;
    };
  }
  