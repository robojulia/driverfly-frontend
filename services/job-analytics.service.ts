import {
  AnalyticsEvent,
  TrackingMetadata,
  AnalyticsResponse,
  BatchAnalyticsResponse,
  AnalyticsClickType,
} from './analytics.types';
import analyticsApi from './analytics-api.service';

/**
 * JobAnalyticsService - Frontend analytics tracking service
 *
 * Features:
 * - Singleton pattern for consistent session tracking
 * - Batch processing to reduce server load
 * - Session-based deduplication
 * - Automatic retry mechanism
 * - UTM parameter tracking
 * - Page unload event handling
 */
export class JobAnalyticsService {
  private static instance: JobAnalyticsService;
  private sessionId: string;
  private batchQueue: AnalyticsEvent[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;
  private isOnline: boolean = true;
  private retryQueue: AnalyticsEvent[] = [];
  private viewedJobs: Set<string> = new Set(); // Track viewed jobs to prevent duplicates

  // Configuration
  private readonly BATCH_SIZE = 10;
  private readonly BATCH_TIMEOUT = 30000; // 30 seconds
  private readonly RETRY_DELAY = 60000; // 1 minute
  private readonly VIEW_DEDUP_WINDOW = 300000; // 5 minutes

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.setupBatchProcessing();
    this.setupNetworkListeners();
    this.setupPageUnloadHandler();

    // Load persisted session if available
    this.loadPersistedSession();
  }

  public static getInstance(): JobAnalyticsService {
    if (!JobAnalyticsService.instance) {
      // Only create instance in browser environment
      if (typeof window !== 'undefined') {
        JobAnalyticsService.instance = new JobAnalyticsService();
      } else {
        // Return a mock instance for SSR
        return {
          trackJobView: () => {},
          trackJobClick: () => {},
          trackApplicationStart: () => {},
          flush: () => Promise.resolve(),
          getSessionInfo: () => ({ sessionId: 'ssr', eventsQueued: 0 }),
          setDebugMode: () => {},
          clearSession: () => {},
        } as any;
      }
    }
    return JobAnalyticsService.instance;
  }

  /**
   * Get the base API URL for analytics requests
   */
  private getAnalyticsBaseUrl(): string {
    // Use the same environment variable as BaseApi
    let baseUrl = process.env.BASE_URL_API;

    // If not set, try to detect from window location in browser
    if (!baseUrl && typeof window !== 'undefined') {
      // In development, default to localhost:4000/api
      // In production, this should be set via environment variables
      const hostname = window.location.hostname;
      const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';

      if (isDevelopment) {
        baseUrl = 'http://localhost:4000/api';
      } else {
        // For production, construct from current domain
        const protocol = window.location.protocol;
        baseUrl = `${protocol}//${hostname}/api`;
      }
    }

    if (!baseUrl) {
      baseUrl = 'http://localhost:4000/api';
    }

    // Debug logging in development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.debug('[Analytics] Using base URL:', baseUrl);
      console.debug('[Analytics] Environment BASE_URL_API:', process.env.BASE_URL_API);
    }

