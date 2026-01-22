import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Accordion } from 'react-bootstrap';
import {
  TelephoneFill,
  ChatLeftTextFill,
  CheckCircleFill,
  XCircleFill,
  QuestionCircleFill,
  LightbulbFill,
  CalendarEvent,
  Megaphone,
} from 'react-bootstrap-icons';
import { ApplicantEntity } from '../../models/applicant/applicant.entity';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import {
  CampaignTargetEntity,
  CampaignCallSummary,
} from '../../models/campaigns/campaign-target.entity';
import CampaignsApi from '../../pages/api/campaigns';
import { useTranslation } from '../../hooks/use-translation';
import { LoaderIcon } from '../loading/loader-icon';
import { CampaignCommunicationType } from '../../enums/campaigns/campaign-communication-type.enum';

export interface ApplicantCampaignHistoryProps {
  applicant: ApplicantEntity;
}

interface CampaignHistoryItem {
  campaign: CampaignEntity;
  target: CampaignTargetEntity;
}

export function ApplicantCampaignHistory({ applicant }: ApplicantCampaignHistoryProps) {
  const { t } = useTranslation();
  const campaignsApi = new CampaignsApi();

  const [campaignHistory, setCampaignHistory] = useState<CampaignHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<CampaignHistoryItem | null>(null);

  // Fetch campaign history for this applicant
  useEffect(() => {
    const fetchCampaignHistory = async () => {
      if (!applicant?.id) return;

      try {
        setLoading(true);
        setError(null);
        const history = await campaignsApi.findByApplicantId(applicant.id);
        setCampaignHistory(history);
      } catch (err) {
        console.error('Error fetching campaign history:', err);
        setError('Failed to load campaign history');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicant?.id]);

  // Helper to format date
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper to get outcome badge color
  const getOutcomeBadgeColor = (outcome?: string) => {
    switch (outcome) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'danger';
      case 'neutral':
        return 'secondary';
      default:
        return 'warning';
    }
  };

  // Helper to get outcome icon
  const getOutcomeIcon = (outcome?: string) => {
    switch (outcome) {
      case 'positive':
        return <CheckCircleFill className="me-1" />;
      case 'negative':
        return <XCircleFill className="me-1" />;
      default:
        return <QuestionCircleFill className="me-1" />;
    }
  };

  // Helper to get communication type icon
  const getCommunicationIcon = (type?: CampaignCommunicationType) => {
    switch (type) {
      case CampaignCommunicationType.VOICE:
        return <TelephoneFill className="me-2" />;
      case CampaignCommunicationType.SMS:
        return <ChatLeftTextFill className="me-2" />;
      default:
        return <Megaphone className="me-2" />;
    }
  };

  if (loading) {
    return (
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0 fw-bold">
            <Megaphone className="me-2" />
            AI Campaign History
          </h5>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <LoaderIcon />
          <p className="text-muted mt-3">Loading campaign history...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0 fw-bold">
            <Megaphone className="me-2" />
            AI Campaign History
          </h5>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <XCircleFill size={32} className="text-danger mb-3" />
          <p className="text-muted">{error}</p>
        </Card.Body>
      </Card>
    );
  }

  if (campaignHistory.length === 0) {
    return (
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0 fw-bold">
            <Megaphone className="me-2" />
            AI Campaign History
          </h5>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <Megaphone size={32} className="text-muted mb-3" />
          <p className="text-muted mb-0">
            This applicant has not been included in any AI campaigns yet.
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-4">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">
            <Megaphone className="me-2" />
            AI Campaign History
          </h5>
          <Badge bg="primary" pill>
            {campaignHistory.length} campaign{campaignHistory.length !== 1 ? 's' : ''}
          </Badge>
        </Card.Header>
        <Card.Body className="p-0">
          <Accordion flush>
            {campaignHistory.map((item, index) => {
              const summary = item.target.metadata?.campaignCallSummary as
                | CampaignCallSummary
                | undefined;

              return (
                <Accordion.Item eventKey={String(index)} key={item.target.id}>
                  <Accordion.Header>
                    <div className="d-flex align-items-center w-100 me-3">
                      <div className="me-3">
                        {getCommunicationIcon(item.campaign.communicationType)}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{item.campaign.name}</div>
                        <small className="text-muted">
                          <CalendarEvent className="me-1" size={12} />
                          {formatDate(item.target.processedAt || item.target.createdAt)}
                        </small>
                      </div>
                      <div className="d-flex gap-2 me-3">
                        <Badge bg={item.target.failed ? 'danger' : 'success'}>
                          {item.target.failed ? 'Failed' : 'Delivered'}
                        </Badge>
                        {summary && (
                          <Badge bg={getOutcomeBadgeColor(summary.outcome)}>
                            {getOutcomeIcon(summary.outcome)}
                            {summary.outcome?.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    {summary ? (
                      <>
                        {/* AI Summary */}
                        <div className="mb-4">
                          <h6 className="fw-semibold text-muted mb-2">
                            <LightbulbFill className="me-2 text-warning" />
                            AI Summary
                          </h6>
                          <div className="bg-light p-3 rounded border">
                            <p className="mb-0">{summary.summary}</p>
                          </div>
                        </div>

                        {/* Key Points */}
                        {summary.keyPoints?.length > 0 && (
                          <div className="mb-4">
                            <h6 className="fw-semibold text-muted mb-2">Key Points</h6>
                            <ul className="mb-0">
                              {summary.keyPoints.map((point, idx) => (
                                <li key={idx} className="mb-1">
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Recommended Actions */}
                        {summary.recommendedActions?.length > 0 && (
                          <div className="mb-4">
                            <h6 className="fw-semibold text-muted mb-2">Recommended Actions</h6>
                            <ul className="mb-0">
                              {summary.recommendedActions.map((action, idx) => (
                                <li key={idx} className="mb-1 text-primary">
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Confidence */}
                        <div className="d-flex gap-3 align-items-center text-muted small">
                          <span>
                            Confidence:{' '}
                            <Badge
                              bg={
                                summary.confidence === 'high'
                                  ? 'success'
                                  : summary.confidence === 'medium'
                                  ? 'warning'
                                  : 'secondary'
                              }
                            >
                              {summary.confidence?.toUpperCase()}
                            </Badge>
                          </span>
                          {summary.metadata?.generatedAt && (
                            <span>Generated: {formatDate(summary.metadata.generatedAt)}</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-3">
                        <QuestionCircleFill size={24} className="text-muted mb-2" />
                        <p className="text-muted mb-0 small">
                          No AI summary available for this campaign.
                        </p>
                        {item.target.metadata?.outcome && (
                          <p className="mt-2 mb-0">
                            <strong>Outcome:</strong> {item.target.metadata.outcome}
                            {item.target.metadata.outcomeReason &&
                              ` (${item.target.metadata.outcomeReason})`}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Campaign Details */}
                    <div className="border-top pt-3 mt-3">
                      <Row className="text-muted small">
                        <Col md={4}>
                          <strong>Campaign:</strong> {item.campaign.name}
                        </Col>
                        <Col md={4}>
                          <strong>Type:</strong>{' '}
                          {item.campaign.communicationType?.toUpperCase() || 'N/A'}
                        </Col>
                        <Col md={4}>
                          <strong>Status:</strong>{' '}
                          <Badge bg="secondary">{item.campaign.status?.toUpperCase()}</Badge>
                        </Col>
                      </Row>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </Card.Body>
      </Card>
    </>
  );
}

export default ApplicantCampaignHistory;
