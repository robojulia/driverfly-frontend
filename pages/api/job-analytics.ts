import BaseApi from './_baseApi';

export interface JobConversionMetrics {
  jobId: number;
  jobTitle: string;
  views: number;
  clickToApply: number;
  clickToCompany: number;
  totalClicks: number;
  applicationsStarted: number;
  shortFormApplications: number;
  fullApplications: number;
  totalApplications: number;
  viewToClickRate: number;
  viewToApplyClickRate: number;
  viewToApplicationStartRate: number;
  clickToApplicationRate: number;
  applicationCompletionRate: number;
  overallConversionRate: number;
}

export interface ConversionTimelineData {
  date: string;
  views: number;
  clickToApply: number;
  clickToCompany: number;
  totalClicks: number;
  applicationsStarted: number;
  shortFormApplications: number;
  fullApplications: number;
  totalApplications: number;
  viewToClickRate: number;
  viewToApplicationRate: number;
  overallConversionRate: number;
}

export interface LeadSourceBreakdown {
  source: string;
  sourceName?: string;
  views: number;
  clicks: number;
  applications: number;
  conversionRate: number;
}

export interface UtmBreakdown {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  views: number;
  clicks: number;
  applications: number;
  conversionRate: number;
}

export interface JobAnalyticsInsights {
  summary: JobConversionMetrics;
  timeline: ConversionTimelineData[];
  sources: any[]; // ConversionSourceBreakdown[]
  campaigns: any[]; // CampaignAttribution[]
  peakHour?: number;
  peakDayOfWeek?: number;
  bestPerformingSource?: string;
  insights: {
    topBottleneck?: 'views' | 'clicks' | 'applications';
    improvementOpportunity?: string;
    benchmarkComparison?: 'above_average' | 'average' | 'below_average';
  };
}

export interface GetJobConversionAnalyticsParams {
  period?: '7d' | '30d' | '90d' | '6m' | 'custom';
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
  includeSources?: boolean;
  includeCampaigns?: boolean;
}

export default class JobAnalyticsApi extends BaseApi {
  baseUrl: string = 'analytics/reporting';

  constructor() {
    super();
  }

  /**
   * Get job conversion metrics with proper error handling
   */
  async getJobConversionMetrics(
    jobId: number,
    params?: GetJobConversionAnalyticsParams
  ): Promise<JobConversionMetrics> {
    if (!jobId || jobId <= 0) {
      throw new Error('Invalid job ID provided');
    }

    const url = this.buildUrl(`${this.baseUrl}/job/${jobId}/conversion-metrics`, params);

    try {
      const { data } = await this.get(url);

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch conversion metrics');
      }

      return data.data;
    } catch (error) {
      console.error('JobAnalyticsApi.getJobConversionMetrics failed:', error);
      throw error;
    }
  }

  /**
   * Get job conversion timeline with validation
   */
  async getJobConversionTimeline(
    jobId: number,
    params?: GetJobConversionAnalyticsParams
  ): Promise<ConversionTimelineData[]> {
    if (!jobId || jobId <= 0) {
      throw new Error('Invalid job ID provided');
    }

    const url = this.buildUrl(`${this.baseUrl}/job/${jobId}/conversion-timeline`, params);

    try {
      const { data } = await this.get(url);

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch conversion timeline');
      }

      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error('JobAnalyticsApi.getJobConversionTimeline failed:', error);
      throw error;
    }
  }

  /**
   * Get job analytics insights with fallback
   */
  async getJobAnalyticsInsights(
    jobId: number,
    params?: GetJobConversionAnalyticsParams
  ): Promise<JobAnalyticsInsights> {
    if (!jobId || jobId <= 0) {
      throw new Error('Invalid job ID provided');
    }

    const url = this.buildUrl(`${this.baseUrl}/job/${jobId}/insights`, params);

    try {
      const { data } = await this.get(url);

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch analytics insights');
      }

      return data.data;
    } catch (error) {
      console.error('JobAnalyticsApi.getJobAnalyticsInsights failed:', error);
      throw error;
    }
  }

  /**
   * Get company-wide conversion metrics
   */
  async getCompanyConversionMetrics(
    companyId: number,
    params?: GetJobConversionAnalyticsParams
  ): Promise<JobConversionMetrics> {
    if (!companyId || companyId <= 0) {
      throw new Error('Invalid company ID provided');
    }

    const url = this.buildUrl(`${this.baseUrl}/company/${companyId}/conversion-metrics`, params);

    try {
      const { data } = await this.get(url);

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch company conversion metrics');
      }

      return data.data;
    } catch (error) {
      console.error('JobAnalyticsApi.getCompanyConversionMetrics failed:', error);
      throw error;
    }
  }

  /**
   * Get company conversion timeline
   */
  async getCompanyConversionTimeline(
    companyId: number,
    params?: GetJobConversionAnalyticsParams
  ): Promise<ConversionTimelineData[]> {
    if (!companyId || companyId <= 0) {
      throw new Error('Invalid company ID provided');
    }

    const url = this.buildUrl(`${this.baseUrl}/company/${companyId}/conversion-timeline`, params);

    try {
      const { data } = await this.get(url);

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch company conversion timeline');
      }

      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error('JobAnalyticsApi.getCompanyConversionTimeline failed:', error);
      throw error;
    }
  }

  /**
   * Get lead source breakdown for a job
   */
  async getLeadSourceBreakdown(
    jobId: number,
    params?: GetJobConversionAnalyticsParams
  ): Promise<LeadSourceBreakdown[]> {
    if (!jobId || jobId <= 0) {
      throw new Error('Invalid job ID provided');
    }

    const url = this.buildUrl(`${this.baseUrl}/job/${jobId}/lead-source-breakdown`, params);

    try {
      const { data } = await this.get(url);

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch lead source breakdown');
      }

      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error('JobAnalyticsApi.getLeadSourceBreakdown failed:', error);
      throw error;
    }
  }

  /**
   * Get UTM parameter breakdown for a job
   */
  async getUtmBreakdown(
    jobId: number,
    params?: GetJobConversionAnalyticsParams
  ): Promise<UtmBreakdown[]> {
    if (!jobId || jobId <= 0) {
      throw new Error('Invalid job ID provided');
    }

    const url = this.buildUrl(`${this.baseUrl}/job/${jobId}/utm-breakdown`, params);

    try {
      const { data } = await this.get(url);

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch UTM breakdown');
      }

      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error('JobAnalyticsApi.getUtmBreakdown failed:', error);
      throw error;
    }
  }
}
