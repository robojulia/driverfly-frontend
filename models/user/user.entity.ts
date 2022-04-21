import { CompanyEntity } from '../company/company.entity';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    DEV = 'dev',
    DRIVER = 'driver',
    COMPANY = 'company',
}

export interface UserEntity {
    id?: number;
    email?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    enabled_notifications?: boolean;
    roles?: UserRole;
    theme_color?: boolean;
    swipe_actions?: boolean;
    timezone?: string;
    language?: string;
    contact_number?: string;
    cell_number?: string;
    company?: CompanyEntity;

    token?: string;
}
  