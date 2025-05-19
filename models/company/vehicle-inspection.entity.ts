import * as yup from 'yup';
import { VehicleEntity } from './vehicle.entity';

export enum InspectionType {
  SAFETY = 'Safety',
  MAINTENANCE = 'Maintenance',
  ROADSIDE = 'Roadside',
}

export enum InspectionStatus {
  PASSED = 'Passed',
  FAILED = 'Failed',
  PENDING = 'Pending',
  SCHEDULED = 'Scheduled',
}

export class VehicleInspectionEntity {
  id?: number;
  vehicle?: VehicleEntity;
  inspection_type: InspectionType;
  status: InspectionStatus;
  inspection_date?: Date;
  due_date?: Date;
  notes?: string;
  created_at?: Date;
  last_updated_at?: Date;

  static yupSchema() {
    return yup.object().shape({
      inspection_type: yup.string().required('Inspection type is required'),
      status: yup.string().required('Status is required'),
      inspection_date: yup.date().nullable(),
      due_date: yup.date().nullable(),
      notes: yup.string().nullable(),
    });
  }
}
