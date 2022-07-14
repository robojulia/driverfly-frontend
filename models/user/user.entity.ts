import { JwtTokenPayload } from '../auth/jwt-token-payload.interface';
import { CompanyEntity } from '../company/company.entity';
import { RoleEntity } from '../roles/role.enttiy';

import * as yup from "yup";
import { Status } from '../../enums/status.enum';
import { JwtRefreshTokenPayload } from '../auth/jwt-refresh-token-payload.interface';

export class UserEntity {
    id?: number;
    email?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    enabled_notifications?: boolean;
    status: Status;
    roles?: RoleEntity[];
    theme_color?: boolean;
    swipe_actions?: boolean;
    activated?: boolean;
    timezone?: string;
    language?: string;
    contact_number?: string;
    cell_number?: string;
    company?: CompanyEntity;

    token?: string;
    jwt?: JwtTokenPayload;
    refreshToken?: string;
    jwtRefresh?: JwtRefreshTokenPayload;

    static yupSchema() {
        return yup.object({
            first_name: yup.string().required().nullable(),
            last_name: yup.string().required().nullable(),
            email: yup.string().required().nullable(),
            contact_number: yup.string().nullable(),
            cell_number: yup.string().nullable(),
            timezone: yup.string().nullable(),
            language: yup.string().nullable(),
        });
    }
}
