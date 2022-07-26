import * as yup from "yup";

export class LocationEntity {
    id?: number;
    version?: number;
    street: string;
    city?: string;
    state?: string;
    zip_code?: string;
    forwardGeocodeId?: number;
    countyId?: number;
    neighborhoodId?: number;
    latitude?: number;
    longitude?: number;
    created_at: string | Date;
    last_updated_at?: string | Date;

    static yupSchema() {
        return yup.object({
            street: yup.string().nullable(),
            city: yup.string().matches(/^[^0-9]+$/).required().nullable(),
            state: yup.string().required().nullable(),
            zip_code: yup.string().matches(/^[0-9]+$/).min(5).max(5).nullable(),
        });
    }
}
