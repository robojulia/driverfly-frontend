import BaseApi from '../pages/api/_baseApi';

export interface AutoRecruitingStats {
  totalUniqueApplicants: number;
  totalRecords: number;
  thisWeekApplicants: number;
  thisMonthApplicants: number;
  // sourceCompaniesCount: number; // Hidden for now - related to sensitive source company data
  jobBreakdown: JobRecruitmentStats[];
  weeklyTrend: WeeklyTrend[];
  // sourceBreakdown: SourceBreakdown[]; // Hidden for now - contains sensitive source company data
}

export interface JobRecruitmentStats {
  jobId: number;
  jobTitle: string;
  applicantCount: number;
}

export interface WeeklyTrend {
  weekStart: string;
  applicantsCount: number;
  recordsCount: number;
}

// Hidden for now - contains sensitive source company data
// export interface SourceBreakdown {
//   sourceCompanyName: string;
//   applicantCount: number;
//   percentage: number;
// }

/**
 * Auto-recruiting analytics API client using the base API infrastructure
 */
class AutoRecruitingApi extends BaseApi {
  /**
   * Get auto-recruiting analytics stats for the current company
   */
  async getStats(): Promise<AutoRecruitingStats> {
    try {
      const response = await this.get('/auto-recruiting/analytics/stats');
      return response.data;
    } catch (error) {
      console.error('[Auto-Recruiting API] Failed to fetch stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const autoRecruitingApi = new AutoRecruitingApi();
export default AutoRecruitingApi;
