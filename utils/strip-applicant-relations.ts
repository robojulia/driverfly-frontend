import { ApplicantEntity } from '../models/applicant/applicant.entity';

/**
 * Remove nested relation entities from an applicant before sending it to the
 * jotform save endpoints (PUT /jotform/{id} and PUT /jotform/{id}/save-draft).
 *
 * Sending full joined entities causes backend errors: full nested objects
 * (e.g. company) cause 500s, while the remaining relation fields
 * (e.g. referralSource, assignedUser) cause 400s when the backend has strict
 * DTO validation. Both the auto-save HOC and the manual "Save & Continue Later"
 * action must strip the same set so their payloads can't drift.
 */
export function stripApplicantRelations(applicant: ApplicantEntity): Partial<ApplicantEntity> {
  const {
    company,
    user,
    jobs,
    documents,
    employee,
    referralSource,
    assignedUser,
    atsMapping,
    job_history,
    notes,
    ...applicantFields
  } = applicant as any;

  return applicantFields;
}
