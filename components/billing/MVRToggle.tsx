import React, { useState } from 'react';
import { Card, Form, Button, Modal } from 'react-bootstrap';
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
  const [pendingState, setPendingState] = useState(false);

  const handleToggleClick = (checked: boolean) => {
    if (checked && !enabled) {
      // Show confirmation when enabling
      setPendingState(true);
      setShowConfirmation(true);
    } else {
      // Disable immediately
      onToggle(false);
    }
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    await onToggle(true);
    setPendingState(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingState(false);
  };

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <h5 className="mb-2">MVR Record Pulling</h5>
              <p className="text-muted mb-3">
                Automatically pull Motor Vehicle Records for your applicants.
                Records are charged as they are pulled.
              </p>
              <div className="alert alert-info mb-0">
                <strong>Pricing:</strong> ${MVR_RECORD_PRICE} per record
                <br />
                <small className="text-muted">
                  MVR checks are charged as they are pulled. Records pulled this
                  month will appear on next month's invoice.
                </small>
              </div>
            </div>
            <div className="ms-3 d-flex flex-column align-items-end">
              <Form.Check
                type="switch"
                id="mvr-toggle"
                checked={enabled}
                onChange={(e) => handleToggleClick(e.target.checked)}
                disabled={loading}
                label=""
                style={{ transform: 'scale(1.2)' }}
              />
              <small className="mt-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                {enabled ? 'Enabled' : 'Disabled'}
              </small>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showConfirmation} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Enable MVR Record Pulling</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Terms & Conditions</h6>
          <p>By enabling MVR Record Pulling, you agree to the following:</p>
          <ul>
            <li>
              MVR (Motor Vehicle Record) checks will be automatically pulled for
              qualified applicants
            </li>
            <li>
              You will be charged <strong>${MVR_RECORD_PRICE} per record</strong>{' '}
              pulled
            </li>
            <li>Records pulled this month will appear on next month's invoice</li>
            <li>
              You can disable this feature at any time through this billing page
            </li>
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
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={loading}>
            I Agree - Enable MVR Pulling
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
