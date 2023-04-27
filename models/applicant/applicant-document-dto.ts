import { DocumentEntity } from '../documents/document.entity';
import * as yup from "yup";
export class ApplicantDocumentDto {
    document?: DocumentEntity;

    static yupSchema() {
        return yup.object({

            document: DocumentEntity.yupSchema()

        });
    }
}
