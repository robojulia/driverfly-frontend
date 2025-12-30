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
 * - Removes all non-numeric characters (including spaces)
 * - Strips leading +1 US country code for consistency
 * - Always returns 10-digit US phone number format: XXXXXXXXXX
 *
 * Examples:
 * - "(123) 456-7890" → "1234567890"
 * - "+1 (123) 456-7890" → "1234567890"
 * - "+1 123-456-7890" → "1234567890"
 * - "123-456-7890" → "1234567890"
 * - "+11234567890" → "1234567890"
 * - "123 456 7890" → "1234567890"
 *
 * @param phone - The phone number to normalize (can be in any format)
 * @returns Normalized phone number string (10 digits for US numbers)
 */
export function normalizePhoneNumber(phone: string | null | undefined): string {
  if (!phone) {
    return '';
  }

  // Convert to string and trim whitespace
  const cleaned = String(phone).trim();

  // Remove all non-numeric characters (including spaces, dashes, parentheses, etc.)
  const digitsOnly = cleaned.replace(/\D/g, '');

  // For US numbers, strip the leading '1' country code if present
  // This ensures "+1 123-456-7890", "+11234567890", and "1234567890" all normalize the same way
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return digitsOnly.substring(1); // Return 10 digits
  }

  // Return the digits as-is (should be 10 digits for US numbers)
  return digitsOnly;
}

/**
 * Checks if two phone numbers are equivalent, accounting for different formats.
 *
 * Examples:
 * - "(123) 456-7890" matches "1234567890" → true
 * - "+1 123-456-7890" matches "1234567890" → true
 * - "1234567890" matches "+11234567890" → true
 * - "+1 (123) 456-7890" matches "123-456-7890" → true
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

  // After normalization, both should be 10-digit US numbers
  // Simple equality check is sufficient
  return normalized1 === normalized2;
}

/**
 * Formats a phone number for display in a human-readable format.
 *
 * Examples:
 * - "1234567890" → "(123) 456-7890"
 * - "+11234567890" → "(123) 456-7890"
 * - "+1 (123) 456-7890" → "(123) 456-7890"
 *
 * @param phone - The phone number to format
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  const normalized = normalizePhoneNumber(phone);

  if (!normalized) {
    return '';
  }

  // After normalization, we should have a 10-digit US number
  if (normalized.length === 10) {
    // US format: (123) 456-7890
    return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`;
  }

  // Return normalized if it's not the expected length
  return normalized;
}

/**
 * Validates if a string looks like a valid phone number.
 *
 * @param phone - The phone number to validate
 * @returns true if the phone number appears valid (10 digits for US numbers)
 */
export function isValidPhoneNumber(phone: string | null | undefined): boolean {
  const normalized = normalizePhoneNumber(phone);

  if (!normalized) {
    return false;
  }

  // Valid US phone number should be exactly 10 digits after normalization
  return normalized.length === 10;
}
