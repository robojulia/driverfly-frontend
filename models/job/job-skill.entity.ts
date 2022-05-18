import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum';
import * as yup from "yup";

export class JobSkillEntity {
  type?: JobEquipmentType;
  years?: number;

  static yupSchema() {
    return yup.object({
        type: yup.string().required().nullable(),
        years: yup.number().min(1).required().nullable(),
    });
  }
}
