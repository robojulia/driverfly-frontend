import * as yup from "yup";

export class JobOrientationEntity {

    id?: number;
    jobId?: number;
    locationId?: number;
    start_datetime?: string | Date;
    end_datetime?: string | Date;

    static yupSchema() {
        return yup.object({
            jobId: yup.number().when('isOrientationNeeded', {
                is: true ,
                then: yup.number().required(),
                otherwise: yup.number(),
              }),
            locationId: yup.number().when('isOrientationNeeded', {
                is: true,
                then: yup.number().required(),
                otherwise: yup.number(),
              }),
            start_datetime: yup.date().when('isOrientationNeeded', {
                is: true,
                then: yup.date().required(),
                otherwise: yup.date(),
              }),
            end_datetime: yup.date().when('isOrientationNeeded', {
                is: true,
                then: yup.date().required(),
                otherwise: yup.date(),
              }),
        });
    }
}
