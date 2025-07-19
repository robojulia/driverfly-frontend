import BaseApi from '../pages/api/_baseApi';
import { AnalyticsEvent, AnalyticsResponse, BatchAnalyticsResponse } from './analytics.types';

/**
 * Analytics API client using the base API infrastructure
 */
class AnalyticsApi extends BaseApi {
  /**
   * Track a single analytics event
   */
  async trackEvent(event: AnalyticsEvent): Promise<AnalyticsResponse> {
    try {
      const response = await this.post('/analytics/events', event);
      return response.data;
    } catch (error) {
      console.error('[Analytics API] Failed to track event:', error);
      throw error;
    }
  }

  /**
   * Track multiple analytics events in a batch
   */
  async trackBatch(events: AnalyticsEvent[], sessionId: string): Promise<BatchAnalyticsResponse> {
    try {
      const payload = {
        events,
        sessionId,
      };

      const response = await this.post('/analytics/track-batch', payload);
      return response.data;
    } catch (error) {
      console.error('[Analytics API] Failed to track batch:', error);
      throw error;
    }
  }

  /**
   * Get analytics summary for a job
   */
  async getJobAnalytics(jobId: number, startDate?: string, endDate?: string) {
    try {
      const params = {
        jobId,
        startDate,
        endDate,
      };

      const url = this.buildUrl('/analytics/summary', params);
      const response = await this.get(url);
      return response.data;
    } catch (error) {
      console.error('[Analytics API] Failed to get job analytics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const analyticsApi = new AnalyticsApi();
export default analyticsApi;
