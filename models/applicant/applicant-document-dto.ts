import { DocumentEntity } from '../documents/document.entity';
import * as yup from "yup";
// import { ApplicantDocumentType } from '../../enums/applicants/applicant-document-type.enum';
import { ApplicantDqf } from '../../enums/applicants/applicant-dqf-types.enum';
import { ApplicantOnBoardingChecklist } from '../../enums/applicants/applicant-onboarding-checklist.enum';

export class ApplicantDocumentDto {
    document?: DocumentEntity;

    static yupSchema() {
        return yup.object({

            document: DocumentEntity.yupSchema(ApplicantDqf as any | ApplicantOnBoardingChecklist as any)

        });
    }
}
