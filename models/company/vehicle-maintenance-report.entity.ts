import * as Yup from 'yup';
import { DocumentEntity } from '../documents/document.entity';

export enum MaintenanceType {
  OIL_CHANGE = 'Oil Change',
  TIRE_ROTATION = 'Tire Rotation',
  BRAKE_SERVICE = 'Brake Service',
  TRANSMISSION_SERVICE = 'Transmission Service',
  ENGINE_TUNE_UP = 'Engine Tune-Up',
  COOLANT_FLUSH = 'Coolant Flush',
  BATTERY_REPLACEMENT = 'Battery Replacement',
  AIR_FILTER = 'Air Filter',
  INSPECTION = 'Inspection',
  OTHER = 'Other',
}

export class VehicleMaintenanceReportEntity {
  id?: number;
  maintenance_date?: Date;
  maintenance_type?: MaintenanceType;
  description?: string;
  notes?: string;
  odometer_reading?: number;
  next_service_date?: Date;
  next_service_odometer?: number;
  maintenance_document?: DocumentEntity;
  created_at?: Date;
  updated_at?: Date;

  static yupSchema() {
    return Yup.object().shape({
      maintenance_date: Yup.date().nullable(),
      maintenance_type: Yup.string()
        .oneOf(Object.values(MaintenanceType))
        .nullable(),
      description: Yup.string().nullable(),
      notes: Yup.string().nullable(),
      odometer_reading: Yup.number()
        .min(0, 'Odometer reading must be greater than or equal to 0')
        .nullable(),
      next_service_date: Yup.date().nullable(),
      next_service_odometer: Yup.number()
        .min(0, 'Next service odometer must be greater than or equal to 0')
        .nullable(),
      maintenance_document: Yup.mixed().nullable(),
    });
  }
}
