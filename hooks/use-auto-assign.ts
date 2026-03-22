import { useEffect, useRef } from 'react';
import { useAuth } from './use-auth';
import { Status } from '../enums/status.enum';
import { CompanyPreferenceAutoRecrutingLabel } from '../enums/company/company-preferences-auto-recruiting-label.enum';
import { ApplicantEntity } from '../models/applicant/applicant.entity';
import { AssignableUser, AutoAssignMethod, pickNextUser } from '../utils/auto-assign';
import ApplicantApi from '../pages/api/applicant';
import CompanyApi from '../pages/api/company';
import UserApi from '../pages/api/user';

/**
 * Automatically assigns unassigned applicants to recruiters based on the
 * company's configured method (round-robin or weighted by performance score).
 *
 * This hook is a no-op when:
 *  - the current user is not a company admin
 *  - auto-assign is disabled in company preferences
 *  - there are no unassigned applicants in the current page
 *  - there are no active, enabled users to assign to
 *
 * It runs once per mount (or when `applicants` first populates) and fires
 * `onAssigned(applicantId, userId)` for each assignment made so the caller
 * can update local state.
 */
export function useAutoAssign(
  applicants: ApplicantEntity[],
  onAssigned: (applicantId: number, userId: number) => void
) {
  const { user, isCompanyAdmin } = useAuth();
  const runningRef = useRef(false);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current || runningRef.current) return;
    if (!isCompanyAdmin || !user?.company?.id) return;
    if (!applicants?.length) return;

    const unassigned = applicants.filter((a) => !a.assignedUserId);
    if (!unassigned.length) {
      hasRunRef.current = true;
      return;
    }

    runAutoAssign(unassigned);
  }, [applicants]); // eslint-disable-line react-hooks/exhaustive-deps

  async function runAutoAssign(unassigned: ApplicantEntity[]) {
    runningRef.current = true;

    try {
      const companyId = user.company.id;

      // 1. Check preference flags
      const companyApi = new CompanyApi();
      const prefs = await companyApi.preferences.list(companyId);

      const enabledPref = prefs.find(
        (p) => p.label === CompanyPreferenceAutoRecrutingLabel.AUTO_ASSIGN_INBOUND_APPLICANTS
      );
      if (!enabledPref?.value) return;

      const methodPref = prefs.find(
        (p) => p.label === CompanyPreferenceAutoRecrutingLabel.AUTO_ASSIGN_METHOD
      );
      const method: AutoAssignMethod =
        (methodPref?.value as AutoAssignMethod) || 'round_robin';

      // 2. Get active recruiters
      const userApi = new UserApi();
      const allUsers = await userApi.list();
      const activeUsers = allUsers.filter(
        (u) => u.status === Status.ACTIVE && !u.company_disabled
      );
      if (!activeUsers.length) return;

      // 3. Load performance scores (only needed for weighted method)
      const userScores: Record<number, number> = {};
      if (method === 'weighted') {
        try {
          const summaries = await userApi.getScoreSummaries();
          summaries.forEach((s) => {
            userScores[s.userId] = s.overallScore;
          });
        } catch {
          // Scores are optional — equal weights (50) will be used as fallback
        }
      }

      const assignableUsers: AssignableUser[] = activeUsers.map((u) => ({
        id: u.id,
        score: userScores[u.id] ?? 50,
      }));

      // 4. Assign each unassigned applicant
      const applicantApi = new ApplicantApi();

      for (const applicant of unassigned) {
        const targetUserId = pickNextUser(assignableUsers, method, companyId);
        if (targetUserId == null) continue;

        try {
          await applicantApi.assignToUser(applicant.id, targetUserId);
          onAssigned(applicant.id, targetUserId);
        } catch (err) {
          console.error(`[auto-assign] Failed for applicant ${applicant.id}:`, err);
        }
      }
    } catch (e) {
      console.error('[auto-assign] Unexpected error:', e);
    } finally {
      runningRef.current = false;
      hasRunRef.current = true;
    }
  }
}
