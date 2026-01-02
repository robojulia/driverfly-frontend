import { BasicEntity } from '../BasicEntity.entity';
import { CampaignTargetType } from '../../enums/campaigns/campaign-target-type.enum';
import { ATSProvider } from '../../enums/integrations/ats-provider.enum';
import { ATSActivityExportStatus } from '../../enums/integrations/sync-status.enum';

export interface CampaignTargetEntity extends BasicEntity {
  campaignId: number;
  targetType: CampaignTargetType;
  targetId: number;

  // Contact information (from target entity at campaign creation)
  name?: string;
  email?: string;
  phone?: string;

  // Status derived from processed field
  status: string; // 'pending' | 'delivered' etc.

  // Eligibility score at campaign creation
  eligibilityScore?: number;

  // Processing details
  processed: boolean;
  failed: boolean;
  processedAt?: Date;

  // Test target flag
  isTest?: boolean;

  // Additional metadata
  metadata?: Record<string, any>;

  // ATS Integration fields
  sourceATS?: ATSProvider; // Which ATS this applicant came from
  exportedToATS?: boolean;
  exportedToATSAt?: Date;
  atsActivityExportStatus?: ATSActivityExportStatus;
}
