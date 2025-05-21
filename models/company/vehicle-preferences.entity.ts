import * as Yup from 'yup';
import { InspectionFrequency } from '../../enums/vehicles/inspection-frequency.enum';

export class VehiclePreferencesEntity {
  id?: number;
  vehicle_id?: number;
  inspection_frequency?: InspectionFrequency;
  safety_inspection_reminder_days?: number;
  maintenance_inspection_reminder_days?: number;
  additional_email_recipients?: string;
  created_at?: Date;
  updated_at?: Date;

  static yupSchema() {
    return Yup.object().shape({
      inspection_frequency: Yup.string()
        .required('Inspection frequency is required')
        .oneOf(['MONTH', 'QUARTER', 'ANNUAL'], 'Invalid inspection frequency'),
      /*
      safety_inspection_reminder_days: Yup.number()
        .transform((value) => (isNaN(value) || value === null ? undefined : value))
        .nullable()
        .min(0),
      maintenance_inspection_reminder_days: Yup.number()
        .transform((value) => (isNaN(value) || value === null ? undefined : value))
        .nullable()
        .min(0),
      additional_email_recipients: Yup.string()
        .nullable()
        .transform((value) => (value === null ? undefined : value)),
      */
    });
  }
}
