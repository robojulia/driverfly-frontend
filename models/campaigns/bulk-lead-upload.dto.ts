import * as yup from 'yup';
import { isValidPhoneNumber } from '../../utils/phone-normalization';

/**
 * DTO for a single lead in bulk upload
 */
export interface BulkLeadDto {
  name: string;
  phone: string;
  email?: string;
}

/**
 * DTO for adding bulk leads to a campaign
 */
export interface AddBulkLeadsDto {
  campaignId: number;
  leads: BulkLeadDto[];
}

/**
 * Response from bulk lead upload API
 */
export interface BulkLeadUploadResponse {
  message: string;
  addedCount: number;
  skippedCount: number;
  details: {
    addedTargets: number[];
    skippedTargets: Array<{
      lead: BulkLeadDto;
      reason: string;
    }>;
  };
}

/**
 * Lead entity with validation schema for bulk upload
 */
export class LeadEntity implements BulkLeadDto {
  name: string = '';
  phone: string = '';
  email?: string;

  /**
   * Yup validation schema for bulk lead upload
   */
  static yupSchemaForBulkUpload() {
    return yup.object({
      name: yup
        .string()
        .required('Name is required')
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
      phone: yup
        .string()
        .required('Phone number is required')
        .trim()
        .test(
          'is-valid-phone',
          'Phone number must be a valid 10-digit US number',
          (value) => {
            return value ? isValidPhoneNumber(value) : false;
          }
        ),
      email: yup
        .string()
        .email('Must be a valid email address')
        .trim()
        .nullable()
        .optional(),
    });
  }
}
