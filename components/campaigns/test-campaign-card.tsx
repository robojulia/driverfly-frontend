import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Alert, Badge, Row, Col, Spinner } from 'reactstrap';
import { Play, CheckCircle, XCircle, Phone, ChatDots } from 'react-bootstrap-icons';
import { useUserContext } from '../../context/user-context';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignCommunicationType } from '../../enums/campaigns/campaign-communication-type.enum';
import { CampaignStatus } from '../../enums/campaigns/campaign-status.enum';
import CampaignsApi from '../../pages/api/campaigns';

interface TestCampaignCardProps {
  campaign: CampaignEntity;
  onTestSent?: () => void;
}

export const TestCampaignCard: React.FC<TestCampaignCardProps> = ({ campaign, onTestSent }) => {
  const { t } = useTranslation();
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [testTargetId, setTestTargetId] = useState<number | null>(null);
  const [testSent, setTestSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const campaignsApi = new CampaignsApi();

  // Get user's phone number for display
  const userPhoneNumber = user?.contact_number || user?.cell_number;
  const communicationType = campaign.communicationType || CampaignCommunicationType.VOICE;

  const handleAddTestUser = async () => {
    if (!campaign.id) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const result = await campaignsApi.addTestUserToCampaign(campaign.id);
      setTestTargetId(result.testTargetId);
      setSuccess('You have been added as a test target for this campaign.');
    } catch (err: any) {
      console.error('Error adding test user:', err);
      setError(err.response?.data?.message || 'Failed to add test user to campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    if (!campaign.id) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const result = await campaignsApi.sendTestCampaign(campaign.id);

      if (result.status === 'sent') {
        setTestSent(true);
        setSuccess(
          `Test ${
            communicationType === CampaignCommunicationType.SMS ? 'SMS' : 'call'
          } sent successfully to ${userPhoneNumber}`
        );
        onTestSent?.();
      } else {
        setError(result.message || 'Failed to send test campaign');
      }
    } catch (err: any) {
      console.error('Error sending test campaign:', err);
      setError(err.response?.data?.message || 'Failed to send test campaign');
    } finally {
      setLoading(false);
    }
  };

  // Don't show for completed or cancelled campaigns
  if (
    campaign.status === CampaignStatus.COMPLETED ||
    campaign.status === CampaignStatus.CANCELLED
  ) {
    return null;
  }

  return (
    <Card className="border-info bg-light">
      <CardHeader className="bg-info text-white">
        <div className="d-flex align-items-center">
          {communicationType === CampaignCommunicationType.SMS ? (
            <ChatDots size={18} className="me-2" />
          ) : (
            <Phone size={18} className="me-2" />
          )}
          <h6 className="mb-0">Test Campaign</h6>
        </div>
      </CardHeader>
      <CardBody>
        <div className="mb-3">
          <p className="text-muted mb-2">
            Test this campaign by sending a{' '}
            {communicationType === CampaignCommunicationType.SMS ? 'SMS' : 'call'} to yourself.
          </p>

          {userPhoneNumber ? (
            <div className="d-flex align-items-center mb-2">
              <Badge color="secondary" className="me-2">
                Your Phone
              </Badge>
              <span className="fw-medium">{userPhoneNumber}</span>
            </div>
          ) : (
            <Alert color="warning" className="mb-3">
              <small>
                <strong>No phone number found.</strong> Please update your profile with a contact
                number to test campaigns.
              </small>
            </Alert>
          )}
        </div>

        {error && (
          <Alert color="danger" className="mb-3">
            <XCircle size={16} className="me-2" />
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="success" className="mb-3">
            <CheckCircle size={16} className="me-2" />
            {success}
          </Alert>
        )}

        <Row>
          <Col>
            {!testTargetId ? (
              <Button
                color="info"
                size="sm"
                onClick={handleAddTestUser}
                disabled={loading || !userPhoneNumber}
                block
              >
                {loading && <Spinner size="sm" className="me-2" />}
                Add Myself as Test Target
              </Button>
            ) : testSent ? (
              <div className="text-center">
                <CheckCircle size={24} className="text-success mb-2" />
                <p className="text-success fw-medium mb-2">Test Sent!</p>
                <Button
                  color="outline-info"
                  size="sm"
                  onClick={handleSendTest}
                  disabled={loading || !userPhoneNumber}
                >
                  {loading && <Spinner size="sm" className="me-2" />}
                  Send Another Test
                </Button>
              </div>
            ) : (
              <Button
                color="success"
                size="sm"
                onClick={handleSendTest}
                disabled={loading || !userPhoneNumber}
                block
              >
                {loading && <Spinner size="sm" className="me-2" />}
                <Play size={14} className="me-1" />
                Send Test {communicationType === CampaignCommunicationType.SMS ? 'SMS' : 'Call'}
              </Button>
            )}
          </Col>
        </Row>

        <div className="mt-3">
          <small className="text-muted">
            <strong>Note:</strong> Test{' '}
            {communicationType === CampaignCommunicationType.SMS ? 'messages' : 'calls'} do not
            affect campaign statistics and are used only for testing purposes.
          </small>
        </div>
      </CardBody>
    </Card>
  );
};
