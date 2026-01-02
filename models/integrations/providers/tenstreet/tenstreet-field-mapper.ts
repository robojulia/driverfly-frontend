import { ApplicantEntity } from '../../../applicant/applicant.entity';
import { ApplicantEntryMode } from '../../../../enums/applicants/applicant-entry-mode.enum';
import { ApplicantStatus } from '../../../../enums/applicants/applicant-status.enum';
import { DriverLicenseType } from '../../../../enums/users/driver-license-type.enum';
import { DriverEndorsement } from '../../../../enums/users/driver-endorsement.enum';
import { LicenseRestrictions } from '../../../../enums/applicants/applicant-license-restrictions-type.enum';
import { normalizePhoneNumber } from '../../../../utils/phone-normalization';
import {
  TenstreetApplicant,
  TENSTREET_CDL_CLASS_MAP,
  TENSTREET_ENDORSEMENT_MAP,
  TENSTREET_RESTRICTION_MAP,
  TENSTREET_STATUS_MAP,
} from './tenstreet-types';
import { ATSProvider } from '../../../../enums/integrations/ats-provider.enum';

export class TenstreetFieldMapper {
  /**
   * Converts a Tenstreet applicant to DriverFly ApplicantEntity format
   */
  static mapToDriverFly(tenstreetApplicant: TenstreetApplicant): Partial<ApplicantEntity> {
    const applicant: Partial<ApplicantEntity> = {
      // Entry tracking
      entry_mode: ApplicantEntryMode.ATS_IMPORT,
      integration_source: ATSProvider.TENSTREET,

      // Personal Information
      first_name: tenstreetApplicant.FirstName,
      last_name: tenstreetApplicant.LastName,
      email: tenstreetApplicant.EmailAddress?.toLowerCase()?.trim(),
      phone: this.mapPhoneNumber(tenstreetApplicant),
      birthdate: this.parseDate(tenstreetApplicant.DateOfBirth),
      ssn: tenstreetApplicant.SSN,

      // Address
      address_1: tenstreetApplicant.AddressLine1,
      address_2: tenstreetApplicant.AddressLine2,
      city: tenstreetApplicant.City,
      state: tenstreetApplicant.State,
      zip_code: tenstreetApplicant.ZipCode,

      // CDL Information
      license_number: tenstreetApplicant.CDLNumber,
      license_expiry: this.parseDate(tenstreetApplicant.CDLExpirationDate),
      license_state: tenstreetApplicant.CDLState,
      license_type: this.mapCDLClass(tenstreetApplicant.CDLClassCode),
      years_cdl_experience: tenstreetApplicant.YearsExperience,
      endorsements: this.mapEndorsements(tenstreetApplicant.CDLEndorsements),
      license_restrictions: this.mapRestrictions(tenstreetApplicant.CDLRestrictions),

      // Employment
      is_owner_operator: tenstreetApplicant.IsOwnerOperator || false,
      owner_operator_company_name: tenstreetApplicant.OwnerOperatorCompanyName,
      owner_operator_dot_number: tenstreetApplicant.OwnerOperatorDOTNumber,

      // Safety & Background
      can_pass_drug_test: this.mapDrugTestResult(tenstreetApplicant.DrugTestResult),
      accident_count: tenstreetApplicant.AccidentCount || 0,
      moving_violations_count: tenstreetApplicant.MovingViolationCount || 0,
      has_past_dui: tenstreetApplicant.HasDUI || false,
      dui_years: tenstreetApplicant.DUIYears || [],
      criminal_history: tenstreetApplicant.CriminalHistory,
      license_revoked: tenstreetApplicant.LicenseRevoked || false,
      license_revoked_details: tenstreetApplicant.LicenseRevokedDetails,

      // Emergency Contact
      emergency_contact_name: tenstreetApplicant.EmergencyContactName,
      emergency_contact_number: tenstreetApplicant.EmergencyContactPhone
        ? normalizePhoneNumber(tenstreetApplicant.EmergencyContactPhone)
        : undefined,
      emergency_contact_relationship: tenstreetApplicant.EmergencyContactRelationship,

      // Application Status
      current_application_status: this.mapStatus(tenstreetApplicant.ApplicationStatus),

      // Timestamps
      created_at: this.parseDate(tenstreetApplicant.CreatedDate),
      last_updated_at: this.parseDate(tenstreetApplicant.ModifiedDate),
      last_ats_sync_at: new Date(),
    };

    // Remove undefined values to avoid overwriting existing data with nulls
    return this.removeUndefinedValues(applicant);
  }

