import React from 'react';
import { Card, CardBody, CardHeader, Badge } from 'reactstrap';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignType } from '../../enums/campaigns/campaign-type.enum';
import { useTranslation } from '../../hooks/use-translation';

interface CampaignConfigDisplayProps {
  campaign: CampaignEntity;
}

export const CampaignConfigDisplay: React.FC<CampaignConfigDisplayProps> = ({ campaign }) => {
  const { t } = useTranslation();

  const renderJobReachoutConfig = (config: any) => {
    return (
      <div>
        <h6 className="mb-3">
          {t('REIGNITE_PAST_LEADS_CAMPAIGN')} {t('CURRENT_SETTINGS')}
        </h6>

        <div className="row">
          <div className="col-md-6">
            <dl className="row">
              {config.jobId && (
                <>
                  <dt className="col-sm-5">Job ID:</dt>
                  <dd className="col-sm-7">{config.jobId}</dd>
                </>
              )}

              {config.includePhoneCalls !== undefined && (
                <>
                  <dt className="col-sm-5">Phone Calls:</dt>
                  <dd className="col-sm-7">
                    <Badge color={config.includePhoneCalls ? 'success' : 'secondary'}>
                      {config.includePhoneCalls ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </dd>
                </>
              )}

              {config.includeSms !== undefined && (
                <>
                  <dt className="col-sm-5">SMS Messages:</dt>
                  <dd className="col-sm-7">
                    <Badge color={config.includeSms ? 'success' : 'secondary'}>
                      {config.includeSms ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </dd>
                </>
              )}

              {config.maxAttempts && (
                <>
                  <dt className="col-sm-5">Max Attempts:</dt>
                  <dd className="col-sm-7">{config.maxAttempts}</dd>
                </>
              )}
            </dl>
          </div>

          <div className="col-md-6">
            <dl className="row">
              {config.eligibilityCriteria && (
                <>
                  <dt className="col-sm-5">Eligibility:</dt>
                  <dd className="col-sm-7">
                    <ul className="list-unstyled mb-0">
                      {config.eligibilityCriteria.cdlRequired !== undefined && (
                        <li>
                          <small>
                            CDL Required: {config.eligibilityCriteria.cdlRequired ? 'Yes' : 'No'}
                          </small>
                        </li>
                      )}
                      {config.eligibilityCriteria.minExperience && (
                        <li>
                          <small>
                            Min Experience: {config.eligibilityCriteria.minExperience} years
                          </small>
                        </li>
                      )}
                      {config.eligibilityCriteria.maxViolations && (
                        <li>
                          <small>Max Violations: {config.eligibilityCriteria.maxViolations}</small>
                        </li>
                      )}
                    </ul>
                  </dd>
                </>
              )}

              {config.schedule && (
                <>
                  <dt className="col-sm-5">Schedule:</dt>
                  <dd className="col-sm-7">
                    <small>
                      {config.schedule.startTime} - {config.schedule.endTime}
                      <br />
                      {config.schedule.timezone}
                    </small>
                  </dd>
                </>
              )}
            </dl>
          </div>
        </div>

        {config.messageTemplate && (
          <div className="mt-3">
            <h6>Message Template:</h6>
            <div className="bg-light p-3 rounded">
              <small className="text-muted">SMS Template:</small>
              <p className="mb-2 font-weight-medium">{config.messageTemplate.sms}</p>

              {config.messageTemplate.phoneScript && (
                <>
                  <small className="text-muted">Phone Script:</small>
                  <p className="mb-0 font-weight-medium">{config.messageTemplate.phoneScript}</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGeneralConfig = (config: any) => {
    return (
      <div>
        <h6 className="mb-3">{t('CAMPAIGN_CONFIGURATION')}</h6>
        <pre className="bg-light p-3 rounded">{JSON.stringify(config, null, 2)}</pre>
      </div>
    );
  };

  if (!campaign.config || Object.keys(campaign.config).length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-3">
            <p className="text-muted mb-0">{t('CAMPAIGN_SETTINGS_DESCRIPTION')}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        {campaign.type === CampaignType.REIGNITE_PAST_LEADS
          ? renderJobReachoutConfig(campaign.config)
          : renderGeneralConfig(campaign.config)}
      </CardBody>
    </Card>
  );
};
