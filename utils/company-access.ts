import { UserEntity } from '../models/user/user.entity';

// Mirrors the backend's company access levels (driverfly-backend src/auth/company-access.ts).
// Display only: the backend decides what each user may do.

/** Registered the company (no inviter), or a DriverFly super admin. Company admins cannot change these accounts. */
export function isProtectedCompanyAccount(u: Pick<UserEntity, 'super_admin' | 'createdBy'>): boolean {
  return Boolean(u?.super_admin) || u?.createdBy == null;
}

export function companyRoleLabel(u: Pick<UserEntity, 'super_admin' | 'company_admin' | 'createdBy' | 'roles'>): string {
  if (u?.super_admin) return 'Super Admin';
  if (u?.createdBy == null) return 'Owner';
  if (u?.company_admin) return 'Company Admin';
  // Some endpoints return users without roles; don't call them regular users without knowing.
  if (!u?.roles) return 'Company User';
  // Users invited before the Employee role existed still hold the all-access Admin role.
  if (u.roles.some((r) => r?.name === 'Admin' && !r.company)) return 'Company Admin (unreviewed)';
  return 'Regular User';
}
