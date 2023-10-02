import { DocumentEntity } from '../documents/document.entity';
import * as yup from "yup";

export class EmployeeDocumentDto {
    document?: DocumentEntity;

    static yupSchema() {
        return yup.object({

            document: DocumentEntity.yupSchema()

        });
    }
}
