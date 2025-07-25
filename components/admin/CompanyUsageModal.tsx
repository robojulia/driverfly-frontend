import React from 'react';
import { Modal, Badge, Card, Row, Col, ProgressBar } from 'react-bootstrap';
import {
  BarChart,
  Building,
  TelephoneFill,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Bullseye,
  Send,
} from 'react-bootstrap-icons';
import { CompanyWithPhoneNumber, CompanyUsageData } from '../../pages/api/companies';

interface CompanyUsageModalProps {
  show: boolean;
  onHide: () => void;
  company: CompanyWithPhoneNumber | null;
}

const CompanyUsageModal: React.FC<CompanyUsageModalProps> = ({ show, onHide, company }) => {
  if (!company || !company.usage) {
    return (
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <BarChart className="me-2" />
            Company Usage - {company?.name || 'Unknown'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-4">
            <XCircle className="text-muted mb-3" size={48} />
            <h5 className="text-muted">No Usage Data Available</h5>
            <p className="text-muted">
              Usage metrics are not available for this company. This could be because:
            </p>
            <ul className="text-start text-muted">
              <li>The company has not created any campaigns yet</li>
              <li>Usage tracking is not enabled for this company</li>
              <li>Data is still being processed</li>
            </ul>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  const usage = company.usage;
  const targetProcessingRate =
    usage.targets.totalTargets > 0
      ? (usage.targets.processedTargets / usage.targets.totalTargets) * 100
      : 0;

  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (count: number, total: number, variant: string) => {
    const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
    return (
      <Badge bg={variant} className="ms-2">
        {count} ({percentage}%)
      </Badge>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <BarChart className="me-2" />
          Usage Analytics - {company.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Company Overview */}
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">
              <Building className="me-2" />
              Company Overview
            </h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="d-flex align-items-center mb-2">
                  <strong>Company:</strong>
                  <span className="ms-2">{company.name}</span>
                  {company.slug && (
                    <Badge bg="secondary" className="ms-2">
                      {company.slug}
                    </Badge>
                  )}
                </div>
                {company.parent && (
                  <div className="d-flex align-items-center mb-2">
                    <strong>Parent Company:</strong>
                    <span className="ms-2">{company.parent.name}</span>
                  </div>
                )}
              </Col>
              <Col md={6}>
                <div className="d-flex align-items-center mb-2">
                  <strong>Status:</strong>
                  <Badge
                    bg={
                      company.disabled
                        ? 'danger'
                        : company.status === 'active'
                        ? 'success'
                        : 'secondary'
                    }
                    className="ms-2"
                  >
                    {company.disabled ? 'Disabled' : company.status || 'Unknown'}
                  </Badge>
                </div>
                <div className="d-flex align-items-center">
                  <strong>Last Updated:</strong>
                  <span className="ms-2 text-muted">{formatDate(usage.lastUpdated)}</span>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row>
          {/* Campaign Metrics */}
          <Col lg={6}>
            <Card className="mb-4">
              <Card.Header>
                <h6 className="mb-0">
                  <Send className="me-2" />
                  Campaign Metrics
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold">Total Campaigns</span>
                    <Badge bg="primary" pill>
                      {usage.campaigns.totalCampaigns}
                    </Badge>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>Draft Campaigns</span>
                    {getStatusBadge(
                      usage.campaigns.draftCampaigns,
                      usage.campaigns.totalCampaigns,
                      'secondary'
                    )}
                  </div>
                  <ProgressBar
                    variant="secondary"
                    now={
                      usage.campaigns.totalCampaigns > 0
                        ? (usage.campaigns.draftCampaigns / usage.campaigns.totalCampaigns) * 100
                        : 0
                    }
                    style={{ height: '8px' }}
                  />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>Active Campaigns</span>
                    {getStatusBadge(
                      usage.campaigns.activeCampaigns,
                      usage.campaigns.totalCampaigns,
                      'warning'
                    )}
                  </div>
                  <ProgressBar
                    variant="warning"
                    now={
                      usage.campaigns.totalCampaigns > 0
                        ? (usage.campaigns.activeCampaigns / usage.campaigns.totalCampaigns) * 100
                        : 0
                    }
                    style={{ height: '8px' }}
                  />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>Completed Campaigns</span>
                    {getStatusBadge(
                      usage.campaigns.completedCampaigns,
                      usage.campaigns.totalCampaigns,
                      'success'
                    )}
                  </div>
                  <ProgressBar
                    variant="success"
                    now={
                      usage.campaigns.totalCampaigns > 0
                        ? (usage.campaigns.completedCampaigns / usage.campaigns.totalCampaigns) *
                          100
                        : 0
                    }
                    style={{ height: '8px' }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Target Metrics */}
          <Col lg={6}>
            <Card className="mb-4">
              <Card.Header>
                <h6 className="mb-0">
                  <Bullseye className="me-2" />
                  Target Metrics
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold">Total Targets</span>
                    <Badge bg="info" pill>
                      {usage.targets.totalTargets}
                    </Badge>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>Processed Targets</span>
                    {getStatusBadge(
                      usage.targets.processedTargets,
                      usage.targets.totalTargets,
                      'primary'
                    )}
                  </div>
                  <ProgressBar
                    variant="primary"
                    now={targetProcessingRate}
                    style={{ height: '8px' }}
                  />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>Successful Targets</span>
                    {getStatusBadge(
                      usage.targets.successfulTargets,
                      usage.targets.totalTargets,
                      'success'
                    )}
                  </div>
                  <ProgressBar
                    variant="success"
                    now={
                      usage.targets.totalTargets > 0
                        ? (usage.targets.successfulTargets / usage.targets.totalTargets) * 100
                        : 0
                    }
                    style={{ height: '8px' }}
                  />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>Failed Targets</span>
                    {getStatusBadge(
                      usage.targets.failedTargets,
                      usage.targets.totalTargets,
                      'danger'
                    )}
                  </div>
                  <ProgressBar
                    variant="danger"
                    now={
                      usage.targets.totalTargets > 0
                        ? (usage.targets.failedTargets / usage.targets.totalTargets) * 100
                        : 0
                    }
                    style={{ height: '8px' }}
                  />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>Pending Targets</span>
                    {getStatusBadge(
                      usage.targets.unprocessedTargets,
                      usage.targets.totalTargets,
                      'secondary'
                    )}
                  </div>
                  <ProgressBar
                    variant="secondary"
                    now={
                      usage.targets.totalTargets > 0
                        ? (usage.targets.unprocessedTargets / usage.targets.totalTargets) * 100
                        : 0
                    }
                    style={{ height: '8px' }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Licensing & Cost Assessment */}
        <Card>
          <Card.Header>
            <h6 className="mb-0">
              <Activity className="me-2" />
              Licensing & Cost Assessment
            </h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="text-center p-3 border rounded">
                  <h5 className="text-primary mb-1">{usage.campaigns.totalCampaigns}</h5>
                  <small className="text-muted">Total Campaigns</small>
                </div>
              </Col>
              <Col md={6}>
                <div className="text-center p-3 border rounded">
                  <h5 className="text-info mb-1">{usage.targets.totalTargets}</h5>
                  <small className="text-muted">Total Targets</small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default CompanyUsageModal;
