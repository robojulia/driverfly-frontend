export interface JwtUser {
  // userId
  user: number;
  // companyId
  company: number;

  // impersonation module
  impersonatedBy?: JwtUser;
}
