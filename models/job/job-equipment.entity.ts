import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum"
import * as yup from "yup";

export class JobEquipmentEntity {
  type?: JobEquipmentType;
  quantity?: number;

  static yupSchema() {
    return yup.object({
        type: yup.string().required().nullable(),
        quantity: yup.number().min(1).required().nullable(),
    });
  }
}
