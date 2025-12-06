import { globalAjaxExceptionHandler } from '../../utils/ajax';
import BaseApi from './_baseApi';

export interface EligibilityQueryParams {
  minScore?: number;
  limit?: number;
  offset?: number;
  appliedOnly?: boolean;
  crossCompany?: boolean;
  states?: string[];
  sortBy?:
    | 'score'
    | 'firstName'
    | 'lastName'
    | 'yearsExperience'
    | 'createdAt'
    | 'dateApplied'
    | 'interestLevel'
    | 'engagementCount';
  sortOrder?: 'ASC' | 'DESC';
}

export interface ApplicantBasicInfo {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  location: string;
  licenseType: string;
  yearsExperience: number;
  type: 'USER' | 'COMPANY' | 'DHA' | 'DIRECT_JOB_APPLY' | 'AUTO_RECRUIT';
  hasApplied: boolean;
  isInterested: boolean;
  isHired: boolean;
  interestTier?: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  engagementCount?: number;
  daysSinceLastEngagement?: number | null;
  lastEngagementDate?: string | null;
  created_at?: string;
  dateApplied?: string;
  appliedJobTitle?: string;
  appliedJobId?: number;
  appliedCompanyName?: string;
  appliedCompanyId?: number;
}

export interface ScoringDetails {
  requirementsMet: string[];
  requirementsFailed: string[];
  bonusPoints: string[];
  deductions: string[];
}

export interface ApplicantEligibilityScore {
  applicantId: number;
  applicant: ApplicantBasicInfo;
  score: number;
  eligibilityStatus: 'ELIGIBLE' | 'PARTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE';
  scoringDetails: ScoringDetails;
  lastUpdated: string;
}

export interface ApplicantEligibilityResponse {
  jobId: number;
  totalApplicants: number;
  eligibleApplicants: number;
  scoredApplicants: ApplicantEligibilityScore[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

export interface ScoreBreakdown {
  category: string;
  points: number;
  maxPoints: number;
  status: 'PASS' | 'FAIL' | 'PARTIAL';
  details: string;
}

export interface DetailedEligibilityResponse extends ApplicantEligibilityScore {
  detailedBreakdown: {
    cdlRequirements: ScoreBreakdown;
    experienceRequirements: ScoreBreakdown;
    geographyMatch: ScoreBreakdown;
    equipmentExperience: ScoreBreakdown;
    mvrRequirements: ScoreBreakdown;
    endorsements: ScoreBreakdown;
    preferences: ScoreBreakdown;
  };
  recommendations: string[];
}

export default class EligibilityApi extends BaseApi {
  constructor() {
    super();
  }

  /**
   * Get eligibility scores for all applicants for a specific job
   */
  async getJobEligibilityScores(
    jobId: number,
    params?: EligibilityQueryParams
  ): Promise<ApplicantEligibilityResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.minScore !== undefined)
        queryParams.append('minScore', params.minScore.toString());
      if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
      if (params?.offset !== undefined) queryParams.append('offset', params.offset.toString());
      if (params?.appliedOnly !== undefined)
        queryParams.append('appliedOnly', params.appliedOnly.toString());
      if (params?.crossCompany !== undefined)
        queryParams.append('crossCompany', params.crossCompany.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params?.states?.length) {
        params.states.forEach((state) => queryParams.append('states', state));
      }

      const queryString = queryParams.toString();
      const url = `/eligibility/jobs/${jobId}/applicants${queryString ? `?${queryString}` : ''}`;

      const response = await this.get(url);
      return response.data;
    } catch (error) {
      // Let the calling component handle the error
      throw error;
    }
  }

  /**
   * Get detailed eligibility analysis for a specific applicant and job
   */
  async getApplicantJobEligibility(
    jobId: number,
    applicantId: number
  ): Promise<DetailedEligibilityResponse> {
    try {
      const response = await this.get(`/eligibility/jobs/${jobId}/applicants/${applicantId}`);
      return response.data;
    } catch (error) {
      // Let the calling component handle the error
      throw error;
    }
  }

  /**
   * Get a quick summary of eligibility stats for a job (for dashboard display)
   */
  async getJobEligibilitySummary(jobId: number): Promise<{
    totalApplicants: number;
    eligibleApplicants: number;
    topScorePercent: number;
  }> {
    try {
      const response = await this.getJobEligibilityScores(jobId, {
        limit: 1,
        sortBy: 'score',
        sortOrder: 'DESC',
      });

      const topScore =
        response.scoredApplicants.length > 0 ? response.scoredApplicants[0].score : 0;

      return {
        totalApplicants: response.totalApplicants,
        eligibleApplicants: response.eligibleApplicants,
        topScorePercent: Math.round(topScore),
      };
    } catch (error) {
      // Return default values if API fails
      return {
        totalApplicants: 0,
        eligibleApplicants: 0,
        topScorePercent: 0,
      };
    }
  }
}
