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

  // Calculate total interactions from views (apply clicks + DHA starts)
  const totalInteractions = metrics.clickToApply + (metrics.applicationsStarted || 0);

  const stages = [
    {
      label: 'Job Views',
      count: metrics.views,
      percentage: 100,
      color: '#0d6efd', // Bootstrap primary blue
    },
  ];

  // Show the two parallel paths from views
  const parallelPaths = [
    {
      label: 'Apply Clicks',
      count: metrics.clickToApply,
      percentage: (metrics.clickToApply / maxValue) * 100,
      color: '#6f42c1', // Bootstrap purple
    },
    {
      label: 'Full Applications Started',
      count: metrics.applicationsStarted || 0,
      percentage: ((metrics.applicationsStarted || 0) / maxValue) * 100,
      color: '#fd7e14', // Bootstrap orange
    },
  ];

  const finalStage = {
    label: 'Applications Completed',
    count: metrics.totalApplications,
    percentage: (metrics.totalApplications / maxValue) * 100,
    color: '#198754', // Bootstrap green
  };

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
          Job seekers can take multiple paths from viewing to applying
        </small>
      </div>

      <div className="min-width-300">
        {/* First stage - Job Views */}
        <FunnelStage
          key="views"
          label={stages[0].label}
          count={stages[0].count}
          percentage={stages[0].percentage}
          width={stages[0].percentage}
          color={stages[0].color}
          isLast={false}
        />

        {/* Parallel paths section */}
        <div className="my-3 ps-3">
          <div className="small text-muted mb-2 text-center">↓ Multiple interaction paths ↓</div>

          {parallelPaths.map((path, index) => (
            <div key={path.label} className="mb-2">
              <FunnelStage
                label={path.label}
                count={path.count}
                percentage={path.percentage}
                width={path.percentage}
                color={path.color}
                isLast={false}
              />
            </div>
          ))}

          <div className="small text-muted text-center mt-2">↓ Both paths can lead to ↓</div>
        </div>

        {/* Final stage - Applications Completed */}
        <FunnelStage
          key="completed"
          label={finalStage.label}
          count={finalStage.count}
          percentage={finalStage.percentage}
          width={finalStage.percentage}
          color={finalStage.color}
          isLast={true}
        />
      </div>

      <div className="mt-4 p-3 bg-light rounded">
        <div className="row text-center g-2">
          <div className="col-12 col-md-3">
            <div className="h6 mb-1">{metrics.clickToApply}</div>
            <div className="small text-muted">Apply Clicks</div>
          </div>
          <div className="col-12 col-md-3">
            <div className="h6 mb-1">{metrics.applicationsStarted || 0}</div>
            <div className="small text-muted">DHA Starts</div>
          </div>
          <div className="col-12 col-md-3">
            <div className="h6 mb-1">{totalInteractions}</div>
            <div className="small text-muted">Total Interactions</div>
          </div>
          <div className="col-12 col-md-3">
            <div className="h6 mb-1">{metrics.totalApplications}</div>
            <div className="small text-muted">Applications Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};
