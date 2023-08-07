import * as yup from "yup";
import "../../utils/yup";
import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum";

export class EmployeeEquipmentEntity {
    type?: JobEquipmentType;
    type_other?: string;
    quantity?: number;

    static yupSchema() {
        return yup.object({
            type: (yup.string() as any).enum(JobEquipmentType).required().nullable(),
            type_other: yup.string().when("type", {
                is: JobEquipmentType.OTHER,
                then: yup.string().required().nullable()
            }).nullable(),
            quantity: yup.number().min(1).required().nullable()
        });
    }

    static key(entity: EmployeeEquipmentEntity) {
        if (entity.type === JobEquipmentType.OTHER) return `${entity.type}_${entity.type_other}`;

        return entity.type;
    }
}
