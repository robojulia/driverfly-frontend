import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum"
export interface JobEquipmentEntity {
  type?: JobEquipmentType;
  quantity?: number;
}
