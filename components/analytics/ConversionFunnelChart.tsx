import React from 'react';
import { JobConversionMetrics } from '../../pages/api/job-analytics';

interface ConversionFunnelChartProps {
  metrics: JobConversionMetrics;
}

interface FunnelStageProps {
  label: string;
  count: number;
  percentage: number;
  width: number;
  color: string;
  isLast?: boolean;
}

const FunnelStage: React.FC<FunnelStageProps> = ({
  label,
  count,
  percentage,
  width,
  color,
  isLast = false,
}) => {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap">
        <span className="fw-medium text-truncate me-2">{label}</span>
        <span className="text-muted small text-nowrap">{count.toLocaleString()}</span>
      </div>

      <div className="position-relative">
        <div
          className="rounded"
          style={{
            height: '40px',
            backgroundColor: color,
            width: `${width}%`,
            minWidth: '80px',
            maxWidth: '100%',
            transition: 'width 0.3s ease',
          }}
        >
          <div
            className="d-flex align-items-center h-100 px-3 text-truncate"
            style={{ color: width > 50 ? 'white' : color }}
          >
            <span className="fw-medium">{count.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {!isLast && (
        <div className="text-center py-2">
          {/* Drop-off messages hidden - apply clicks and DHA starts are additive, not conversions */}
        </div>
      )}
    </div>
  );
};

export const ConversionFunnelChart: React.FC<ConversionFunnelChartProps> = ({ metrics }) => {
  const maxValue = metrics.views || 1; // Avoid division by zero

  const stages = [
    {
      label: 'Job Views',
      count: metrics.views,
      percentage: 100,
      color: '#1d4355',
    },
    {
      label: 'Apply Clicks',
      count: metrics.clickToApply,
      percentage: (metrics.clickToApply / maxValue) * 100,
      color: '#2ec8c4',
    },
    {
      label: 'Applications Completed',
      count: metrics.totalApplications,
      percentage: (metrics.totalApplications / maxValue) * 100,
      color: '#B4FD55',
    },
  ];

  if (maxValue === 0 || metrics.views === 0) {
    return (
      <div className="text-center py-4">
        <div className="text-muted">
          <div className="h5">No Data Available</div>
          <p>Conversion funnel will appear once this job receives views and interactions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <div className="mb-3">
        <small className="text-muted">
          Job posting conversion funnel - views to completed applications
        </small>
      </div>

      <div className="min-width-300">
        {/* Render each stage in sequence */}
        {stages.map((stage, index) => (
          <div key={stage.label} className="mb-3">
            <FunnelStage
              label={stage.label}
              count={stage.count}
              percentage={stage.percentage}
              width={stage.percentage}
              color={stage.color}
              isLast={index === stages.length - 1}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-light rounded">
        <div className="small text-muted">
          <strong>Period:</strong> Conversion rates calculated from total funnel data
        </div>
      </div>
    </div>
  );
};
