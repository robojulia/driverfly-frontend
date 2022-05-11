import { DriverEntity } from './Driver.entity';

export interface DriverEquipmentOwnedEntity {
  id: number;
  driver: DriverEntity;
  type?: string;
  type_other?: string;
  quantity?: number;
}
