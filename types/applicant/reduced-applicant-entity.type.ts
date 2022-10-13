import { ApplicantJobEntity } from "../../models/applicant/applicant-job.entity";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";

export type ReducedApplicantEntityType = {
    applicant: ApplicantEntity,
    applicantJob: ApplicantJobEntity
}
