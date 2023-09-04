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
                location: LocationEntity.yupConnectSchema(true),
                start_datetime: yup
                    .date()
                    .required()
                    .nullable(),
                end_datetime: yup
                    .date()
                    .required()
                    .nullable(),
            },
        );
    }
}
