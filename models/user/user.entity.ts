import { JwtTokenPayload } from '../auth/jwt-token-payload.interface';
import { CompanyEntity } from '../company/company.entity';
import { RoleEntity } from '../roles/role.enttiy';

import * as yup from 'yup';
import { Status } from '../../enums/status.enum';
import { JwtRefreshTokenPayload } from '../auth/jwt-refresh-token-payload.interface';
import { DocumentEntity } from '../documents/document.entity';
import UserApi from '../../pages/api/user';

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
  company_ids?: number[]; // For creating multi-company users
  companies?: CompanyEntity[]; // Read-only from backend (existing users)
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
      email: yup
        .string()
        .email()
        .required()
        .nullable()
        .test('email-unique', 'EMAIL_ALREADY_EXISTS', async function (value) {
          if (!value) return true; // Skip validation if email is empty (required validator will handle)

          const { id } = this.parent; // Get user ID from form values (for edit mode)
          const userApi = new UserApi();

          try {
            const result = await userApi.checkEmailExists(value, id);

            if (result.exists) {
              // Return custom error message based on whether email is in current company or system-wide
              if (result.inCurrentCompany) {
                return this.createError({ message: 'EMAIL_ALREADY_EXISTS_IN_COMPANY' });
              } else {
                return this.createError({ message: 'EMAIL_ALREADY_EXISTS_IN_SYSTEM' });
              }
            }

            return true;
          } catch (error) {
            console.error('Error checking email existence:', error);
            // If the API call fails, we'll allow the form submission
            // The backend will perform the final validation
            return true;
          }
        }),
      contact_number: yup.string().nullable(),
      cell_number: yup.string().nullable(),
      timezone: yup.string().nullable(),
      language: yup.string().nullable(),
      company_admin: yup.boolean().required(),
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
      company_ids: yup
        .array()
        .of(yup.number())
        .nullable()
        .when('$isSuperAdmin', {
          is: true,
          then: yup.array().min(1, 'At least one company must be selected').required(),
        }),
    });
  }
}
