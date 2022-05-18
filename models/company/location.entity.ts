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
            street: yup.string().required().nullable(),
            city: yup.string().required().nullable(),
            state: yup.string().required().nullable(),
            zip_code: yup.string().required().nullable(),
        });
    }

    /**
     * This schema will either allow an ID or a new entity
     */
    static existingOrNewYupSchema() {
        return yup.object({
            id: yup.number().nullable(),
            street: yup.string()
                .when("id", {
                    is: v => !!!v,
                    then: yup.string().required().nullable()
                }).nullable(),
            city: yup.string()
                .when("id", {
                    is: v => !!!v,
                    then: yup.string().required().nullable()
                }).nullable(),
            state: yup.string()
                .when("id", {
                    is: v => !!!v,
                    then: yup.string().required().nullable()
                }).nullable(),
            zip_code: yup.string()
                .when("id", {
                    is: v => !!!v,
                    then: yup.string().required().nullable()
                }).nullable(),
        });
    }
}
