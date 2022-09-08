import * as yup from "yup";

export class JobOrientationEntity {

    id?: number;
    jobId?: number;
    locationId?: number;
    start_datetime?: string | Date;
    end_datetime?: string | Date;

    static yupSchema() {
        return yup.object({
            jobId: yup.number().nullable(),
            locationId: yup.number().required().nullable(),
            start_datetime: yup.date().required().nullable(),
            end_datetime: yup.date().required().nullable(),
        });
    }
}
