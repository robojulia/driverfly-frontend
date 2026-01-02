import * as yup from 'yup';
import { ATSProvider } from '../../enums/integrations/ats-provider.enum';
import { ApplicantEntity } from '../applicant/applicant.entity';
import { IntegrationConnectionEntity } from './integration-connection.entity';

export class ApplicantMappingEntity {
  id?: number;
  applicant?: ApplicantEntity;
  applicantId?: number;

  connection?: IntegrationConnectionEntity;
  connectionId?: number;
  provider?: ATSProvider;

  externalSystemId?: string; // Tenstreet applicant ID, etc.
  externalSystemUrl?: string; // Direct link to applicant in ATS

  // Sync tracking
  lastSyncedAt?: Date;
  lastInboundSyncAt?: Date;
  lastOutboundSyncAt?: Date;

  // Conflict resolution
  syncConflicts?: Array<SyncConflict>;

  // Metadata
  createdAt?: Date;
  updatedAt?: Date;

  // Status
  isActive?: boolean; // false if deleted in ATS

  static yupSchema(t: (key: string) => string) {
    return yup.object({
      applicantId: yup.number().required(t('APPLICANT_REQUIRED')),
      connectionId: yup.number().required(t('CONNECTION_REQUIRED')),
      provider: yup
        .mixed<ATSProvider>()
        .oneOf(Object.values(ATSProvider))
        .required(t('PROVIDER_REQUIRED')),
      externalSystemId: yup.string().required(t('EXTERNAL_ID_REQUIRED')),
      externalSystemUrl: yup.string().url().nullable(),
      isActive: yup.boolean().default(true),
    });
  }
}

export interface SyncConflict {
  field: string;
  driverflyValue: any;
  atsValue: any;
  resolvedWith: 'DRIVERFLY' | 'ATS' | 'MANUAL';
  resolvedAt: Date;
}

export interface CreateApplicantMappingDto {
  applicantId: number;
  connectionId: number;
  provider: ATSProvider;
  externalSystemId: string;
  externalSystemUrl?: string;
}
