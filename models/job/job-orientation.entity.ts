import * as yup from "yup";
import "../../utils/yup";
import { LocationEntity } from "../company/location.entity";
import { JobEntity } from "./job.entity";

export class JobOrientationEntity {
    id?: number;
    location?: LocationEntity = new LocationEntity();
    job?: JobEntity;
    start_datetime?: string | Date;
    end_datetime?: string | Date;

    static yupSchema() {
        return yup.object(
            {
                location: LocationEntity.yupConnectSchema(false),
                start_datetime: yup
                    .date()
                    .optional()
                    .nullable(),
                end_datetime: yup
                    .date()
                    .optional()
                    .test({
                        test: (value, context) => {
                            const start_date = context.resolve(yup.ref('start_datetime'));
                            if (!Boolean(value)) return true;
                            if (value > start_date) return true;

                            return context.createError({
                                path: context.path,
                                message: 'END_DATE_MUST_BE_AFTER_START_DATE'
                            })
                        }
                    }
                    ).nullable(),
            },
        );
    }
}
