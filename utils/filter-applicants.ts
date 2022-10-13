import { type } from "os";
import { ApplicantJobEntity } from "../models/applicant/applicant-job.entity";
import { ApplicantEntity } from "../models/applicant/applicant.entity";
import { ReducedApplicantEntityType } from "../types/applicant/reduced-applicant-entity.type";

// Filter applicants for hired jobs
export const filterHired = (applicants: ApplicantEntity[]): ApplicantEntity[] => {
    return applicants.filter((applicant: ApplicantEntity) => {
        const jobs = applicant.jobs.filter((applicantJob: ApplicantJobEntity) => {
            if (!applicantJob.status) return false;
            else if (applicantJob.status.startsWith("COMPLETED")) return true;
            else return false;
        })
        if (jobs.length) {
            applicant.jobs = jobs
            return applicant
        }
    })
}

// export type ReducedApplicantEntityType = {
//     applicant: ApplicantEntity,
//     applicantJob: ApplicantJobEntity
// }

// reducing ApplicantEntity for eact job
export const reduceSingleEntity = (applicants: ApplicantEntity[]): any => {
    let applicantsMap: ReducedApplicantEntityType[] = [];

    applicants.map((applicant: ApplicantEntity) => {
        applicant.jobs?.map((applicantJob: ApplicantJobEntity) => {
            applicantsMap.push({
                applicant,
                applicantJob
            })
        });
    });
    return applicantsMap;
}

