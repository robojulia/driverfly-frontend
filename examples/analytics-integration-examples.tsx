/**
 * Example usage of the Job Analytics System
  const handleJobClick = (job) => {
    trackJobClick(job.id, job.company.id, 'job-title', {
      source: 'job_listings_page',
      buttonType: 'job_title',
      listPosition: jobs.findIndex(j => j.id === job.id) + 1,
    });
  };This file demonstrates how to integrate job analytics tracking
 * throughout your application for comprehensive funnel tracking.
 */

import React from 'react';
import {
  useJobAnalytics,
  useAutoJobViewTracking,
  useJobClickTracking,
} from '../hooks/use-job-analytics';

// Example 1: Job Detail Page Component
export const JobDetailPageExample = ({ job }) => {
  // Automatically track job view when component mounts
  useAutoJobViewTracking(job?.id, job?.company?.id, {
    source: 'job_detail_page',
    quickApply: false,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    referrer: typeof window !== 'undefined' ? document.referrer : undefined,
  });

  // Manual tracking for specific interactions
  const { trackJobClick, trackApplicationStart } = useJobAnalytics();

  const handleApplyClick = () => {
    trackJobClick(job.id, job.company.id, 'apply-button', {
      source: 'job_detail_page',
      buttonType: 'apply_now',
    });

    trackApplicationStart(job.id, job.company.id, {
      source: 'job_detail_page',
      applicationType: 'full_application',
    });
  };

  return (
    <div>
      <h1>{job.title}</h1>
      <button onClick={handleApplyClick}>Apply Now</button>
    </div>
  );
};

// Example 2: Job Listing Component
export const JobListingExample = ({ jobs }) => {
  const { trackJobClick } = useJobAnalytics();

  const handleJobClick = (job) => {
    trackJobClick(job.id, job.company.id, 'job_listing_click', {
      source: 'job_listings_page',
      buttonType: 'job_title',
      listPosition: jobs.findIndex((j) => j.id === job.id) + 1,
    });
  };

  return (
    <div>
      {jobs.map((job, index) => (
        <div key={job.id} onClick={() => handleJobClick(job)}>
          <h3>{job.title}</h3>
          <p>{job.company.name}</p>
        </div>
      ))}
    </div>
  );
};

// Example 3: Using the click tracking hook
export const JobCardExample = ({ job }) => {
  // Hook automatically handles the analytics tracking
  const handleClick = useJobClickTracking(job.id, job.company.id, 'job-details', {
    source: 'search_results',
    buttonType: 'job_card',
  });

  return (
    <div onClick={handleClick}>
      <h3>{job.title}</h3>
      <p>{job.company.name}</p>
    </div>
  );
};

// Example 4: Programmatic tracking
export const ProgrammaticExample = () => {
  const { trackJobView, trackJobClick, getSessionInfo, flush } = useJobAnalytics();

  // Track views programmatically
  const trackJobViews = async (jobIds, companyId) => {
    for (const jobId of jobIds) {
      await trackJobView(jobId, companyId, {
        source: 'bulk_import',
        medium: 'programmatic',
      });
    }

    // Force flush to ensure events are sent
    await flush();
  };

  // Debug session information
  const debugSession = () => {
    const sessionInfo = getSessionInfo();
    console.log('Current session:', sessionInfo);
  };

  return (
    <div>
      <button onClick={() => trackJobViews([1, 2, 3], 123)}>Track Multiple Views</button>
      <button onClick={debugSession}>Debug Session</button>
    </div>
  );
};

// Example 5: Error handling and retry
export const ErrorHandlingExample = () => {
  const { trackJobClick } = useJobAnalytics();

  const handleRiskyClick = async () => {
    try {
      // The analytics service handles retries automatically
      await trackJobClick(123, 456, 'risky_action', {
        source: 'experimental_feature',
        experiment: 'new_apply_flow',
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
      // App continues normally - analytics failures don't break user experience
    }
  };

  return <button onClick={handleRiskyClick}>Action with Analytics</button>;
};

/**
 * Integration Checklist:
 *
 * 1. ✅ Job Detail Pages: Add useAutoJobViewTracking
 * 2. ✅ Apply Buttons: Add trackJobClick + trackApplicationStart
 * 3. ✅ Job Listings: Add trackJobClick for each job interaction
 * 4. ✅ Company Links: Add trackJobClick for company profile visits
 * 5. ⏳ Search Results: Add trackJobClick for search result clicks
 * 6. ⏳ Save Job: Add trackJobClick for job save actions
 * 7. ⏳ Share Job: Add trackJobClick for job sharing
 * 8. ⏳ Email Applications: Add trackApplicationStart for email applications
 * 9. ⏳ External Apply: Add trackJobClick for external application redirects
 * 10. ⏳ Related Jobs: Add trackJobClick for related job clicks
 *
 * Backend Integration:
 * 1. ⏳ Complete analytics controller endpoints
 * 2. ⏳ Set up aggregation jobs
 * 3. ⏳ Create analytics dashboard
 * 4. ⏳ Set up alerting for unusual patterns
 * 5. ⏳ Implement data retention policies
 */
