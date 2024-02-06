import * as yup from "yup";
import "../../utils/yup";
import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum";

export class ApplicantExperienceEntity {
    type?: JobEquipmentType;
    type_other?: string;
    years?: number;
    months?: number;

    static yupSchema() {
        return yup.object({
            type: (yup.string() as any).enum(JobEquipmentType).required().nullable(),
            type_other: yup.string().when("type", {
                is: JobEquipmentType.OTHER,
                then: yup.string().required().nullable()
            }).nullable(),
            years: yup.number().min(1).nullable(),
            months: yup.number().min(0).max(11).nullable()
        });
    }

    static key(entity: ApplicantExperienceEntity) {
        if (entity.type == JobEquipmentType.OTHER) return `${entity.type}_${entity.type_other}`;

        return entity.type;
    }
}
