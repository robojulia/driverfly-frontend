import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { Speedometer2, PeopleFill, GraphUp } from 'react-bootstrap-icons';

const AutoRecruitingDashboard = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Auto Recruiting Dashboard</h2>
          <p className="text-muted mb-0">Monitor your automated driver recruitment performance</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="text-center py-5">
        <div className="mb-4">
          <Speedometer2 size={64} className="text-muted mb-3" />
          <h4>Auto Recruiting is Active</h4>
          <p className="text-muted mb-4">
            Your auto recruiting system is running. We&apos;re actively finding qualified drivers
            from other companies and adding them to your applicant pool.
          </p>
        </div>

        {/* Quick Stats Placeholders */}
        <div className="row justify-content-center">
          <div className="col-md-4 mb-3">
            <Card className="text-center border-0 bg-light">
              <CardBody>
                <PeopleFill size={32} className="text-primary mb-2" />
                <h5 className="mb-1">0</h5>
                <small className="text-muted">Drivers Added This Week</small>
              </CardBody>
            </Card>
          </div>
          <div className="col-md-4 mb-3">
            <Card className="text-center border-0 bg-light">
              <CardBody>
                <GraphUp size={32} className="text-success mb-2" />
                <h5 className="mb-1">0%</h5>
                <small className="text-muted">Success Rate</small>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-muted">
            <strong>Coming Soon:</strong> Detailed analytics, performance metrics, and campaign
            management tools.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutoRecruitingDashboard;
