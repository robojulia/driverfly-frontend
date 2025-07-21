import { JwtTokenPayload } from '../auth/jwt-token-payload.interface';
import { CompanyEntity } from '../company/company.entity';
import { RoleEntity } from '../roles/role.enttiy';

import * as yup from 'yup';
import { Status } from '../../enums/status.enum';
import { JwtRefreshTokenPayload } from '../auth/jwt-refresh-token-payload.interface';
import { DocumentEntity } from '../documents/document.entity';

export class UserEntity {
  id?: number;
  createdBy?: number;
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  enabled_notifications?: boolean;
  status?: Status;
  roles?: RoleEntity[];
  // roles?: RoleEntity[] = [];
  theme_color?: boolean;
  swipe_actions?: boolean;
  activated?: boolean;
  timezone?: string;
  language?: string;
  contact_number?: string;
  cell_number?: string;
  emailTokenTimestamp?: Date | string;
  phoneTokenTimestamp?: Date | string;
  company?: CompanyEntity;
  photo?: DocumentEntity;

  token?: string;
  jwt?: JwtTokenPayload;
  refreshToken?: string;
  jwtRefresh?: JwtRefreshTokenPayload;

  super_admin?: boolean;
  company_admin?: boolean;
  company_disabled?: boolean;

  static yupSchema() {
    return yup.object({
      first_name: yup.string().required().nullable(),
      last_name: yup.string().required().nullable(),
      email: yup.string().email().required().nullable(),
      contact_number: yup.string().nullable(),
      cell_number: yup.string().nullable(),
      timezone: yup.string().nullable(),
      language: yup.string().nullable(),
      // roles: yup.array(RoleEntity.yupConnectSchema()).length(1, "yup.required").nullable().required(),
      password: yup
        .string()
        .when('id', {
          is: (v) => !v,
          then: yup.string().required().nullable(),
        })
        .nullable(),
      photo: yup
        .mixed()
        .when({
          is: (v) => !!v,
          then: DocumentEntity.yupSchema(),
        })
        .optional(),
    });
  }
}
