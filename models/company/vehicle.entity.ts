import { DocumentEntity } from "../documents/document.entity";

import * as yup from "yup";
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
            model: yup.string().required().nullable(),
            year: yup.number().required().min(1900).nullable(),
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
        });
    }

    static existingOrCreateYupSchema() {
        return yup.object({
            id: yup.number().nullable(),
            type: yup.string().when("id", {
                is: v => !v,
                then: (yup.string() as any).enum(VehicleType).required().nullable()
            }).nullable(),
            type_other: yup.string().when(["id", "type"], {
                is: (id, type) => !id && type === VehicleType.OTHER,
                then: yup.string().required().nullable()
            }).nullable(),
            transmission_type: yup.string().nullable(),
            make: yup.string().when("id", {
                is: v => !v,
                then: yup.string().required().nullable()
            }).nullable(),
            model: yup.string().when("id", {
                is: v => !v,
                then: yup.string().required().nullable()
            }).nullable(),
            year: yup.number().when("id", {
                is: v => !v,
                then: yup.number().required().min(1900).nullable()
            }).nullable(),
            photo: DocumentEntity.yupSchema().nullable()
        });
    }
}
