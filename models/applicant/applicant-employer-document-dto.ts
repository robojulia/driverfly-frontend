import { DocumentEntity } from '../documents/document.entity';
import * as yup from "yup";
import { ApplicantEmployerEntity } from './applicant-employer.entity';
export class ApplicantEmployerDocumentDto {
    document?: DocumentEntity;
    employer?: ApplicantEmployerEntity;

    static yupSchema() {
        return yup.object({

            document: DocumentEntity.yupSchema()

        });
    }
}
