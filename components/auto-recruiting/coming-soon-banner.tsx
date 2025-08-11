import React from 'react';

interface ComingSoonBannerProps {
  message?: string;
}

const ComingSoonBanner: React.FC<ComingSoonBannerProps> = ({
  message = 'Detailed analytics, performance metrics, and campaign management tools.',
}) => {
  return (
    <div className="mt-4">
      <p className="text-muted">
        <strong>Coming Soon:</strong> {message}
      </p>
    </div>
  );
};

export default ComingSoonBanner;
