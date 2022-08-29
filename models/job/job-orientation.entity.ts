import * as yup from "yup";

export class JobOrientationEntity {

    id?: number;
    jobId?: number;
    locationId?: number;
    start_datetime?: Date;
    end_datetime?: Date;

    static yupSchema() {
        return yup.object({
            jobId: yup.number().required().nullable(),
            locationId: yup.number().required().nullable(),
            start_datetime: yup.date().required().nullable(),
            end_datetime: yup.date().required().nullable(),
        });
    }
}
