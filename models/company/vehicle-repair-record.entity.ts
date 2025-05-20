import * as Yup from 'yup';
import { DocumentEntity } from '../documents/document.entity';

export enum RepairType {
  SCHEDULED = 'Scheduled',
  EMERGENCY = 'Emergency',
  WARRANTY = 'Warranty',
  RECALL = 'Recall',
}

export class VehicleRepairRecordEntity {
  id?: number;
  repair_date: Date;
  repair_type: RepairType = RepairType.SCHEDULED;
  amount: number;
  description: string;
  repair_receipt_document?: DocumentEntity;
  created_at?: Date;
  updated_at?: Date;

  static yupSchema() {
    return Yup.object().shape({
      repair_date: Yup.date().required('Repair date is required'),
      repair_type: Yup.string()
        .oneOf(Object.values(RepairType))
        .required('Repair type is required'),
      amount: Yup.number()
        .min(0, 'Amount must be greater than or equal to 0')
        .required('Amount is required'),
      description: Yup.string().required('Description is required'),
      repair_receipt_document: Yup.mixed().nullable(),
    });
  }
}
