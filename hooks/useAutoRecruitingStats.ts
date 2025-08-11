import { useState, useEffect } from 'react';
import {
  autoRecruitingApi,
  AutoRecruitingStats,
  JobRecruitmentStats,
  WeeklyTrend,
  // SourceBreakdown, // Hidden for now - contains sensitive source company data
} from '../services/auto-recruiting-api.service';

interface UseAutoRecruitingStatsReturn {
  stats: AutoRecruitingStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useAutoRecruitingStats = (): UseAutoRecruitingStatsReturn => {
  const [stats, setStats] = useState<AutoRecruitingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await autoRecruitingApi.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching auto-recruiting stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};

export type { AutoRecruitingStats, JobRecruitmentStats, WeeklyTrend /*, SourceBreakdown*/ };
