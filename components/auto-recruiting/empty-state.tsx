import React from 'react';
import { Speedometer2 } from 'react-bootstrap-icons';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  comingSoonMessage?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Auto Recruiting is Active',
  description = "Your auto recruiting system is running. We're actively finding qualified drivers from other companies and adding them to your applicant pool.",
  icon = <Speedometer2 size={64} className="text-muted mb-3" />,
  comingSoonMessage = 'Detailed analytics, performance metrics, and campaign management tools.',
}) => {
  return (
    <div className="text-center py-5">
      <div className="mb-4">
        {icon}
        <h4>{title}</h4>
        <p className="text-muted mb-4">{description}</p>
      </div>
    </div>
  );
};

export default EmptyState;
