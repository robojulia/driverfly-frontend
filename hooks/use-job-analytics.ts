import { useEffect, useCallback, useRef } from 'react';
import { jobAnalytics, JobAnalyticsService } from '../services/job-analytics.service';
import { TrackingMetadata } from '../services/analytics.types';

/**
 * React hook for job analytics tracking
 *
 * Provides easy-to-use functions for tracking job interactions
 * with proper React lifecycle management
 */
export const useJobAnalytics = () => {
  const trackedViewsRef = useRef<Set<number>>(new Set());

  // Track job view with automatic deduplication per component lifecycle
  const trackJobView = useCallback(
    (jobId: number, companyId: number, metadata?: Partial<TrackingMetadata>) => {
      // Component-level deduplication (in addition to service-level)
      if (trackedViewsRef.current.has(jobId)) {
        return;
      }

      trackedViewsRef.current.add(jobId);
      jobAnalytics.trackJobView(jobId, companyId, metadata);
    },
    []
  );

  // Track job click
  const trackJobClick = useCallback(
    (jobId: number, companyId: number, clickType: string, metadata?: Partial<TrackingMetadata>) => {
      jobAnalytics.trackJobClick(jobId, companyId, clickType, metadata);
    },
    []
  );

  // Track application start
  const trackApplicationStart = useCallback(
    (jobId: number, companyId: number, metadata?: Partial<TrackingMetadata>) => {
      jobAnalytics.trackApplicationStart(jobId, companyId, metadata);
    },
    []
  );

  // Get session info for debugging
  const getSessionInfo = useCallback(() => {
    return jobAnalytics.getSessionInfo();
  }, []);

  // Flush pending events manually
  const flush = useCallback(async () => {
    await jobAnalytics.flush();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      trackedViewsRef.current.clear();
    };
  }, []);

  return {
    trackJobView,
    trackJobClick,
    trackApplicationStart,
    getSessionInfo,
    flush,
  };
};

/**
 * Hook for automatic job view tracking
 *
 * Automatically tracks job view when component mounts or job changes
 */
export const useAutoJobViewTracking = (
  jobId: number | undefined,
  companyId: number | undefined,
  metadata?: Partial<TrackingMetadata>,
  enabled: boolean = true
) => {
  const { trackJobView } = useJobAnalytics();

  useEffect(() => {
    if (enabled && jobId && companyId) {
      trackJobView(jobId, companyId, metadata);
    }
  }, [enabled, jobId, companyId, trackJobView, metadata]);
};

/**
 * Hook for tracking clicks with automatic event binding
 *
 * Returns a click handler that automatically tracks the event
 */
export const useJobClickTracking = (
  jobId: number,
  companyId: number,
  clickType: string,
  metadata?: Partial<TrackingMetadata>
) => {
  const { trackJobClick } = useJobAnalytics();

  return useCallback(
    (event?: React.MouseEvent) => {
      trackJobClick(jobId, companyId, clickType, metadata);
    },
    [jobId, companyId, clickType, metadata, trackJobClick]
  );
};
