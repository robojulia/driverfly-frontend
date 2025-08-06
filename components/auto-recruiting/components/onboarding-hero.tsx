import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { Stars, Lightning, PeopleFill } from 'react-bootstrap-icons';

const OnboardingHero = () => {
  return (
    <Card
      className="border-0 mb-4"
      style={{
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-brand) 100%)',
        color: 'white',
      }}
    >
      <CardBody className="p-5">
        <Row className="align-items-center">
          <Col lg={8}>
            <div className="d-flex align-items-center mb-3">
              <Lightning size={32} className="me-3 text-white" />
              <h1 className="mb-0 text-white">Auto Recruiting</h1>
            </div>
            <h4 className="mb-3 fw-light text-white">
              Automatically expand your driver pool with qualified candidates
            </h4>
            <p className="lead mb-0 text-white" style={{ opacity: 0.9 }}>
              Never miss out on great drivers again. Our Auto Recruiting system automatically
              identifies qualified drivers from other companies and adds them to your applicant pool
              when they match your job requirements.
            </p>
          </Col>
          <Col lg={4} className="text-center">
            <div className="position-relative">
              <PeopleFill size={120} className="text-white" style={{ opacity: 0.25 }} />
              <Stars size={24} className="position-absolute top-0 end-0 text-warning" />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default OnboardingHero;
