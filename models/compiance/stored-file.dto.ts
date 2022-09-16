import { DocumentEntity } from "../documents/document.entity";
import * as yup from "yup";


export class StoredFileDto {
    type: DocumentType;
    file: DocumentEntity;

    static yupSchema() {
        return yup.object({
          type: yup.string().required(),
          file: DocumentEntity.yupSchema()
        });
    }
}