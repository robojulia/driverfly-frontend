import React from 'react';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = 'Auto Recruiting Dashboard',
  subtitle = 'Monitor your automated driver recruitment performance',
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="mb-1">{title}</h2>
        <p className="text-muted mb-0">{subtitle}</p>
      </div>
    </div>
  );
};

export default DashboardHeader;
