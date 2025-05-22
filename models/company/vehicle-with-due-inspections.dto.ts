import { VehicleEntity } from './vehicle.entity';
import { VehicleInspectionEntity } from './vehicle-inspection.entity';

export interface VehicleWithDueInspectionsDto {
  vehicle: VehicleEntity;
  due_inspections: VehicleInspectionEntity[];
}