    return baseUrl;
  }

  /**
   * Track job view with deduplication
   */
  public trackJobView(
    jobId: number,
    companyId: number,
    metadata?: Partial<TrackingMetadata>
  ): void {
    // Create deduplication key
    const dedupKey = this.createViewDedupKey(jobId);

    // Check if we've already tracked this view recently
    if (this.viewedJobs.has(dedupKey)) {
      console.debug(`[Analytics] Skipping duplicate view for job ${jobId}`);
      return;
    }

    // Mark as viewed
    this.viewedJobs.add(dedupKey);

    // Clean up old entries periodically
    setTimeout(() => {
      this.viewedJobs.delete(dedupKey);
    }, this.VIEW_DEDUP_WINDOW);

    this.queueEvent({
      jobId,
      companyId,
      eventType: 'view',
      metadata: {
        ...this.getBaseMetadata(),
        ...metadata,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        timestamp: Date.now(),
      },
    });

    console.debug(
      `[Analytics] Tracked job view: ${jobId}${
        metadata?.campaignId ? ` (campaign: ${metadata.campaignId})` : ''
      }`
    );
  }

  /**
   * Track job click (apply button, job title, etc.)
   */
  public trackJobClick(
    jobId: number,
    companyId: number,
    clickType: AnalyticsClickType,
    metadata?: Partial<TrackingMetadata>
  ): void {
    this.queueEvent({
      jobId,
      companyId,
      eventType: 'click',
      clickType,
      metadata: {
        ...this.getBaseMetadata(),
        ...metadata,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        timestamp: Date.now(),
      },
    });

    const campaignInfo = metadata?.campaignId || this.getBaseMetadata().campaignId;
    console.debug(
      `[Analytics] Tracked job click: ${jobId}, type: ${clickType}${
        campaignInfo ? ` (campaign: ${campaignInfo})` : ''
      }`
    );
  }

  /**
   * Track application start
   */
  public trackApplicationStart(
    jobId: number,
    companyId: number,
    metadata?: Partial<TrackingMetadata>
  ): void {
    this.queueEvent({
      jobId,
      companyId,
      eventType: 'application',
      metadata: {
        ...this.getBaseMetadata(),
        ...metadata,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        timestamp: Date.now(),
      },
    });

    console.debug(`[Analytics] Tracked application start: ${jobId}`);
  }

  /**
   * Manually flush all pending events
   */
  public async flush(): Promise<void> {
    if (this.batchQueue.length > 0) {
      await this.flushBatch();
    }
  }

  /**
   * Get current session information
   */
  public getSessionInfo(): { sessionId: string; queueSize: number; viewedJobs: number } {
    return {
      sessionId: this.sessionId,
      queueSize: this.batchQueue.length,
      viewedJobs: this.viewedJobs.size,
    };
  }

  // Private methods

  private queueEvent(event: AnalyticsEvent): void {
    this.batchQueue.push(event);

    // Auto-flush if queue gets large
    if (this.batchQueue.length >= this.BATCH_SIZE) {
      this.flushBatch();
    }
  }

  private setupBatchProcessing(): void {
    // Flush batch periodically
    this.batchTimeout = setInterval(() => {
      if (this.batchQueue.length > 0) {
        this.flushBatch();
      }
    }, this.BATCH_TIMEOUT);

    // Process retry queue
    setInterval(() => {
      if (this.retryQueue.length > 0 && this.isOnline) {
        this.processRetryQueue();
      }
    }, this.RETRY_DELAY);
  }

  private setupNetworkListeners(): void {
    // Only set up listeners in browser environment
    if (typeof window === 'undefined') return;

    // Handle online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.debug('[Analytics] Back online, processing retry queue');
      this.processRetryQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.debug('[Analytics] Gone offline, queuing events for retry');
    });
  }

  private setupPageUnloadHandler(): void {
    // Only set up handlers in browser environment
    if (typeof window === 'undefined') return;

    // Handle page unload - use sendBeacon for reliability
    window.addEventListener('beforeunload', () => {
      this.flushBatch(true);
    });

    // Handle visibility change (mobile browsers)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushBatch(true);
      }
    });
  }

  private async flushBatch(useBeacon = false): Promise<void> {
    if (this.batchQueue.length === 0) return;

    const events = [...this.batchQueue];
    this.batchQueue = [];

    const payload = {
      events,
      sessionId: this.sessionId,
    };

    try {
      if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
        // Use sendBeacon for reliable delivery on page unload
        const baseUrl = this.getAnalyticsBaseUrl();
        const success = navigator.sendBeacon(
          `${baseUrl}/analytics/track-batch`,
          JSON.stringify(payload)
        );

        if (!success) {
          // Add to retry queue if beacon failed
          this.retryQueue.push(...events);
        }
      } else {
        // Use analytics API service for regular requests
        const result = await analyticsApi.trackBatch(events, this.sessionId);

        if (!result.success) {
          throw new Error(result.message || 'Batch processing failed');
        }

        console.debug(`[Analytics] Batch processed: ${result.processed} events`);
      }
    } catch (error) {
      console.warn('[Analytics] Batch processing failed, adding to retry queue:', error);

      // Add failed events to retry queue
      this.retryQueue.push(...events);

      // Persist to localStorage as backup
      this.persistFailedEvents(events);
    }
  }

  private async processRetryQueue(): Promise<void> {
    if (this.retryQueue.length === 0) return;

    const eventsToRetry = this.retryQueue.splice(0, this.BATCH_SIZE);

    try {
      const response = await fetch('/api/analytics/track-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: eventsToRetry,
          sessionId: this.sessionId,
        }),
      });

      if (response.ok) {
        console.debug(`[Analytics] Retry successful: ${eventsToRetry.length} events`);
      } else {
        // Put events back in retry queue
        this.retryQueue.unshift(...eventsToRetry);
      }
    } catch (error) {
      // Put events back in retry queue
      this.retryQueue.unshift(...eventsToRetry);
      console.warn('[Analytics] Retry failed:', error);
    }
  }

  private getBaseMetadata(): TrackingMetadata {
    // Return empty metadata if not in browser environment
    if (typeof window === 'undefined') {
      return {};
    }

    const urlParams = new URLSearchParams(window.location.search);

    // Extract campaign ID from both UTM parameter and direct campaignId parameter
    const utmCampaign = urlParams.get('utm_campaign');
    const directCampaignId = urlParams.get('campaignId');
    const campaignId = directCampaignId || utmCampaign || undefined;

    return {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      campaignId,
      source: urlParams.get('utm_source') || (directCampaignId ? 'campaign' : undefined),
      medium: urlParams.get('utm_medium') || (directCampaignId ? 'sms' : undefined),
    };
  }

  private createViewDedupKey(jobId: number): string {
    // Create a key that includes time window for deduplication
    const timeWindow = Math.floor(Date.now() / this.VIEW_DEDUP_WINDOW);
    return `${jobId}-${timeWindow}`;
  }

  private generateSessionId(): string {
    // Generate a unique session ID
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2);
    return `${timestamp}-${randomStr}`;
  }

  private loadPersistedSession(): void {
    try {
      // Try to load session from sessionStorage
      const persistedSessionId = sessionStorage.getItem('analytics_session_id');
      if (persistedSessionId) {
        this.sessionId = persistedSessionId;
      } else {
        sessionStorage.setItem('analytics_session_id', this.sessionId);
      }

      // Load any failed events from localStorage
      const failedEvents = localStorage.getItem('analytics_failed_events');
      if (failedEvents) {
        const events = JSON.parse(failedEvents) as AnalyticsEvent[];
        this.retryQueue.push(...events);
        localStorage.removeItem('analytics_failed_events');
      }
    } catch (error) {
      console.warn('[Analytics] Failed to load persisted session:', error);
    }
  }

  private persistFailedEvents(events: AnalyticsEvent[]): void {
    try {
      const existingEvents = localStorage.getItem('analytics_failed_events');
      const allEvents = existingEvents ? [...JSON.parse(existingEvents), ...events] : events;

      // Limit storage size (keep only last 100 events)
      const limitedEvents = allEvents.slice(-100);

      localStorage.setItem('analytics_failed_events', JSON.stringify(limitedEvents));
    } catch (error) {
      console.warn('[Analytics] Failed to persist events:', error);
    }
  }

  // Cleanup method for testing or manual cleanup
  public cleanup(): void {
    if (this.batchTimeout) {
      clearInterval(this.batchTimeout);
      this.batchTimeout = null;
    }
    this.batchQueue = [];
    this.retryQueue = [];
    this.viewedJobs.clear();
  }
}

// Export singleton instance
export const jobAnalytics = JobAnalyticsService.getInstance();
