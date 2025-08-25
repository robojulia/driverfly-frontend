import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Accordion, Alert, Button, Card, Col, Row } from 'react-bootstrap';
import {
  CheckCircleFill,
  ExclamationTriangleFill,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'react-bootstrap-icons';

interface ApplicantEligibilityHeaderProps {
  eligibility: {
    isEligible: boolean;
    ineligibilityReasons?: string[];
  } | null;
}

export const ApplicantEligibilityHeader: React.FC<ApplicantEligibilityHeaderProps> = ({
  eligibility,
}) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!eligibility) {
    return null;
  }

  const handleViewPreferences = () => {
    router.push('/dashboard/company/company-preferences');
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Row className="mb-4">
      <Col>
        <Card className="border-0 shadow-sm">
          <Card.Header
            className="bg-light border-0 d-flex align-items-center justify-content-between"
            style={{ cursor: 'pointer' }}
            onClick={toggleExpanded}
          >
            <div className="d-flex align-items-center">
              <Sliders className="me-2 text-primary" size={20} />
              <h5 className="mb-0 fw-semibold">Eligibility</h5>
              {eligibility.isEligible ? (
                <CheckCircleFill className="ms-2 text-success" size={16} />
              ) : (
                <ExclamationTriangleFill className="ms-2 text-danger" size={16} />
              )}
            </div>
            <div className="d-flex align-items-center">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewPreferences();
                }}
                className="d-flex align-items-center me-2"
              >
                <Sliders className="me-1" size={14} />
                View Preferences
              </Button>
              {isExpanded ? (
                <ChevronUp className="text-muted" size={20} />
              ) : (
                <ChevronDown className="text-muted" size={20} />
              )}
            </div>
          </Card.Header>
          {isExpanded && (
            <Card.Body>
              {eligibility.isEligible ? (
                <Alert variant="success" className="d-flex align-items-center mb-0">
                  <CheckCircleFill className="me-2" size={20} />
                  <div>
                    <strong>Eligible</strong>
                    <div className="small text-success-emphasis mt-1">
                      This applicant meets all of your company&apos;s hiring criteria.
                    </div>
                  </div>
                </Alert>
              ) : (
                <Alert variant="danger" className="mb-0">
                  <div className="d-flex align-items-start">
                    <ExclamationTriangleFill className="me-2 mt-1 text-danger" size={20} />
                    <div className="flex-grow-1">
                      <strong>Not Eligible</strong>
                      <div className="small text-danger-emphasis mt-1 mb-2">
                        This applicant does not meet the following company requirements:
                      </div>
                      <ul className="mb-0 small">
                        {eligibility.ineligibilityReasons?.map((reason: string, index: number) => (
                          <li key={index} className="mb-1">
                            {reason === 'cdl_class' && 'CDL Class requirement not met'}
                            {reason === 'years_cdl_experience' &&
                              'Insufficient years of CDL experience'}
                            {reason === 'maximum_accidents' &&
                              'Exceeds maximum accident history limit'}
                            {reason === 'maximum_moving_violations' &&
                              'Exceeds maximum moving violations limit'}
                            {reason === 'employment_type' && 'Employment type preference mismatch'}
                            {reason === 'job_geography' &&
                              'Location preference does not match company geography'}
                            {![
                              'cdl_class',
                              'years_cdl_experience',
                              'maximum_accidents',
                              'maximum_moving_violations',
                              'employment_type',
                              'job_geography',
                            ].includes(reason) && reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Alert>
              )}
            </Card.Body>
          )}
        </Card>
      </Col>
    </Row>
  );
};
