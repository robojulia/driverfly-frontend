import * as yup from 'yup';
import { SyncStatus, SyncType } from '../../enums/integrations/sync-status.enum';
import { SyncDirection } from '../../enums/integrations/sync-direction.enum';
import { UserEntity } from '../user/user.entity';
import { IntegrationConnectionEntity } from './integration-connection.entity';

export class IntegrationSyncLogEntity {
  id?: number;
  connection?: IntegrationConnectionEntity;
  connectionId?: number;

  syncType?: SyncType;
  direction?: SyncDirection;

  status?: SyncStatus;

  // Statistics
  totalRecords?: number;
  processedRecords?: number;
  successfulRecords?: number;
  failedRecords?: number;
  skippedRecords?: number;

  // Error tracking
  errors?: Array<SyncError>;

  // Timing
  startedAt?: Date;
  completedAt?: Date;
  durationMs?: number;

  // Metadata
  triggeredBy?: 'MANUAL' | 'SCHEDULED' | 'WEBHOOK' | 'CAMPAIGN';
  triggeredByUser?: UserEntity;
  triggeredByUserId?: number;
  metadata?: Record<string, any>;

  static yupSchema(t: (key: string) => string) {
    return yup.object({
      connectionId: yup.number().required(t('CONNECTION_REQUIRED')),
      syncType: yup
        .mixed<SyncType>()
        .oneOf(Object.values(SyncType))
        .required(t('SYNC_TYPE_REQUIRED')),
      direction: yup
        .mixed<SyncDirection>()
        .oneOf(Object.values(SyncDirection))
        .required(t('DIRECTION_REQUIRED')),
      status: yup
        .mixed<SyncStatus>()
        .oneOf(Object.values(SyncStatus))
        .default(SyncStatus.PENDING),
      totalRecords: yup.number().min(0).default(0),
      processedRecords: yup.number().min(0).default(0),
      successfulRecords: yup.number().min(0).default(0),
      failedRecords: yup.number().min(0).default(0),
      skippedRecords: yup.number().min(0).default(0),
      triggeredBy: yup.string().oneOf(['MANUAL', 'SCHEDULED', 'WEBHOOK', 'CAMPAIGN']),
    });
  }
}

export interface SyncError {
  recordId?: string;
  errorMessage: string;
  stackTrace?: string;
  timestamp?: Date;
}

export interface SyncLogQuery {
  connectionId?: number;
  syncType?: SyncType;
  status?: SyncStatus;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
