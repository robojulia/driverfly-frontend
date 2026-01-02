import React from 'react';
import { Alert } from 'react-bootstrap';
import { ExclamationTriangleFill, XCircleFill } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/use-translation';
import { getLicenseExpirationWarning } from '../../utils/license-expiration-warning';

export interface LicenseExpirationAlertProps {
  expiryDate: string | Date | null | undefined;
  className?: string;
}

/**
 * Displays a warning alert for license expiration
 * - Red alert for expired licenses
 * - Yellow alert for licenses expiring within 30 days
 * - No alert for valid licenses
 */
export function LicenseExpirationAlert({
  expiryDate,
  className = '',
}: LicenseExpirationAlertProps) {
  const { t } = useTranslation();
  const warning = getLicenseExpirationWarning(expiryDate);

  if (!warning || !warning.variant) {
    return null;
  }

  const Icon = warning.variant === 'danger' ? XCircleFill : ExclamationTriangleFill;

  return (
    <Alert
      variant={warning.variant}
      className={`mb-2 py-2 px-3 d-flex align-items-center ${className}`}
      style={{ fontSize: '0.875rem' }}
    >
      <Icon className="me-2" size={16} />
      <span>
        {t(warning.message)}
        {warning.daysUntilExpiry !== undefined && warning.daysUntilExpiry < 0 && (
          <span className="ms-1">
            ({Math.abs(warning.daysUntilExpiry)} {Math.abs(warning.daysUntilExpiry) === 1 ? 'day' : 'days'} ago)
          </span>
        )}
        {warning.daysUntilExpiry !== undefined && warning.daysUntilExpiry >= 0 && warning.daysUntilExpiry <= 30 && (
          <span className="ms-1">
            ({warning.daysUntilExpiry} {warning.daysUntilExpiry === 1 ? 'day' : 'days'} remaining)
          </span>
        )}
      </span>
    </Alert>
  );
}
