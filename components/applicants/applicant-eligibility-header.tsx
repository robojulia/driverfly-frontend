import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Accordion, Alert, Button, Card, Col, Row } from 'react-bootstrap';
import {
  CheckCircleFill,
  ExclamationTriangleFill,
  QuestionCircleFill,
  Sliders,
} from 'react-bootstrap-icons';

interface ApplicantEligibilityHeaderProps {
  eligibility: {
    isEligible: boolean;
    ineligibilityReasons?: string[];
    isProvisional?: boolean;
    unconfiguredPreferences?: string[];
  } | null;
}

export const ApplicantEligibilityHeader: React.FC<ApplicantEligibilityHeaderProps> = ({
  eligibility,
}) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!eligibility) {
    return null;
  }

  const handleViewPreferences = () => {
    router.push('/dashboard/company/company-preferences');
  };

  // Determine the status and icon to show
  const getEligibilityStatus = () => {
    if (eligibility.isProvisional) {
      return {
        status: 'provisional',
        icon: <QuestionCircleFill className="ms-2 text-warning" size={16} />,
        variant: 'warning',
      };
    } else if (eligibility.isEligible) {
      return {
        status: 'eligible',
        icon: <CheckCircleFill className="ms-2 text-success" size={16} />,
        variant: 'success',
      };
    } else {
      return {
        status: 'not-eligible',
        icon: <ExclamationTriangleFill className="ms-2 text-danger" size={16} />,
        variant: 'danger',
      };
    }
  };

  const statusInfo = getEligibilityStatus();

  const formatPreferenceName = (preference: string): string => {
    switch (preference) {
      case 'cdl_class':
        return 'CDL Class Requirements';
      case 'employment_type':
        return 'Employment Type Preferences';
      case 'years_cdl_experience':
        return 'CDL Experience Requirements';
      case 'maximum_accidents':
        return 'Maximum Accident History';
      case 'maximum_moving_violations':
        return 'Maximum Moving Violations';
      case 'job_geography':
        return 'Job Geography Preferences';
      default:
        return preference.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  return (
    <Row className="mb-4">
      <Col>
        <Card className="border-0 shadow-sm">
          <Card.Header
            className="bg-light border-0 d-flex align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center">
              <Sliders className="me-2 text-primary" size={20} />
              <h5 className="mb-0 fw-semibold">Eligibility</h5>
              {statusInfo.icon}
            </div>
            <div className="d-flex align-items-center">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleViewPreferences}
                className="d-flex align-items-center"
              >
                <Sliders className="me-1" size={14} />
                View Preferences
              </Button>
            </div>
          </Card.Header>
          {isExpanded && (
            <Card.Body>
              {eligibility.isProvisional ? (
                <Alert variant="warning" className="d-flex align-items-center mb-0">
                  <QuestionCircleFill className="me-2" size={20} />
                  <div>
                    <strong>Provisional</strong>
                    <div className="small text-warning-emphasis mt-1 mb-2">
                      {eligibility.unconfiguredPreferences?.includes('all_preferences') ? (
                        <>
                          Complete eligibility cannot be determined because your company has not
                          configured any hiring preferences yet.
                        </>
                      ) : (
                        <>
                          Complete eligibility cannot be determined because some company preferences
                          are not configured:
                          <ul className="mb-2 small mt-2">
                            {eligibility.unconfiguredPreferences?.map(
                              (preference: string, index: number) => (
                                <li key={index} className="mb-1">
                                  {formatPreferenceName(preference)}
                                </li>
                              )
                            )}
                          </ul>
                        </>
                      )}
                    </div>
                    <div className="small text-warning-emphasis">
                      {eligibility.unconfiguredPreferences?.includes('all_preferences')
                        ? 'Set up your hiring preferences to get accurate eligibility assessments.'
                        : 'Configure these preferences to get a complete eligibility assessment.'}
                    </div>
                  </div>
                </Alert>
              ) : eligibility.isEligible ? (
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
