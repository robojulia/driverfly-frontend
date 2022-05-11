import { DriverEntity } from "./Driver.entity";

export interface DriverEquipmentExperienceEntity {
  id: number;
  driver: DriverEntity;
  type?: string;
  years?: number;
}
