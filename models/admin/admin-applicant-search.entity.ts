export interface ApplicantWithAutoRecruitingData {
  applicantId: number;
  applicantJobId: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  companyId: number;
  companyName: string;
  jobId: number | null;
  jobTitle: string | null;
  jobStatus: string | null;
  appliedAt: Date;
  hiredAt: Date | null;
  numberEngagements: number;
  lastEngaged: Date | null;
  // Auto-recruiting eligibility data (supplemental)
  isEligibleForAutoRecruiting: boolean;
  autoRecruitingReason: string | null;
  isFormerEmployee: boolean;
  isStaleApplication: boolean;
  isInactiveJob: boolean;
}

export interface ApplicantSearchResponse {
  data: ApplicantWithAutoRecruitingData[];
  meta: {
    currentPage: number;
    itemCount: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ApplicantSearchParams {
  page?: number;
  limit?: number;
  companyId?: number;
  search?: string;
  eligibleOnly?: boolean;
}
