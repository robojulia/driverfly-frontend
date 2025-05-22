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
