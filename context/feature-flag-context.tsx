import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import FeatureFlagsApi, { FeatureFlag } from '../pages/api/feature-flags';
import { useAuth } from '../hooks/use-auth';

interface FeatureFlagContextType {
  flags: Record<string, boolean>;
  allFlags: FeatureFlag[];
  isLoading: boolean;
  error: string | null;
  isFeatureEnabled: (key: string) => boolean;
  refreshFlags: () => Promise<void>;
  updateFlag: (flag: FeatureFlag) => void;
  removeFlag: (id: number) => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};

interface FeatureFlagProviderProps {
  children: React.ReactNode;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({ children }) => {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [allFlags, setAllFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const api = new FeatureFlagsApi();

  const refreshFlags = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get enabled features for the current user context
      const enabledFeatures = await api.getEnabledFeatures(user?.id, user?.company?.id);

      // Get all flags for admin interface
      const allFeatureFlags = await api.getAll();

      setFlags(enabledFeatures);
      setAllFlags(allFeatureFlags);
    } catch (err) {
      console.error('Failed to fetch feature flags:', err);
      setError('Failed to load feature flags');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.company?.id]);

  // Initial load and refresh when user changes
  useEffect(() => {
    refreshFlags();
  }, [refreshFlags]);

  const isFeatureEnabled = useCallback(
    (key: string): boolean => {
      return flags[key] === true;
    },
    [flags]
  );

  // Helper functions for admin interface
  const updateFlag = useCallback(
    (flag: FeatureFlag) => {
      setAllFlags((prev) => prev.map((f) => (f.id === flag.id ? flag : f)));
      // Re-evaluate enabled features if this might affect current user
      refreshFlags();
    },
    [refreshFlags]
  );

  const removeFlag = useCallback(
    (id: number) => {
      setAllFlags((prev) => prev.filter((f) => f.id !== id));
      // Re-evaluate enabled features
      refreshFlags();
    },
    [refreshFlags]
  );

  const value: FeatureFlagContextType = {
    flags,
    allFlags,
    isLoading,
    error,
    isFeatureEnabled,
    refreshFlags,
    updateFlag,
    removeFlag,
  };

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
};

export default FeatureFlagContext;

// Convenience hook for checking a single feature flag
export const useFeatureFlag = (key: string): boolean => {
  const { isFeatureEnabled } = useFeatureFlags();
  return isFeatureEnabled(key);
};
