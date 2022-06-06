import { JwtTokenPayload } from '../auth/jwt-token-payload.interface';
import { CompanyEntity } from '../company/company.entity';
import { RoleEntity } from '../roles/role.enttiy';

export interface UserEntity {
    id?: number;
    email?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    enabled_notifications?: boolean;
    roles?: RoleEntity[];
    theme_color?: boolean;
    swipe_actions?: boolean;
    timezone?: string;
    language?: string;
    contact_number?: string;
    cell_number?: string;
    company?: CompanyEntity;

    token?: string;
    jwt?: JwtTokenPayload;
}
