// Example of how to use feature flags in your components

import { useFeatureFlags, useFeatureFlag } from '../context/feature-flag-context';

// Method 1: Use the convenience hook for a single feature
export function ExampleComponent() {
  const isNewFeatureEnabled = useFeatureFlag('NEW_FEATURE');

  return (
    <div>
      {isNewFeatureEnabled ? (
        <div>New feature is enabled!</div>
      ) : (
        <div>Old feature implementation</div>
      )}
    </div>
  );
}

// Method 2: Use the full context for multiple features or admin purposes
export function AdvancedExampleComponent() {
  const { isFeatureEnabled, flags, allFlags, isLoading } = useFeatureFlags();

  if (isLoading) {
    return <div>Loading feature flags...</div>;
  }

  return (
    <div>
      {/* Check individual features */}
      {isFeatureEnabled('BETA_UI') && <div>Beta UI component</div>}

      {isFeatureEnabled('ADVANCED_SEARCH') && <button>Advanced Search</button>}

      {/* Show all enabled features for debugging (admin only) */}
      {process.env.NODE_ENV === 'development' && (
        <details>
          <summary>Enabled Features ({Object.keys(flags).length})</summary>
          <ul>
            {Object.entries(flags).map(([key, enabled]) => (
              <li key={key}>
                {key}: {enabled ? '✅' : '❌'}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
