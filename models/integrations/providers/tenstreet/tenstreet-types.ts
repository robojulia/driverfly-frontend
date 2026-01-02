/**
 * Tenstreet API Type Definitions
 * Based on Tenstreet API v1 documentation
 */

export interface TenstreetApplicant {
  PersonId: string;
  FirstName: string;
  LastName: string;
  MiddleName?: string;
  EmailAddress?: string;
  HomePhone?: string;
  CellPhone?: string;
  WorkPhone?: string;
  DateOfBirth?: string;
  SSN?: string;

  // Address
  AddressLine1?: string;
  AddressLine2?: string;
  City?: string;
  State?: string;
  ZipCode?: string;
  Country?: string;

  // CDL Information
  CDLNumber?: string;
  CDLExpirationDate?: string;
  CDLState?: string;
  CDLClassCode?: string; // 'A', 'B', 'C'
  CDLEndorsements?: string; // Comma-separated: 'H,N,T,P'
  CDLRestrictions?: string; // Comma-separated: 'E,L,Z'
  YearsExperience?: number;

  // Employment
  IsOwnerOperator?: boolean;
  OwnerOperatorCompanyName?: string;
  OwnerOperatorDOTNumber?: string;

  // Safety & Background
  DrugTestResult?: string; // 'Pass', 'Fail', 'Pending'
  AccidentCount?: number;
  ViolationCount?: number;
  MovingViolationCount?: number;
  HasDUI?: boolean;
  DUIYears?: string[];
  CriminalHistory?: string;
  LicenseRevoked?: boolean;
  LicenseRevokedDetails?: string;

  // Emergency Contact
  EmergencyContactName?: string;
  EmergencyContactPhone?: string;
  EmergencyContactRelationship?: string;

  // Application Status
  ApplicationStatus?: string; // 'Applied', 'Screening', 'Interview', 'Hired', 'Rejected'
  ApplicationDate?: string;
  HireDate?: string;

  // Metadata
  CreatedDate?: string;
  ModifiedDate?: string;
  IsActive?: boolean;

  // Custom fields (flexible for company-specific fields)
  CustomFields?: Record<string, any>;
}

export interface TenstreetApplicantsResponse {
  applicants: TenstreetApplicant[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface TenstreetWebhookPayload {
  eventType: 'applicant.created' | 'applicant.updated' | 'applicant.deleted' | 'applicant.status_changed';
  eventId: string;
  timestamp: string;
  companyId?: string;
  customerId?: string;
  data: TenstreetApplicant;
}

export interface TenstreetNote {
  noteId?: string;
  personId: string;
  noteType: 'OUTREACH' | 'GENERAL' | 'INTERVIEW' | 'FOLLOW_UP';
  noteText: string;
  createdBy: string;
  createdDate?: string;
  category?: string;
}

export interface TenstreetCreateNoteRequest {
  noteType: string;
  noteText: string;
  createdBy: string;
  category?: string;
}

export interface TenstreetErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface TenstreetApiConfig {
  baseUrl: string;
  apiKey: string;
  apiSecret?: string;
  timeout?: number;
}

// CDL Class mapping
export const TENSTREET_CDL_CLASS_MAP: Record<string, string> = {
  'A': 'CLASS_A',
  'B': 'CLASS_B',
  'C': 'CLASS_C',
  'NONE': 'NO_CDL',
  '': 'NO_CDL',
};

// Endorsement mapping
export const TENSTREET_ENDORSEMENT_MAP: Record<string, string> = {
  'H': 'HAZMAT',
  'N': 'TANKER',
  'T': 'DOUBLE_TRIPLE',
  'P': 'PASSENGER',
  'S': 'SCHOOL_BUS',
  'X': 'HAZMAT_TANKER', // Combination of H+N
};

// Restriction mapping
export const TENSTREET_RESTRICTION_MAP: Record<string, string> = {
  'E': 'NO_MANUAL',
  'L': 'NO_AIR_BRAKES',
  'Z': 'NO_FULL_AIR_BRAKES',
  'K': 'INTRASTATE_ONLY',
  'M': 'NO_CLASS_A_PASSENGER',
  'N': 'NO_CLASS_A_B_PASSENGER',
  'O': 'NO_TRACTOR_TRAILER',
};

// Status mapping
export const TENSTREET_STATUS_MAP: Record<string, string> = {
  'Applied': 'APPLICATION_RECEIVED',
  'Screening': 'UNDER_REVIEW',
  'Interview': 'INTERVIEW_SCHEDULED',
  'Hired': 'HIRED',
  'Rejected': 'REJECTED',
  'Withdrawn': 'WITHDRAWN',
  'On Hold': 'ON_HOLD',
  'Background Check': 'BACKGROUND_CHECK',
  'Drug Test': 'DRUG_TEST',
  'Pending': 'PENDING',
};
