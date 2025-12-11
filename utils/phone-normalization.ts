/**
 * Phone Number Normalization Utility
 *
 * Ensures consistent phone number format across the application to prevent
 * lookup failures when phone numbers are stored/entered in different formats.
 */

/**
 * Normalizes a phone number to a consistent format for storage and lookup.
 *
 * Rules:
 * - Removes all non-numeric characters except leading +
 * - Preserves country code if present (starts with +)
 * - Returns normalized format: +1XXXXXXXXXX or XXXXXXXXXX
 *
 * Examples:
 * - "(123) 456-7890" → "1234567890"
 * - "+1 (123) 456-7890" → "+11234567890"
 * - "123-456-7890" → "1234567890"
 * - "+1-123-456-7890" → "+11234567890"
 * - "123 456 7890" → "1234567890"
 *
 * @param phone - The phone number to normalize (can be in any format)
 * @returns Normalized phone number string
 */
export function normalizePhoneNumber(phone: string | null | undefined): string {
  if (!phone) {
    return '';
  }

  // Convert to string and trim whitespace
  const cleaned = String(phone).trim();

  // Check if it starts with +
  const hasCountryCode = cleaned.startsWith('+');

  // Remove all non-numeric characters
  const digitsOnly = cleaned.replace(/\D/g, '');

  // Return with + prefix if original had it
  return hasCountryCode ? `+${digitsOnly}` : digitsOnly;
}

/**
 * Checks if two phone numbers are equivalent, accounting for different formats.
 *
 * Examples:
 * - "(123) 456-7890" matches "1234567890" → true
 * - "+1 123-456-7890" matches "1234567890" → true
 * - "1234567890" matches "+11234567890" → true
 *
 * @param phone1 - First phone number
 * @param phone2 - Second phone number
 * @returns true if the phone numbers match after normalization
 */
export function phoneNumbersMatch(
  phone1: string | null | undefined,
  phone2: string | null | undefined
): boolean {
  const normalized1 = normalizePhoneNumber(phone1);
  const normalized2 = normalizePhoneNumber(phone2);

  if (!normalized1 || !normalized2) {
    return false;
  }

  // Remove + from both for comparison (handles +1XXXXX vs XXXXX)
  const digits1 = normalized1.replace('+', '');
  const digits2 = normalized2.replace('+', '');

  // Check if they're exactly equal
  if (digits1 === digits2) {
    return true;
  }

  // Handle US country code (1) being present or absent
  // +11234567890 should match 1234567890
  if (digits1.startsWith('1') && digits1.substring(1) === digits2) {
    return true;
  }
  if (digits2.startsWith('1') && digits2.substring(1) === digits1) {
    return true;
  }

  return false;
}

/**
 * Formats a phone number for display in a human-readable format.
 *
 * Examples:
 * - "1234567890" → "(123) 456-7890"
 * - "+11234567890" → "+1 (123) 456-7890"
 *
 * @param phone - The phone number to format
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  const normalized = normalizePhoneNumber(phone);

  if (!normalized) {
    return '';
  }

  // Remove + for processing
  const hasPlus = normalized.startsWith('+');
  const digits = normalized.replace('+', '');

  // Handle different lengths
  if (digits.length === 10) {
    // US format: (123) 456-7890
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // US with country code: +1 (123) 456-7890
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  } else if (hasPlus) {
    // International format with country code
    return `+${digits}`;
  }

  // Return normalized if we can't format it
  return normalized;
}

/**
 * Validates if a string looks like a valid phone number.
 *
 * @param phone - The phone number to validate
 * @returns true if the phone number appears valid
 */
export function isValidPhoneNumber(phone: string | null | undefined): boolean {
  const normalized = normalizePhoneNumber(phone);

  if (!normalized) {
    return false;
  }

  // Remove + for digit counting
  const digits = normalized.replace('+', '');

  // Must have at least 10 digits (US) or up to 15 (international max)
  return digits.length >= 10 && digits.length <= 15;
}
