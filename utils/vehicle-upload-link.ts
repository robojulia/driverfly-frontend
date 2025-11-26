/**
 * Utility functions for generating and managing vehicle document upload links
 */

import VehicleUploadTokenApi from '../pages/api/vehicle-upload-token';
import { DocumentReminderType } from '../enums/vehicles/document-reminder-type.enum';
import { VehicleEntity } from '../models/company/vehicle.entity';
import { EmployeeEntity } from '../models/employee/employee.entity';

export interface GenerateUploadLinkParams {
  vehicle: VehicleEntity;
  documentType: DocumentReminderType;
  driver?: EmployeeEntity | null;
  expirationDays?: number;
}

/**
 * Generate a secure upload link for a driver to upload vehicle documents
 * @param params - Parameters for generating the upload link
 * @returns The full upload URL that can be sent to the driver
 */
export async function generateVehicleUploadLink(
  params: GenerateUploadLinkParams
): Promise<string> {
  const { vehicle, documentType, driver, expirationDays = 30 } = params;

  if (!vehicle.id) {
    throw new Error('Vehicle ID is required to generate upload link');
  }

  const api = new VehicleUploadTokenApi();

  // Generate the token
  const tokenEntity = await api.generateToken(vehicle.id, documentType, {
    name: driver ? `${driver.first_name} ${driver.last_name}` : undefined,
    email: driver?.email,
    phone: driver?.phone,
  });

  // Construct the upload URL
  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const uploadUrl = `${baseUrl}/upload/vehicle-document/${tokenEntity.token}`;

  return uploadUrl;
}

/**
 * Generate upload links for all configured document types for a vehicle
 * @param vehicle - The vehicle entity
 * @param driver - The assigned driver (optional)
 * @param documentTypes - Array of document types to generate links for
 * @returns Object mapping document types to their upload URLs
 */
export async function generateMultipleUploadLinks(
  vehicle: VehicleEntity,
  driver?: EmployeeEntity | null,
  documentTypes: DocumentReminderType[] = [
    DocumentReminderType.SAFETY_INSPECTION,
    DocumentReminderType.MAINTENANCE_REPORT,
  ]
): Promise<Record<DocumentReminderType, string>> {
  const links: Record<string, string> = {};

  for (const docType of documentTypes) {
    try {
      const link = await generateVehicleUploadLink({
        vehicle,
        documentType: docType,
        driver,
      });
      links[docType] = link;
    } catch (error) {
      console.error(`Error generating upload link for ${docType}:`, error);
    }
  }

  return links;
}

/**
 * Format a message for email/SMS with the upload link
 * @param params - Parameters for formatting the message
 * @returns Formatted message with upload link
 */
export function formatUploadLinkMessage(params: {
  driverName?: string;
  vehicleInfo: string;
  documentType: DocumentReminderType;
  uploadLink: string;
  companyName?: string;
}): { emailBody: string; smsBody: string } {
  const { driverName, vehicleInfo, documentType, uploadLink, companyName } = params;

  const greeting = driverName ? `Hi ${driverName},` : 'Hello,';
  const company = companyName || 'your fleet manager';

  const docTypeLabel =
    documentType === DocumentReminderType.SAFETY_INSPECTION
      ? 'safety inspection'
      : documentType === DocumentReminderType.MAINTENANCE_REPORT
      ? 'maintenance report'
      : 'document';

  // Email body (can be more detailed)
  const emailBody = `${greeting}

This is a reminder that the ${docTypeLabel} is due for ${vehicleInfo}.

Please upload the required documentation using the secure link below:

${uploadLink}

The upload link will remain active for 30 days. No login or account is required - simply click the link and upload your documents.

If you have any questions or issues uploading your documents, please contact ${company}.

Thank you,
${companyName || 'Fleet Management Team'}`;

  // SMS body (must be concise)
  const smsBody = `${greeting} Your ${docTypeLabel} is due for ${vehicleInfo}. Upload here (no login required): ${uploadLink}`;

  return {
    emailBody,
    smsBody,
  };
}

/**
 * Get a user-friendly label for a document type
 */
export function getDocumentTypeLabel(type: DocumentReminderType): string {
  switch (type) {
    case DocumentReminderType.SAFETY_INSPECTION:
      return 'Safety Inspection';
    case DocumentReminderType.MAINTENANCE_REPORT:
      return 'Maintenance Report';
    case DocumentReminderType.OTHER:
      return 'Document';
    default:
      return 'Document';
  }
}
