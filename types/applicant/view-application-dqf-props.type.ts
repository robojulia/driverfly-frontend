import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { DocumentEntity } from "../../models/documents/document.entity";

export type ViewApplicantDqfProps = {
    applicant: ApplicantEntity;
    title?: string;
    showCompleted?: boolean | (() => boolean);
    showOnboarding?: boolean | (() => boolean);
    showHistory?: boolean | (() => boolean);
    canEdit?: boolean | (() => boolean);
    canEditSafetyPerformance?: boolean | (() => boolean);
    showResendButton?: boolean | (() => boolean);
    onUpdateDocument?: (e: DocumentEntity) => void;
    onDeleteDocument?: (e: DocumentEntity) => void;
}
