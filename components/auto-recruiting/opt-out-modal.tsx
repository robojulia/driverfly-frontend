import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';

interface OptOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDisabling: boolean;
}

const OptOutModal: React.FC<OptOutModalProps> = ({ isOpen, onClose, onConfirm, isDisabling }) => {
  return (
    <Modal isOpen={isOpen} toggle={onClose} size="md">
      <ModalHeader toggle={onClose}>
        <ExclamationTriangleFill className="text-warning me-2" />
        Disable Auto Recruiting
      </ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <h5>Are you sure you want to disable Auto Recruiting?</h5>
          <p className="text-muted mb-3">
            Disabling Auto Recruiting will stop the automatic addition of qualified drivers to your
            applicant pool.
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
        <Button color="secondary" onClick={onClose} disabled={isDisabling}>
          Keep Auto Recruiting
        </Button>
        <Button color="danger" onClick={onConfirm} disabled={isDisabling}>
          {isDisabling ? 'Disabling...' : 'Yes, Disable Auto Recruiting'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OptOutModal;
