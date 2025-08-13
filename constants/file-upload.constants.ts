/**
 * File Upload Size Limits
 * All sizes are in bytes
 */

// Helper function to convert MB to bytes
const MB_TO_BYTES = (mb: number): number => mb * 1024 * 1024;

export const FILE_SIZE_LIMITS = {
  // Document upload limits
  DRIVER_LICENSE: MB_TO_BYTES(6), // 6MB = 6,291,456 bytes
  MEDICAL_CARD: MB_TO_BYTES(6), // 6MB = 6,291,456 bytes
  GENERAL_DOCUMENT: MB_TO_BYTES(3), // 3MB = 3,145,728 bytes
  COMPANY_DOCUMENT: MB_TO_BYTES(5), // 5MB = 5,242,880 bytes

  // Legacy/fallback limit
  DEFAULT: MB_TO_BYTES(3), // 3MB = 3,145,728 bytes
} as const;

// Export individual constants for convenience
export const DRIVER_LICENSE_SIZE_LIMIT = FILE_SIZE_LIMITS.DRIVER_LICENSE;
export const MEDICAL_CARD_SIZE_LIMIT = FILE_SIZE_LIMITS.MEDICAL_CARD;
export const GENERAL_DOCUMENT_SIZE_LIMIT = FILE_SIZE_LIMITS.GENERAL_DOCUMENT;
export const COMPANY_DOCUMENT_SIZE_LIMIT = FILE_SIZE_LIMITS.COMPANY_DOCUMENT;
export const DEFAULT_FILE_SIZE_LIMIT = FILE_SIZE_LIMITS.DEFAULT;

// Helper function to format file size for display
export const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return `${mb}MB`;
};

// Helper to get file size limit description
export const getFileSizeLimitDescription = (bytes: number): string => {
  return `Maximum file size: ${formatFileSize(bytes)}`;
};
