import { DocumentEntity } from "../documents/document.entity";
import * as yup from "yup";
import { CompanyDocumentType } from "../../enums/compliance/company-document-type.enum";


export class StoredFileDto {
    type: CompanyDocumentType;
    file: DocumentEntity;

    static yupSchema() {
        return yup.object({
            type: yup.string().required(),
            file: DocumentEntity.yupSchema()
        });
    }
}