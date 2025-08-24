import React from 'react';
import { Card } from 'react-bootstrap';
import { ToggleOn, InfoCircleFill } from 'react-bootstrap-icons';
import BaseCheck from '../forms/base-check';

interface SystemPreferencesProps {
  autoVoeEnabled: boolean;
  onAutoVoeChange: (enabled: boolean) => void;
  onAutoVoeInfoClick: () => void;
  loading?: boolean;
}

export const SystemPreferences: React.FC<SystemPreferencesProps> = ({
  autoVoeEnabled,
  onAutoVoeChange,
  onAutoVoeInfoClick,
  loading = false,
}) => {
  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center mb-3">
          <ToggleOn className="me-2 text-primary" size={24} />
          <h5 className="mb-0">System Preferences</h5>
        </div>

        <div className="d-flex align-items-center justify-content-between p-3 border rounded">
          <div className="flex-grow-1">
            <p className="mb-1 fw-medium">Automate VOE Requests to Past Employees</p>
            <p className="text-muted small mb-0">
              Automatically request verification of employment from previous employers
            </p>
            <button
              type="button"
              className="btn btn-link p-0 text-primary small mt-1"
              onClick={onAutoVoeInfoClick}
            >
              <InfoCircleFill className="me-1" size={14} />
              Learn More
            </button>
          </div>
          <BaseCheck
            className="ms-3"
            checked={autoVoeEnabled}
            onChange={(e) => onAutoVoeChange(e.target.checked)}
            disabled={loading}
          />
        </div>
      </Card.Body>
    </Card>
  );
};
