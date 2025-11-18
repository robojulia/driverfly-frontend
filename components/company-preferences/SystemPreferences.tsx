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
    <Card className="border-0 shadow-sm mb-4" style={{ background: 'white' }}>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1" style={{ color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>
              System Preferences
            </h5>
            <p className="mb-0 small" style={{ color: '#718096' }}>
              Automate Verification of Employment (VOE) requests to past employers
            </p>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="small" style={{ color: autoVoeEnabled ? '#1a202c' : '#718096', fontWeight: '500' }}>
              {autoVoeEnabled ? 'Active' : 'Disabled'}
            </span>
            <BaseCheck
              checked={autoVoeEnabled}
              onChange={(e) => onAutoVoeChange(e.target.checked)}
              disabled={loading}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
