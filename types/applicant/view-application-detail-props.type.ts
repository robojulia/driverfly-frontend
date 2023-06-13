import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { ProtectedFields } from "./protected-fields.type";

export type ViewApplicantDetailProps = {

    applicant: ApplicantEntity;
    protectedFields?: ProtectedFields;
    hideAssignTo?: boolean | (() => boolean);
    hideCurrentStatus?: boolean | (() => boolean);

}