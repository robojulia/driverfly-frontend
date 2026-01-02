import moment from 'moment';

export enum LicenseExpirationStatus {
  VALID = 'VALID',
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED',
}

export interface LicenseExpirationWarning {
  status: LicenseExpirationStatus;
  message: string;
  variant: 'danger' | 'warning' | null;
  daysUntilExpiry?: number;
}

/**
 * Calculate license expiration status and warning details
 * @param expiryDate - The license expiration date (string or Date)
 * @returns Warning object with status, message, and styling variant
 */
export function getLicenseExpirationWarning(
  expiryDate: string | Date | null | undefined
): LicenseExpirationWarning | null {
  if (!expiryDate) {
    return null;
  }

  const now = moment().startOf('day');
  const expiry = moment(expiryDate).startOf('day');
  const thirtyDaysFromNow = moment().add(30, 'days').startOf('day');

  const daysUntilExpiry = expiry.diff(now, 'days');

  if (expiry.isBefore(now) || expiry.isSame(now)) {
    // Already expired
    return {
      status: LicenseExpirationStatus.EXPIRED,
      message: 'LICENSE_EXPIRED_WARNING',
      variant: 'danger',
      daysUntilExpiry,
    };
  } else if (expiry.isSameOrBefore(thirtyDaysFromNow)) {
    // Expiring within 30 days
    return {
      status: LicenseExpirationStatus.EXPIRING_SOON,
      message: 'LICENSE_EXPIRING_SOON_WARNING',
      variant: 'warning',
      daysUntilExpiry,
    };
  }

  // Valid - no warning needed
  return {
    status: LicenseExpirationStatus.VALID,
    message: '',
    variant: null,
    daysUntilExpiry,
  };
}
