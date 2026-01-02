import * as yup from 'yup';
import { CampaignEntity } from './campaign.entity';
import { IntegrationConnectionEntity } from '../integrations/integration-connection.entity';

export class CampaignIntegrationEntity {
  id?: number;
  campaign?: CampaignEntity;
  campaignId?: number;

  connection?: IntegrationConnectionEntity;
  connectionId?: number;

  // Export configuration
  exportTargetsToATS?: boolean;
  exportActivitiesToATS?: boolean;

  // Export status
  lastExportAt?: Date;
  activitiesExported?: number;
  activitiesPending?: number;

  createdAt?: Date;
  updatedAt?: Date;

  static yupSchema(t: (key: string) => string) {
    return yup.object({
      campaignId: yup.number().required(t('CAMPAIGN_REQUIRED')),
      connectionId: yup.number().required(t('CONNECTION_REQUIRED')),
      exportTargetsToATS: yup.boolean().default(false),
      exportActivitiesToATS: yup.boolean().default(true),
      activitiesExported: yup.number().min(0).default(0),
      activitiesPending: yup.number().min(0).default(0),
    });
  }
}
