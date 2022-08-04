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
            street: yup.string().nullable(),
            city: cityRegexValidation().required(),
            state: yup.string().required().nullable(),
            zip_code: zipCodeRegexValidation(),
        });
    }
}
