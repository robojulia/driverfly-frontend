import React from 'react';
import { Row, Col, Alert, Button } from 'reactstrap';
import { TelephoneFill, ChatDotsFill, People, CheckLg } from 'react-bootstrap-icons';

import { CampaignEntity } from '../../../models/campaigns/campaign.entity';
import { CampaignCommunicationType } from '../../../enums/campaigns/campaign-communication-type.enum';
import { UserEntity } from '../../../models/user/user.entity';

interface CampaignTestViewProps {
  campaign: CampaignEntity;
  user: UserEntity | null;
  addingTestTarget: boolean;
  sendingTest: boolean;
  testSent: boolean;
  testError: string | null;
  isCurrentUserTestTarget: () => boolean;
  getUserPhoneNumber: () => string;
  hasPhoneNumber: () => boolean;
  handleAddTestTarget: () => Promise<void>;
  handleSendTest: () => Promise<void>;
}

export const CampaignTestView: React.FC<CampaignTestViewProps> = ({
  campaign,
  user,
  addingTestTarget,
  sendingTest,
  testSent,
  testError,
  isCurrentUserTestTarget,
  getUserPhoneNumber,
  hasPhoneNumber,
  handleAddTestTarget,
  handleSendTest,
}) => {
  return (
    <Row className="mt-4">
      <Col>
        <div className="bg-light rounded p-3">
          <h6 className="fw-semibold text-dark mb-3">
            <TelephoneFill className="me-2" />
            Test Campaign
          </h6>

          {testError && (
            <Alert color="danger" className="mb-3">
              {testError}
            </Alert>
          )}

          {testSent && (
            <Alert color="success" className="mb-3">
              Test campaign sent successfully to {getUserPhoneNumber()}!
            </Alert>
          )}

          <p className="text-muted mb-3">
            Test this campaign by adding yourself as a target and sending a test message.
          </p>

          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="flex-grow-1">
              <strong>Your Phone Number:</strong>{' '}
              <span className={hasPhoneNumber() ? 'text-success' : 'text-danger'}>
                {getUserPhoneNumber()}
              </span>
              {!hasPhoneNumber() && (
                <small className="d-block text-danger">
                  Please add a phone number to your profile to test campaigns.
                </small>
              )}
            </div>
          </div>

          <div className="d-flex gap-2 align-items-center">
            {!isCurrentUserTestTarget() ? (
              <Button
                color="primary"
                size="sm"
                onClick={handleAddTestTarget}
                disabled={addingTestTarget || !hasPhoneNumber()}
              >
                {addingTestTarget ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-1" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Adding Test Target...
                  </>
                ) : (
                  <>
                    <People size={14} className="me-1" />
                    Add Myself as Test Target
                  </>
                )}
              </Button>
            ) : (
              <>
                <div className="d-flex align-items-center text-success me-3">
                  <CheckLg size={16} className="me-1" />
                  <small>You are added as a test target</small>
                </div>
                <Button
                  color="success"
                  size="sm"
                  onClick={handleSendTest}
                  disabled={sendingTest || !hasPhoneNumber()}
                >
                  {sendingTest ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-1" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Sending Test...
                    </>
                  ) : (
                    <>
                      {campaign.communicationType === CampaignCommunicationType.SMS ? (
                        <ChatDotsFill size={14} className="me-1" />
                      ) : (
                        <TelephoneFill size={14} className="me-1" />
                      )}
                      Send Test{' '}
                      {campaign.communicationType === CampaignCommunicationType.SMS
                        ? 'SMS'
                        : 'Call'}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          <div className="mt-3">
            <small className="text-muted">
              <strong>Note:</strong> Test campaigns will be sent to your phone number (
              {getUserPhoneNumber()}) and will not affect campaign statistics or completion status.
            </small>
          </div>
        </div>
      </Col>
    </Row>
  );
};
