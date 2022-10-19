import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum';
import * as yup from "yup";

export class JobSkillEntity {
    type?: JobEquipmentType;
    years?: number;
    months?: number;

    static yupSchema() {
        return yup.object()
            .shape({
                type: yup.string().required().nullable(),
                years: yup.number()
                    .when("months", {
                        is: v => v > 0,
                        then: yup.number().optional().min(0).nullable(),
                        otherwise: yup.number().required().min(1).nullable(),
                    })
                    .nullable(),
                months: yup.number()
                    .when("years", {
                        is: v => v > 0,
                        then: yup.number().optional().min(0).nullable(),
                        otherwise: yup.number().required().min(1).nullable(),
                    })
                    .max(11)
                    .nullable(),
            }, [['months', 'years']]);
    }
}
