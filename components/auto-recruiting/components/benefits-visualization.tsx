import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { XCircle, CheckCircle, ArrowRight, Building, PersonFill } from 'react-bootstrap-icons';

const BenefitsVisualization = () => {
  return (
    <Card className="border-0 shadow-sm mb-4">
      <CardBody className="p-5">
        <div className="text-center mb-5">
          <h2 className="mb-3">The Auto Recruiting Advantage</h2>
          <p className="lead text-muted">
            See how Auto Recruiting transforms missed opportunities into new hires
          </p>
        </div>

        <Row className="align-items-center">
          {/* Without Auto Recruiting */}
          <Col lg={5}>
            <Card className="border border-danger border-2 bg-white">
              <CardBody className="text-center p-4">
                <XCircle size={48} className="text-danger mb-3" />
                <h5 className="text-dark mb-3">Without Auto Recruiting</h5>

                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="text-center">
                    <PersonFill size={32} className="text-dark mb-2" />
                    <small className="d-block text-dark">Qualified Driver</small>
                  </div>
                  <ArrowRight size={20} className="text-dark" />
                  <div className="text-center">
                    <Building size={32} className="text-dark mb-2" />
                    <small className="d-block text-dark">Company A</small>
                  </div>
                </div>

                <div className="alert alert-danger py-2 mb-3">
                  <small>
                    <strong>REJECTED</strong> - Not a good fit
                  </small>
                </div>

                <p className="text-dark small mb-0">
                  Driver goes elsewhere. You never see this qualified candidate who might be perfect
                  for your jobs.
                </p>
              </CardBody>
            </Card>
          </Col>

          {/* Arrow */}
          <Col lg={2} className="text-center">
            <div className="d-none d-lg-block">
              <ArrowRight size={32} className="text-primary" />
              <small className="d-block text-primary mt-2">
                <strong>ENABLE</strong>
              </small>
            </div>
          </Col>

          {/* With Auto Recruiting */}
          <Col lg={5}>
            <Card className="border border-success border-2 bg-white">
              <CardBody className="text-center p-4">
                <CheckCircle size={48} className="text-success mb-3" />
                <h5 className="text-dark mb-3">With Auto Recruiting</h5>

                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="text-center">
                    <PersonFill size={32} className="text-dark mb-2" />
                    <small className="d-block text-dark">Same Driver</small>
                  </div>
                  <ArrowRight size={20} className="text-success" />
                  <div className="text-center">
                    <Building size={32} className="text-primary mb-2" />
                    <small className="d-block text-dark">Your Company</small>
                  </div>
                </div>

                <div className="alert alert-success py-2 mb-3">
                  <small>
                    <strong>AUTO-ADDED</strong> - Great match!
                  </small>
                </div>

                <p className="text-dark small mb-0">
                  Driver is automatically added to your applicant pool. You can reach out
                  immediately and potentially hire them.
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-4">
          <div className="alert alert-info d-inline-block">
            <strong>Result:</strong> Access to 3-5x more qualified candidates without any additional
            effort
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default BenefitsVisualization;
