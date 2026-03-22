import React, { useState } from 'react';
import { Card, Button, Badge, Modal } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';
import { MVR_RECORD_PRICE } from '../../config/billing/plans.config';

interface MVRToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => Promise<void>;
  loading?: boolean;
}

export function MVRToggle({ enabled, onToggle, loading }: MVRToggleProps) {
  const { t } = useTranslation();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleActivateClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    await onToggle(true);
  };

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-2">
              <h5 className="mb-0">MVR Record Pulling</h5>
              {enabled && <Badge bg="success">Active</Badge>}
            </div>
            <p className="text-muted mb-3">
              Enable users to pull Motor Vehicle Records for your applicants and
              employees. Records are charged as they are pulled.
            </p>
            <div className="alert alert-info mb-3">
              <strong>Pricing:</strong> ${MVR_RECORD_PRICE} per record
              <br />
              <small className="text-muted">
                Records pulled this month will appear on next month's invoice.
              </small>
            </div>
            {!enabled && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleActivateClick}
                disabled={loading}
              >
                Activate
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Activate MVR Record Pulling</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Terms & Conditions</h6>
          <p>
            By activating MVR Record Pulling, you agree to the following:
          </p>
          <ul>
            <li>
              Each Motor Vehicle Record pulled will be charged at{' '}
              <strong>${MVR_RECORD_PRICE} per record</strong>
            </li>
            <li>Records pulled this month will appear on next month's invoice</li>
            <li>You can deactivate MVR Record Pulling at any time from the billing overview</li>
          </ul>
          <p className="text-muted small">
            For full terms and conditions, please see our{' '}
            <a href="/terms" target="_blank">
              Terms of Service
            </a>
            .
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={loading}
          >
            I Agree - Activate
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
