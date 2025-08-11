import React from 'react';
import { PeopleFill } from 'react-bootstrap-icons';
import StatCard from './stat-card';

interface QuickStatsProps {
  thisWeekApplicants?: number;
  isLoading?: boolean;
}

const QuickStats: React.FC<QuickStatsProps> = ({ thisWeekApplicants = 0, isLoading = false }) => {
  return (
    <div className="row justify-content-center">
      <StatCard
        icon={<PeopleFill size={32} />}
        value={isLoading ? '...' : thisWeekApplicants}
        label="Drivers Added This Week"
        iconColor="text-primary"
      />
    </div>
  );
};

export default QuickStats;
