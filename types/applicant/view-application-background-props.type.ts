import { ApplicantJobEntity } from "../../models/applicant";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";

export type ViewApplicantBackgroundProps = {
    applicant: ApplicantEntity;
    applicantJob: ApplicantJobEntity;
}
