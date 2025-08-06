/**
 * Formats a date into a human-readable string
 * @param date The date to format
 * @returns Formatted date string in the format "MMM D, YYYY"
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return 'N/A';

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Invalid Date';
  }
};

export function dateRange(
  start_at: Date | string,
  end_at: Date | string,
  default_end_at: Date | string
) {
  if (start_at && typeof start_at == 'string') start_at = new Date(start_at);
  if (end_at && typeof end_at == 'string') end_at = new Date(end_at);

  if (start_at && end_at) return `${start_at.toString()} - ${end_at.toString()}`;

  if (start_at && default_end_at) return `${start_at.toString()} - ${default_end_at.toString()}`;

  if (start_at) return `${start_at.toString()}`;

  return null;
}

export function calculateAge(birthday: Date | string): number | undefined {
  // birthday is a date
  if (!birthday) return;

  if (typeof birthday == 'string') birthday = new Date(birthday);

  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch

  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function isExpired(dateString: Date | string | null): boolean {
  // If no expiry date is provided (null), the job never expires
  if (!dateString) return false;
  
  const givenDate = new Date(dateString);
  const currentDate = new Date();

  return givenDate < currentDate;
}

export const isBirthdayThisWeek = (birthdateStr: Date | string): boolean => {
  const today = new Date();
  const birthday = new Date(birthdateStr);
  birthday.setFullYear(today.getFullYear());

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay())); // Sunday

  return birthday >= startOfWeek && birthday <= endOfWeek;
};
