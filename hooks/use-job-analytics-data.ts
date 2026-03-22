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
        if (leadSourceResult.status === 'fulfilled') {
          setLeadSourceBreakdown(leadSourceResult.value);
        } else {
          console.error('Failed to fetch lead source breakdown:', leadSourceResult.reason);
          setLeadSourceBreakdown([]);
        }

        // Handle UTM breakdown result
        if (utmResult.status === 'fulfilled') {
          setUtmBreakdown(utmResult.value);
        } else {
          console.error('Failed to fetch UTM breakdown:', utmResult.reason);
          setUtmBreakdown([]);
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
