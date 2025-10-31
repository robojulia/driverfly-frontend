import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { DocumentEntity } from "../../models/documents/document.entity";

export type ViewApplicantOnboardingChecklistProps = {
    applicant: ApplicantEntity;
    title?: string;
    useSectionContainer?: boolean;
    showCompleted?: boolean | (() => boolean);
    showHistory?: boolean | (() => boolean);
    canEdit?: boolean | (() => boolean);
    canEditSafetyPerformance?: boolean | (() => boolean);
    showResendButton?: boolean | (() => boolean);
    onUpdateDocument?: (e: DocumentEntity) => void;
    onDeleteDocument?: (e: DocumentEntity) => void;
}
