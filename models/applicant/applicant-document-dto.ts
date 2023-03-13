import { DocumentEntity } from '../documents/document.entity';
import * as yup from "yup";
// import { ApplicantDocumentType } from '../../enums/applicants/applicant-document-type.enum';
import { ApplicantDqf } from '../../enums/applicants/applicant-dqf-types.enum';

export class ApplicantDocumentDto {
    document?: DocumentEntity;

    static yupSchema() {
        return yup.object({

            document: DocumentEntity.yupSchema(ApplicantDqf)

        });
    }
}
