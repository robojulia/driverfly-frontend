import { ApplicantEntity } from '../../../applicant/applicant.entity';
import { ApplicantEntryMode } from '../../../../enums/applicants/applicant-entry-mode.enum';
import { ApplicantStatus } from '../../../../enums/applicants/applicant-status.enum';
import { DriverLicenseType } from '../../../../enums/users/driver-license-type.enum';
import { ATSProvider } from '../../../../enums/integrations/ats-provider.enum';
import { normalizePhoneNumber } from '../../../../utils/phone-normalization';
import {
  FacebookLeadDetail,
  FacebookLeadField,
  FB_FIELD,
} from './facebook-lead-types';

/**
 * Converts a Facebook Lead Ads form submission into a DriverFly ApplicantEntity.
 *
 * Job mapping priority:
 *  1. Custom hidden field `job_id` in the form answers
 *  2. `formJobMapping` passed in from the stored FacebookFormJobMapping
 */
export class FacebookFieldMapper {
  /**
   * Converts a fetched Facebook lead into a partial ApplicantEntity.
   *
   * @param lead        Full lead detail from the Graph API
   * @param jobId       Job ID resolved from the form-job mapping table (fallback if not in form)
   * @param companyId   Company ID resolved from the form-job mapping table (fallback if not in form)
   */
  static mapToApplicant(
    lead: FacebookLeadDetail,
    jobId?: number,
    companyId?: number,
  ): Partial<ApplicantEntity> & { _meta: { jobId?: number; companyId?: number } } {
    const fields = this.buildFieldMap(lead.field_data);

    // Resolve job / company – prefer explicit form fields over mapping defaults
    const resolvedJobId = this.parseIntField(fields[FB_FIELD.JOB_ID]) ?? jobId;
    const resolvedCompanyId = this.parseIntField(fields[FB_FIELD.COMPANY_ID]) ?? companyId;

    const applicant: Partial<ApplicantEntity> = {
      entry_mode: ApplicantEntryMode.FACEBOOK_LEAD,
      integration_source: ATSProvider.FACEBOOK_LEADS,
      current_application_status: ApplicantStatus.NEW_APPLIED_SHORT_FORM,

      // Name
      ...this.mapName(fields),

      // Contact
      phone: this.mapPhone(fields),
      email: fields[FB_FIELD.EMAIL]?.toLowerCase().trim() || undefined,

      // Address
      zip_code: fields[FB_FIELD.ZIP] || undefined,
      city: fields[FB_FIELD.CITY] || undefined,
      state: fields[FB_FIELD.STATE] || undefined,
      address_1: fields[FB_FIELD.STREET] || undefined,

      // Additional driver info (if collected in the form)
      birthdate: this.mapDob(fields),
      license_type: this.mapCdlClass(fields),
      years_cdl_experience: this.parseIntField(fields[FB_FIELD.YEARS_EXPERIENCE]),
      is_owner_operator: this.mapBool(fields[FB_FIELD.IS_OWNER_OPERATOR]),

      last_ats_sync_at: new Date(),
    };

    return {
      ...this.removeUndefined(applicant),
      // _meta carries resolved IDs back to the caller so it can link the job
      _meta: { jobId: resolvedJobId, companyId: resolvedCompanyId },
    } as Partial<ApplicantEntity> & { _meta: { jobId?: number; companyId?: number } };
  }

  // ─── Field extraction helpers ───────────────────────────────────────────────

  /** Convert field_data array into a plain key → value map (first value only). */
  private static buildFieldMap(fieldData: FacebookLeadField[]): Record<string, string> {
    return fieldData.reduce<Record<string, string>>((acc, field) => {
      acc[field.name.toLowerCase()] = field.values[0] ?? '';
      return acc;
    }, {});
  }

  /**
   * Handles both `full_name` (single field) and `first_name` + `last_name`
   * (two separate fields), which Facebook allows form builders to choose between.
   */
  private static mapName(
    fields: Record<string, string>,
  ): Pick<ApplicantEntity, 'first_name' | 'last_name'> {
    if (fields[FB_FIELD.FULL_NAME]) {
      const parts = fields[FB_FIELD.FULL_NAME].trim().split(/\s+/);
      return {
        first_name: parts[0] || undefined,
        last_name: parts.slice(1).join(' ') || undefined,
      };
    }

    return {
      first_name: fields[FB_FIELD.FIRST_NAME]?.trim() || undefined,
      last_name: fields[FB_FIELD.LAST_NAME]?.trim() || undefined,
    };
  }

  private static mapPhone(fields: Record<string, string>): string | undefined {
    const raw = fields[FB_FIELD.PHONE];
    if (!raw) return undefined;
    try {
      return normalizePhoneNumber(raw);
    } catch {
      return raw;
    }
  }

  private static mapDob(fields: Record<string, string>): string | undefined {
    const raw = fields[FB_FIELD.DOB];
    if (!raw) return undefined;
    try {
      const date = new Date(raw);
      return isNaN(date.getTime()) ? undefined : date.toISOString();
    } catch {
      return undefined;
    }
  }

  private static mapCdlClass(fields: Record<string, string>): DriverLicenseType | undefined {
    const raw = fields[FB_FIELD.CDL_CLASS]?.toUpperCase();
    if (!raw) return undefined;
    const map: Record<string, DriverLicenseType> = {
      A: DriverLicenseType.CDL_CLASS_A,
      'CLASS A': DriverLicenseType.CDL_CLASS_A,
      'CLASS_A': DriverLicenseType.CDL_CLASS_A,
      B: DriverLicenseType.CDL_CLASS_B,
      'CLASS B': DriverLicenseType.CDL_CLASS_B,
      'CLASS_B': DriverLicenseType.CDL_CLASS_B,
      C: DriverLicenseType.CDL_CLASS_C,
      'CLASS C': DriverLicenseType.CDL_CLASS_C,
      'CLASS_C': DriverLicenseType.CDL_CLASS_C,
    };
    return map[raw];
  }

  private static mapBool(value: string | undefined): boolean | undefined {
    if (value === undefined || value === '') return undefined;
    return ['yes', 'true', '1', 'y'].includes(value.toLowerCase());
  }

  private static parseIntField(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const n = parseInt(value, 10);
    return isNaN(n) ? undefined : n;
  }

  private static removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v !== undefined),
    ) as Partial<T>;
  }
}
