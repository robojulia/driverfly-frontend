export interface UserWithCompany {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  status: string;
  super_admin: boolean;
  company_admin: boolean;
  created_at: Date;
  company?: {
    id: number;
    name: string;
    slug?: string;
  } | null;
}

export interface UpdateSuperAdminDto {
  super_admin: boolean;
}
