import { DocumentEntity } from "../documents/document.entity";

import * as yup from "yup";
// import * as yup from "../../utils/yup";
import { VehicleType } from "../../enums/vehicles/vehicle-type.enum";
import { VehicleTrailerType } from "../../enums/vehicles/vehicle-trailer-type.enum";
import { VehicleAccessory } from "../../enums/vehicles/vehicle-accessory.enum";

export class VehicleEntity {
    id?: number;
    version?: number;
    type?: VehicleType;
    type_other?: string;
    trailer_type?: string;
    trailer_type_other?: string;
    transmission_type?: string;
    make?: string;
    model?: string;
    year?: number;
    photo?: DocumentEntity = null;
    accessories?: string[] = [];
    accessory_other?: string;
    is_governed?: boolean = false;
    is_public?: boolean = false;
    max_speed?: number;
    created_at: string | Date;
    last_updated_at?: string | Date;

    static yupSchema() {
        return yup.object({
            type: (yup.string() as any).enum(VehicleType).required().nullable(),
            type_other: yup.string().when("type", {
                is: (type) => type === VehicleType.OTHER,
                then: yup.string().required().nullable()
            }).nullable(),
            trailer_type: (yup.string() as any).enum(VehicleTrailerType).nullable(),
            trailer_type_other: yup.string().when("trailer_type", {
                is: VehicleTrailerType.OTHER,
                then: yup.string().required().nullable(),
            }).nullable(),
            transmission_type: yup.string().nullable(),
            make: yup.string().required().nullable(),
            model: yup.string().nullable(),
            year: yup.number().min(1900).nullable(),
            photo: yup.mixed().when({
                is: v => !!v,
                then: DocumentEntity.yupSchema()
            }).optional(),
            accessories: yup.array(
                (yup.string() as any).enum(VehicleAccessory)
            ).nullable().optional().notRequired(),
            accessory_other: yup.string().when("accessories", {
                is: v => v?.includes(VehicleAccessory.OTHER),
                then: yup.string().required().nullable(),
            }).nullable(),
            is_governed: yup.boolean().required().nullable(),
            is_public: yup.boolean().required().nullable(),
            max_speed: yup.number().min(0).nullable()
        });
    }
}
