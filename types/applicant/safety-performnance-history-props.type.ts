import { ApplicantEntity } from "../../models/applicant/applicant.entity";

export type SafetyPerformanceHistoryProps = {
    applicant: ApplicantEntity;
    buttonClass?: string;
    canEditSafetyPerformance?: boolean | (() => boolean);
    showHistory?: boolean | (() => boolean);
    showResendButton?: boolean | (() => boolean);
}