  /**
   * Converts a DriverFly ApplicantEntity to Tenstreet format (for outbound sync)
   */
  static mapFromDriverFly(applicant: ApplicantEntity): Partial<TenstreetApplicant> {
    return {
      FirstName: applicant.first_name,
      LastName: applicant.last_name,
      EmailAddress: applicant.email,
      HomePhone: applicant.phone,
      DateOfBirth: applicant.birthdate,
      AddressLine1: applicant.address_1,
      AddressLine2: applicant.address_2,
      City: applicant.city,
      State: applicant.state,
      ZipCode: applicant.zip_code,
      CDLNumber: applicant.license_number,
      CDLExpirationDate: applicant.license_expiry,
      CDLState: applicant.license_state,
      CDLClassCode: this.reverseCDLClass(applicant.license_type),
      YearsExperience: applicant.years_cdl_experience,
      IsOwnerOperator: applicant.is_owner_operator,
      OwnerOperatorCompanyName: applicant.owner_operator_company_name,
      OwnerOperatorDOTNumber: applicant.owner_operator_dot_number,
      EmergencyContactName: applicant.emergency_contact_name,
      EmergencyContactPhone: applicant.emergency_contact_number,
      EmergencyContactRelationship: applicant.emergency_contact_relationship,
    };
  }

  /**
   * Map phone number (prioritize cell, then home, then work)
   */
  private static mapPhoneNumber(tenstreetApplicant: TenstreetApplicant): string | undefined {
    const phone = tenstreetApplicant.CellPhone ||
                  tenstreetApplicant.HomePhone ||
                  tenstreetApplicant.WorkPhone;

    return phone ? normalizePhoneNumber(phone) : undefined;
  }

  /**
   * Map CDL class from Tenstreet to DriverFly
   */
  private static mapCDLClass(cdlClass?: string): DriverLicenseType | undefined {
    if (!cdlClass) return undefined;

    const mapped = TENSTREET_CDL_CLASS_MAP[cdlClass.toUpperCase()];
    return mapped ? (mapped as DriverLicenseType) : undefined;
  }

  /**
   * Reverse map CDL class from DriverFly to Tenstreet
   */
  private static reverseCDLClass(licenseType?: DriverLicenseType): string | undefined {
    if (!licenseType) return undefined;

    const reverseMap: Record<string, string> = {
      'CLASS_A': 'A',
      'CLASS_B': 'B',
      'CLASS_C': 'C',
      'NO_CDL': 'NONE',
    };

    return reverseMap[licenseType];
  }

  /**
   * Map endorsements from comma-separated string to array
   */
  private static mapEndorsements(endorsements?: string): DriverEndorsement[] | undefined {
    if (!endorsements) return undefined;

    const endorsementCodes = endorsements.split(',').map(e => e.trim().toUpperCase());
    const mapped: DriverEndorsement[] = [];

    for (const code of endorsementCodes) {
      const driverflyEndorsement = TENSTREET_ENDORSEMENT_MAP[code];
      if (driverflyEndorsement) {
        mapped.push(driverflyEndorsement as DriverEndorsement);
      }
    }

    return mapped.length > 0 ? mapped : undefined;
  }

  /**
   * Map restrictions from comma-separated string to array
   */
  private static mapRestrictions(restrictions?: string): LicenseRestrictions[] | undefined {
    if (!restrictions) return undefined;

    const restrictionCodes = restrictions.split(',').map(r => r.trim().toUpperCase());
    const mapped: LicenseRestrictions[] = [];

    for (const code of restrictionCodes) {
      const driverflyRestriction = TENSTREET_RESTRICTION_MAP[code];
      if (driverflyRestriction) {
        mapped.push(driverflyRestriction as LicenseRestrictions);
      }
    }

    return mapped.length > 0 ? mapped : undefined;
  }

  /**
   * Map drug test result
   */
  private static mapDrugTestResult(result?: string): boolean {
    if (!result) return true; // Default to true if not specified
    return result.toLowerCase() === 'pass';
  }

  /**
   * Map application status
   */
  private static mapStatus(status?: string): ApplicantStatus | undefined {
    if (!status) return undefined;

    const mapped = TENSTREET_STATUS_MAP[status];
    return mapped ? (mapped as ApplicantStatus) : undefined;
  }

  /**
   * Parse date string to ISO format
   */
  private static parseDate(dateString?: string): string | undefined {
    if (!dateString) return undefined;

    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? undefined : date.toISOString();
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return undefined;
    }
  }

  /**
   * Remove undefined values from object
   */
  private static removeUndefinedValues<T extends Record<string, any>>(obj: T): Partial<T> {
    const result: Partial<T> = {};

    for (const key in obj) {
      if (obj[key] !== undefined) {
        result[key] = obj[key];
      }
    }

    return result;
  }
}
