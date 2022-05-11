import * as yup from "yup";
import { DocumentVisibility } from "../../enums/documents/document-visibility.enum";

export enum DocumentType {
    RESUME = 'RESUME',
    MVR = 'MVR',
    DRIVER_LICENSE = 'DRIVER_LICENSE',
    MEDICAL_CARD = 'MEDICAL_CARD',
}
  
export class DocumentEntity {
    id: number;
    name: string;
    description: string;
    path: string;
    type: string;
    documentable_id: number;
    documentable_type: string;
    created_at: string;
    // user: UserEntity;

    static yupSchema(enumType?: object) {
        return yup.object({
            type: (enumType ? (yup.string() as any).enum(enumType) : yup.string()).required().nullable(),
            visibility: (yup.string() as any).enum(DocumentVisibility).nullable(),
            name: yup.string().required().nullable(),
            description: yup.string().nullable(),
            mime_type: yup.string().nullable(),
            file_base64: yup.string().when("mime_type", {
                is: v => !!v,
                then: yup.string().required().nullable()
            }).nullable(),
        });
    }

    static key(entity: DocumentEntity) {
        return entity.type;
    }
}
  