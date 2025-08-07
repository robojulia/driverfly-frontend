import React, { useState } from 'react';
import { Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Speedometer2, PeopleFill, GraphUp, ExclamationTriangleFill } from 'react-bootstrap-icons';

interface AutoRecruitingDashboardProps {
  onDisable?: () => Promise<void>;
}

const AutoRecruitingDashboard: React.FC<AutoRecruitingDashboardProps> = ({ onDisable }) => {
  const [showOptOutModal, setShowOptOutModal] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);

  const handleOptOut = async () => {
    if (!onDisable) return;

    setIsDisabling(true);
    try {
      await onDisable();
      setShowOptOutModal(false);
    } catch (error) {
      console.error('Error disabling auto-recruiting:', error);
    } finally {
      setIsDisabling(false);
    }
  };
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

        {/* Opt-out Link */}
        <div className="mt-5 pt-4 border-top">
          <button
            type="button"
            className="btn btn-link text-muted p-0"
            style={{ fontSize: '0.875rem', textDecoration: 'none' }}
            onClick={() => setShowOptOutModal(true)}
          >
            Disable Auto Recruiting
          </button>
        </div>
      </div>

      {/* Opt-out Confirmation Modal */}
      <Modal isOpen={showOptOutModal} toggle={() => setShowOptOutModal(false)} size="md">
        <ModalHeader toggle={() => setShowOptOutModal(false)}>
          <ExclamationTriangleFill className="text-warning me-2" />
          Disable Auto Recruiting
        </ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <h5>Are you sure you want to disable Auto Recruiting?</h5>
            <p className="text-muted mb-3">
              Disabling Auto Recruiting will stop the automatic addition of qualified drivers to
              your applicant pool.
            </p>

            <div className="alert alert-warning">
              <strong>This means you will:</strong>
              <ul className="mb-0 mt-2">
                <li>Stop receiving auto-recruited driver applications</li>
                <li>Miss out on qualified candidates from other companies</li>
                <li>Reduce your driver pipeline significantly</li>
                <li>Need to rely solely on direct applications</li>
              </ul>
            </div>

            <p className="small text-muted">
              You can always re-enable Auto Recruiting later, but you&apos;ll miss potential
              candidates in the meantime.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => setShowOptOutModal(false)}
            disabled={isDisabling}
          >
            Keep Auto Recruiting
          </Button>
          <Button color="danger" onClick={handleOptOut} disabled={isDisabling}>
            {isDisabling ? 'Disabling...' : 'Yes, Disable Auto Recruiting'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AutoRecruitingDashboard;
