import { BasicEntity } from '../BasicEntity.entity';
import { CampaignTargetType } from '../../enums/campaigns/campaign-target-type.enum';
import { ATSProvider } from '../../enums/integrations/ats-provider.enum';
import { ATSActivityExportStatus } from '../../enums/integrations/sync-status.enum';

/**
 * AI-generated campaign call summary
 * Contains the summarized results and outcome assessment from the AI voice/SMS agent
 */
export interface CampaignCallSummary {
  /** AI-generated summary of the conversation (2-3 sentences) */
  summary: string;
  /** Key points extracted from the conversation */
  keyPoints: string[];
  /** Overall outcome assessment of the conversation */
  outcome: 'positive' | 'negative' | 'neutral' | 'unclear';
  /** Confidence level of the outcome assessment */
  confidence: 'high' | 'medium' | 'low';
  /** Recommended follow-up actions */
  recommendedActions?: string[];
  /** Metadata about the summary generation */
  metadata?: {
    generatedAt?: string;
    conversationLength?: number;
    tokensUsed?: number;
  };
}

/**
 * Campaign target metadata including AI-generated results
 */
export interface CampaignTargetMetadata {
  /** Extracted entities from the conversation */
  entities?: Record<string, any>;
  /** Call metadata (duration, status, etc.) */
  callMetadata?: Record<string, any>;
  /** Overall call outcome */
  outcome?: 'success' | 'failure';
  /** Reason for the outcome */
  outcomeReason?: string;
  /** AI-generated campaign call summary */
  campaignCallSummary?: CampaignCallSummary;
  /** Eligibility status at time of campaign creation */
  eligibilityStatus?: string;
  /** Eligibility score at time of campaign creation */
  eligibilityScore?: number;
  /** When the target was added */
  addedAt?: string;
  /** Whether target was added manually */
  addedManually?: boolean;
  /** For test targets: name */
  name?: string;
  /** For test targets: email */
  email?: string;
  /** For test targets: phone */
  phone?: string;
}

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

  // Additional metadata including AI-generated results
  metadata?: CampaignTargetMetadata;

  // ATS Integration fields
  sourceATS?: ATSProvider; // Which ATS this applicant came from
  exportedToATS?: boolean;
  exportedToATSAt?: Date;
  atsActivityExportStatus?: ATSActivityExportStatus;
}
