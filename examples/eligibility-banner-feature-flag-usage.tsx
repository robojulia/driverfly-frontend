/**
 * Example: Using Feature Flags with EligibilityBanner
 *
 * This example demonstrates how the EligibilityBanner component
 * now uses feature flags to control its visibility.
 */

import React from 'react';
import { EligibilityBanner } from '../components/eligibility/EligibilityBanner';
import { useFeatureFlags } from '../context/feature-flag-context';

// Example job component that includes the EligibilityBanner
export function JobDetailsWithEligibilityBanner({ jobId }: { jobId: number }) {
  const { isFeatureEnabled, flags } = useFeatureFlags();

  return (
    <div>
      <h1>Job Details</h1>

      {/* 
        The EligibilityBanner will automatically check for the 
        'SHOW_ELIGIBILITY_BANNER' feature flag internally.
        If the flag is disabled, the banner won't render at all.
      */}
      <EligibilityBanner jobId={jobId} />

      {/* Optional: Show debug info about the feature flag */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            fontSize: '0.8rem',
          }}
        >
          <strong>Debug Info:</strong>
          <ul>
            <li>
              SHOW_ELIGIBILITY_BANNER: {flags.SHOW_ELIGIBILITY_BANNER ? 'Enabled' : 'Disabled'}
            </li>
            <li>
              Banner should be: {isFeatureEnabled('SHOW_ELIGIBILITY_BANNER') ? 'Visible' : 'Hidden'}
            </li>
          </ul>
        </div>
      )}

      <div>
        {/* Rest of job details content */}
        <p>Job description and other content...</p>
      </div>
    </div>
  );
}

/*
USAGE INSTRUCTIONS:

1. Create the feature flag in the admin interface:
   - Key: SHOW_ELIGIBILITY_BANNER
   - Name: Show Eligibility Banner
   - Description: Controls whether the eligibility banner is displayed on job detail pages
   - Enabled: true/false
   - Conditions: {} (empty for simple on/off)

2. The EligibilityBanner component will automatically respect this flag:
   - When enabled: Banner shows normally with eligibility data
   - When disabled: Banner returns null and doesn't render

3. Advanced usage with conditions:
   You can also use conditions to show the banner only for certain scenarios:
   
   Example conditions:
   {
     "userRoles": ["admin", "manager"],
     "companySize": "large"
   }
   
   This would only show the banner for admin/manager users at large companies.

4. Testing:
   - Toggle the flag in the admin interface at /admin/feature-flags
   - The banner should appear/disappear immediately on job detail pages
   - No code changes or deployments needed

5. Gradual rollout:
   You can use this pattern to gradually roll out the eligibility banner feature:
   - Start with disabled
   - Enable for internal testing
   - Enable for specific user groups
   - Enable for all users
*/
