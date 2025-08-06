import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { CheckCircle, Search, PersonPlus, Speedometer2 } from 'react-bootstrap-icons';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Search,
      title: 'Smart Discovery',
      description:
        'Our system continuously scans for qualified drivers who have completed full applications at other companies.',
    },
    {
      icon: CheckCircle,
      title: 'Eligibility Check',
      description:
        'We match drivers against your job requirements, checking license type, experience, location, and qualifications.',
    },
    {
      icon: PersonPlus,
      title: 'Automatic Addition',
      description:
        'Qualified drivers are automatically added to your applicant pool with their complete application data.',
    },
    {
      icon: Speedometer2,
      title: 'Instant Notification',
      description:
        'You receive notifications about new auto-recruited drivers and can begin outreach immediately.',
    },
  ];

  return (
    <Card className="border-0 shadow-sm mb-4">
      <CardBody className="p-5">
        <div className="text-center mb-5">
          <h2 className="mb-3">How Auto Recruiting Works</h2>
          <p className="lead text-muted">
            A seamless, automated process that works 24/7 to find you the best drivers
          </p>
        </div>

        <Row>
          {steps.map((step, index) => (
            <Col md={6} lg={3} key={index} className="mb-4">
              <div className="text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-white border border-primary border-2 rounded-circle mb-3 shadow-sm"
                  style={{ width: '80px', height: '80px' }}
                >
                  <step.icon size={36} className="text-primary" />
                </div>
                <h5 className="mb-2">{step.title}</h5>
                <p className="text-muted small">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className="d-none d-lg-block position-absolute"
                  style={{
                    top: '40px',
                    right: '-50px',
                    width: '100px',
                    height: '2px',
                    backgroundColor: '#e9ecef',
                    zIndex: 1,
                  }}
                />
              )}
            </Col>
          ))}
        </Row>
      </CardBody>
    </Card>
  );
};

export default HowItWorksSection;
