import { ApplicantSuggestedJobEntity } from "../../models/applicant/applicant-suggested-job.entity";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { ProtectedFields } from "./protected-fields.type";

export type ViewApplicantDetailProps = {
    
    applicant: ApplicantEntity;
    protectedFields?: ProtectedFields;
    applicantSuggestedJobs?: ApplicantSuggestedJobEntity[];
    
}