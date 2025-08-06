import React from 'react';
import { Card, CardBody, Row, Col, Badge } from 'reactstrap';
import { ArrowDown, Clock, Shield, GeoAlt, Award } from 'react-bootstrap-icons';

const ProcessFlow = () => {
  const flowSteps = [
    {
      title: 'Driver Applies Elsewhere',
      description: 'A CDL driver completes a full application at another company',
      detail: 'All the important information',
      icon: Clock,
    },
    {
      title: 'Application Gets Rejected',
      description: "The driver doesn't get hired due to various reasons",
      detail: 'Not necessarily due to qualifications',
      icon: Shield,
    },
    {
      title: 'Smart Matching',
      description: 'Our system finds this driver and checks against your jobs',
      detail: 'License type, experience, location, preferences',
      icon: GeoAlt,
    },
    {
      title: 'Automatic Addition',
      description: 'Driver is added to your applicant pool with full application data',
      detail: 'Complete employment history, violations, preferences',
      icon: Award,
    },
  ];

  return (
    <Card className="border-0 shadow-sm mb-4">
      <CardBody className="p-5">
        <div className="text-center mb-5">
          <h2 className="mb-3">The Complete Process</h2>
          <p className="lead text-muted">From missed opportunity to your next great hire</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            {flowSteps.map((step, index) => (
              <div key={index}>
                <div className="d-flex align-items-start mb-4">
                  <div
                    className="d-flex align-items-center justify-content-center bg-white border border-primary border-2 rounded-circle me-4 flex-shrink-0 shadow-sm"
                    style={{ width: '60px', height: '60px' }}
                  >
                    <step.icon size={28} className="text-primary" />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <h5 className="mb-0 me-3">{step.title}</h5>
                      <Badge color="secondary" className="small">
                        Step {index + 1}
                      </Badge>
                    </div>
                    <p className="text-muted mb-1">{step.description}</p>
                    <small className="text-primary">
                      <strong>{step.detail}</strong>
                    </small>
                  </div>
                </div>

                {index < flowSteps.length - 1 && (
                  <div className="text-center mb-4">
                    <ArrowDown size={24} className="text-muted" />
                  </div>
                )}
              </div>
            ))}
          </Col>
        </Row>

        <div className="text-center mt-5">
          <div className="alert alert-primary">
            <strong>Privacy Protected:</strong> All driver information is handled with complete
            confidentiality and in compliance with employment laws.
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProcessFlow;
