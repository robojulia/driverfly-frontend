/**
 * Converts an enum value to proper case without underscores
 * Example: "TRACTOR_TRAILER" -> "Tractor Trailer"
 */
export const formatEnumValue = (value: string): string => {
    if (!value) return '';

    return value
        .split('_')
        .map(word => {
            // Handle special cases
            if (word.toLowerCase() === 'cdl') return 'CDL';
            if (word.toLowerCase() === 'dot') return 'DOT';
            if (word.toLowerCase() === 'dui') return 'DUI';
            if (word.toLowerCase() === 'w2') return 'W2';
            if (word.toLowerCase() === 'usa') return 'USA';

            // Convert to proper case: first letter uppercase, rest lowercase
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
};

/**
 * Formats an array of enum values
 */
export const formatEnumValues = (values: string[]): string => {
    if (!values || values.length === 0) return '';
    return values.map(formatEnumValue).join(', ');
};
