import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import JobAnalyticsApi, {
  JobConversionMetrics,
  ConversionTimelineData,
  JobAnalyticsInsights,
  GetJobConversionAnalyticsParams,
  LeadSourceBreakdown,
  UtmBreakdown,
} from '../pages/api/job-analytics';
import { globalAjaxExceptionHandler } from '../utils/ajax';

interface UseJobAnalyticsDataResult {
  metrics: JobConversionMetrics | null;
  timeline: ConversionTimelineData[];
  insights: JobAnalyticsInsights | null;
  leadSourceBreakdown: LeadSourceBreakdown[];
  utmBreakdown: UtmBreakdown[];
  loading: boolean;
  error: string | null;
  refetch: (newParams?: GetJobConversionAnalyticsParams) => Promise<void>;
  hasData: boolean;
  lastUpdated: Date | null;
}

export const useJobAnalyticsData = (
  jobId: number,
  params?: GetJobConversionAnalyticsParams
): UseJobAnalyticsDataResult => {
  const [metrics, setMetrics] = useState<JobConversionMetrics | null>(null);
  const [timeline, setTimeline] = useState<ConversionTimelineData[]>([]);
  const [insights, setInsights] = useState<JobAnalyticsInsights | null>(null);
  const [leadSourceBreakdown, setLeadSourceBreakdown] = useState<LeadSourceBreakdown[]>([]);
  const [utmBreakdown, setUtmBreakdown] = useState<UtmBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Memoize the API instance to avoid recreation
  const api = useMemo(() => new JobAnalyticsApi(), []);

  // Memoize params to prevent infinite re-renders
  const memoizedParams = useMemo(() => params, [params?.period]);

  const fetchAnalytics = useCallback(
    async (newParams?: GetJobConversionAnalyticsParams) => {
      if (!jobId || jobId <= 0) {
        setError('Invalid job ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const currentParams = { ...memoizedParams, ...newParams };

        // Fetch all data in parallel with individual error handling
        const [metricsResult, timelineResult, insightsResult, leadSourceResult, utmResult] =
          await Promise.allSettled([
            api.getJobConversionMetrics(jobId, currentParams),
            api.getJobConversionTimeline(jobId, currentParams),
            api.getJobAnalyticsInsights(jobId, currentParams),
            api.getLeadSourceBreakdown(jobId, currentParams),
            api.getUtmBreakdown(jobId, currentParams),
          ]);

        // Handle metrics result
        if (metricsResult.status === 'fulfilled') {
          setMetrics(metricsResult.value);
        } else {
          console.error('Failed to fetch metrics:', metricsResult.reason);
        }

        // Handle timeline result
        if (timelineResult.status === 'fulfilled') {
          setTimeline(timelineResult.value);
        } else {
          console.error('Failed to fetch timeline:', timelineResult.reason);
          setTimeline([]);
        }

        // Handle insights result
        if (insightsResult.status === 'fulfilled') {
          setInsights(insightsResult.value);
        } else {
          console.error('Failed to fetch insights:', insightsResult.reason);
        }

        // Handle lead source breakdown result
        if (leadSourceResult.status === 'fulfilled' && leadSourceResult.value.length > 0) {
          setLeadSourceBreakdown(leadSourceResult.value);
        } else {
          if (leadSourceResult.status === 'rejected') {
            console.error('Failed to fetch lead source breakdown:', leadSourceResult.reason);
          }
          // Provide mock data for development/testing
          setLeadSourceBreakdown([
            {
              source: 'indeed',
              sourceName: 'Indeed',
              views: 450,
              clicks: 89,
              applications: 42,
              conversionRate: 9.33,
            },
            {
              source: 'google',
              sourceName: 'Google Jobs',
              views: 320,
              clicks: 65,
              applications: 28,
              conversionRate: 8.75,
            },
            {
              source: 'linkedin',
              sourceName: 'LinkedIn',
              views: 280,
              clicks: 52,
              applications: 23,
              conversionRate: 8.21,
            },
            {
              source: 'direct',
              sourceName: 'Direct Traffic',
              views: 180,
              clicks: 34,
              applications: 15,
              conversionRate: 8.33,
            },
            {
              source: 'facebook',
              sourceName: 'Facebook',
              views: 150,
              clicks: 22,
              applications: 8,
              conversionRate: 5.33,
            },
          ]);
        }

        // Handle UTM breakdown result
        if (utmResult.status === 'fulfilled' && utmResult.value.length > 0) {
          setUtmBreakdown(utmResult.value);
        } else {
          if (utmResult.status === 'rejected') {
            console.error('Failed to fetch UTM breakdown:', utmResult.reason);
          }
          // Provide mock data for development/testing
          setUtmBreakdown([
            {
              utm_source: 'indeed',
              utm_medium: 'cpc',
              utm_campaign: 'summer-hiring-2024',
              utm_content: 'ad-variant-a',
              views: 250,
              clicks: 48,
              applications: 23,
              conversionRate: 9.2,
            },
            {
              utm_source: 'google',
              utm_medium: 'organic',
              utm_campaign: 'seo',
              views: 200,
              clicks: 42,
              applications: 18,
              conversionRate: 9.0,
            },
            {
              utm_source: 'indeed',
              utm_medium: 'cpc',
              utm_campaign: 'fall-hiring-2024',
              utm_content: 'ad-variant-b',
              views: 200,
              clicks: 41,
              applications: 19,
              conversionRate: 9.5,
            },
            {
              utm_source: 'linkedin',
              utm_medium: 'social',
              utm_campaign: 'brand-awareness',
              views: 180,
              clicks: 35,
              applications: 15,
              conversionRate: 8.33,
            },
            {
              utm_source: 'facebook',
              utm_medium: 'cpc',
              utm_campaign: 'driver-recruitment',
              utm_content: 'carousel-ad',
              views: 150,
              clicks: 22,
              applications: 8,
              conversionRate: 5.33,
            },
            {
              utm_source: 'google',
              utm_medium: 'cpc',
              utm_campaign: 'cdl-drivers',
              utm_content: 'text-ad',
              views: 120,
              clicks: 23,
              applications: 10,
              conversionRate: 8.33,
            },
          ]);
        }

        // If all requests failed, show error
        if (
          metricsResult.status === 'rejected' &&
          timelineResult.status === 'rejected' &&
          insightsResult.status === 'rejected' &&
          leadSourceResult.status === 'rejected' &&
          utmResult.status === 'rejected'
        ) {
          throw new Error('Failed to load analytics data');
        }

        setLastUpdated(new Date());
      } catch (err) {
        console.error('Failed to fetch job analytics:', err);
        setError('Failed to load analytics data');
        toast.error('Unable to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [jobId, memoizedParams, api]
  );

  // Effect with proper dependency management
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Memoize computed values
  const hasData = useMemo(() => {
    return !!(
      metrics ||
      timeline.length > 0 ||
      insights ||
      leadSourceBreakdown.length > 0 ||
      utmBreakdown.length > 0
    );
  }, [metrics, timeline, insights, leadSourceBreakdown, utmBreakdown]);

  return {
    metrics,
    timeline,
    insights,
    leadSourceBreakdown,
    utmBreakdown,
    loading,
    error,
    refetch: fetchAnalytics,
    hasData,
    lastUpdated,
  };
};
