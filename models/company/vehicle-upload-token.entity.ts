import * as Yup from 'yup';
import { DocumentReminderType } from '../../enums/vehicles/document-reminder-type.enum';

export class VehicleUploadTokenEntity {
  id?: number;
  token?: string;
  vehicle_id?: number;
  document_type?: DocumentReminderType;
  driver_name?: string;
  driver_email?: string;
  driver_phone?: string;
  expires_at?: Date;
  used_at?: Date;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;

  // Relationships
  vehicle?: any; // Will be populated with VehicleEntity when needed
  uploaded_documents?: any[]; // Documents uploaded using this token

  static yupSchema() {
    return Yup.object().shape({
      vehicle_id: Yup.number().required('Vehicle is required'),
      document_type: Yup.string()
        .required('Document type is required')
        .oneOf(Object.values(DocumentReminderType), 'Invalid document type'),
      driver_name: Yup.string().nullable(),
      driver_email: Yup.string().email('Invalid email').nullable(),
      driver_phone: Yup.string().nullable(),
      expires_at: Yup.date().required('Expiration date is required'),
    });
  }
}
