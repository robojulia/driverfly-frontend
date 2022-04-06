import { DocumentEntity } from "../documents/document.entity";

export default interface VehicleEntity {
    id?: number;
    version?: number;
    type?: string;
    type_other?: string;
    trailer_type?: string;
    trailer_type_other?: string;
    transmission_type?: string;
    make?: string;
    model?: string;
    year?: number;
    photo?: DocumentEntity;
    accessories?: string[];
    accessory_other?: string;
    created_at: Date;
    last_updated_at?: Date;
}
