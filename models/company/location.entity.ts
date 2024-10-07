import * as yup from "yup";
import { cityRegexValidation, zipCodeRegexValidation } from "../../utils/yup";

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
            city: cityRegexValidation().required(),
            state: yup.string().required().nullable(),
            zip_code: zipCodeRegexValidation().required(),
        });
    }

    static yupConnectSchema(required?: boolean) {
        return yup.mixed().when({
            is: v => (v != null),
            then: yup.object({
                id: yup.number().when({
                    is: required,
                    then: yup.number().required().nullable(),
                    otherwise: yup.number().optional().nullable()
                }).nullable()
            }),
            otherwise: yup.mixed().optional()
        })
    }
}
