import { ApplicantEntity } from "../../models/applicant/applicant.entity";

export type ViewApplicantDqfProps = {
    applicant: ApplicantEntity;
    title?: string;
    showCompleted?: boolean | (() => boolean);
    showOnboarding?: boolean | (() => boolean);
    showHistory?: boolean | (() => boolean);
    canEdit?: boolean | (() => boolean);
    canEditSafetyPerformance?: boolean | (() => boolean);
    showResendButton?: boolean | (() => boolean);
}
