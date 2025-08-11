import React, { useState } from 'react';
import { Speedometer2 } from 'react-bootstrap-icons';
import { Alert } from 'reactstrap';
import DashboardHeader from './dashboard-header';
import EmptyState from './empty-state';
import QuickStats from './quick-stats';
import ComingSoonBanner from './coming-soon-banner';
import OptOutLink from './opt-out-link';
import OptOutModal from './opt-out-modal';
import AnalyticsDashboard from './analytics-dashboard';
import { useAutoRecruitingStats } from '../../hooks/useAutoRecruitingStats';

interface AutoRecruitingDashboardProps {
  onDisable?: () => Promise<void>;
}

const AutoRecruitingDashboard: React.FC<AutoRecruitingDashboardProps> = ({ onDisable }) => {
  const [showOptOutModal, setShowOptOutModal] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const { stats, isLoading, error, refetch } = useAutoRecruitingStats();

  const handleOptOut = async () => {
    if (!onDisable) return;

    setIsDisabling(true);
    try {
      await onDisable();
      setShowOptOutModal(false);
    } catch (error) {
      console.error('Error disabling auto-recruiting:', error);
    } finally {
      setIsDisabling(false);
    }
  };

  const hasAnalyticsData = stats && stats.totalUniqueApplicants > 0;

  return (
    <div>
      <DashboardHeader />

      {error && (
        <Alert color="danger" className="mb-4">
          <strong>Error loading analytics:</strong> {error}
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={refetch}>
            Retry
          </button>
        </Alert>
      )}

      {!hasAnalyticsData && !isLoading && !error && (
        <>
          <EmptyState
            title="Auto Recruiting is Active"
            description="Your auto recruiting system is running. We're actively finding qualified drivers from other companies and adding them to your applicant pool."
            icon={<Speedometer2 size={64} className="text-muted mb-3" />}
          />

          <QuickStats thisWeekApplicants={0} isLoading={false} />

          <ComingSoonBanner />
        </>
      )}

      {(hasAnalyticsData || isLoading) && (
        <>
          {hasAnalyticsData && <AnalyticsDashboard stats={stats!} isLoading={isLoading} />}

          {isLoading && (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading analytics...</span>
              </div>
              <p className="mt-2 text-muted">Loading your auto-recruiting analytics...</p>
            </div>
          )}
        </>
      )}

      <OptOutLink onOptOut={() => setShowOptOutModal(true)} />

      <OptOutModal
        isOpen={showOptOutModal}
        onClose={() => setShowOptOutModal(false)}
        onConfirm={handleOptOut}
        isDisabling={isDisabling}
      />
    </div>
  );
};

export default AutoRecruitingDashboard;
