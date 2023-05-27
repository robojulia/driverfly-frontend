import { ApplicantJobEntity } from "../../models/applicant";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";

export type ViewApplicantDqfProps = {
    applicant: ApplicantEntity;
    title?: string;
    applicantJob?: ApplicantJobEntity;
}
