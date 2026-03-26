import React from 'react';
import { JobConversionMetrics } from '../../pages/api/job-analytics';

interface ConversionFunnelChartProps {
  metrics: JobConversionMetrics;
}

interface FunnelStageProps {
  label: string;
  sublabel: string | null;
  count: number;
  widthPct: number;
  color: string;
  isLast?: boolean;
}

const LIGHT_COLORS = ['#B4FD55', '#ffd93d'];

const FunnelStage: React.FC<FunnelStageProps> = ({ label, sublabel, count, widthPct, color, isLast = false }) => {
  const textColor = LIGHT_COLORS.includes(color) ? '#1d4355' : 'white';

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
        <div>
          <span className="fw-semibold">{label}</span>
          {sublabel && (
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
              {sublabel}
            </div>
          )}
        </div>
        <span className="fw-bold">{count.toLocaleString()}</span>
      </div>

      {/* Track */}
      <div style={{ height: 36, backgroundColor: '#f0f4f8', borderRadius: 6, overflow: 'hidden' }}>
        {/* Fill — always at least 2px so zero isn't invisible */}
        <div
          style={{
            height: '100%',
            width: `${Math.max(widthPct, widthPct === 0 ? 0 : 1)}%`,
            backgroundColor: color,
            borderRadius: 6,
            transition: 'width 0.4s ease',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 10,
          }}
        >
          {widthPct > 8 && (
            <span style={{ color: textColor, fontWeight: 600, fontSize: '0.85rem' }}>
              {count.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {!isLast && (
        <div style={{ textAlign: 'center', color: '#adb5bd', fontSize: '1rem', lineHeight: 1.2, marginTop: 2 }}>
          ▼
        </div>
      )}
    </div>
  );
};

export const ConversionFunnelChart: React.FC<ConversionFunnelChartProps> = ({ metrics }) => {
  const allValues = [metrics.views, metrics.totalClicks, metrics.totalApplications];
  const maxValue = Math.max(...allValues, 1);

  const stages = [
    {
      label: 'Job Views',
      sublabel: null,
      count: metrics.views,
      color: '#1d4355',
    },
    {
      label: 'Total Clicks',
      sublabel:
        metrics.clickToApply || metrics.clickToCompany
          ? `Apply Button: ${metrics.clickToApply.toLocaleString()} · Other: ${metrics.clickToCompany.toLocaleString()}`
          : null,
      count: metrics.totalClicks,
      color: '#2ec8c4',
    },
    {
      label: 'Total Applications',
      sublabel:
        metrics.shortFormApplications || metrics.fullApplications
          ? `Short Form: ${metrics.shortFormApplications.toLocaleString()} · Full: ${metrics.fullApplications.toLocaleString()}`
          : null,
      count: metrics.totalApplications,
      color: '#B4FD55',
    },
  ];

  const hasAnyData = allValues.some((v) => v > 0);

  if (!hasAnyData) {
    return (
      <div className="text-center py-4 text-muted">
        <div className="h5">No Data Available</div>
        <p>Conversion funnel will appear once this job receives views and interactions.</p>
      </div>
    );
  }

  return (
    <div>
      <small className="text-muted d-block mb-3">
        Views → clicks → completed applications
      </small>

      {stages.map((stage, index) => (
        <FunnelStage
          key={stage.label}
          label={stage.label}
          sublabel={stage.sublabel}
          count={stage.count}
          widthPct={(stage.count / maxValue) * 100}
          color={stage.color}
          isLast={index === stages.length - 1}
        />
      ))}

      {/* Conversion rate summary */}
      <div className="mt-3 p-3 bg-light rounded">
        <div className="d-flex justify-content-between flex-wrap gap-2">
          <div className="text-center">
            <div className="fw-bold">{metrics.viewToClickRate?.toFixed(1) ?? '—'}%</div>
            <small className="text-muted">View → Click</small>
          </div>
          <div className="text-center">
            <div className="fw-bold">{metrics.clickToApplicationRate?.toFixed(1) ?? '—'}%</div>
            <small className="text-muted">Click → Application</small>
          </div>
          <div className="text-center">
            <div className="fw-bold">{metrics.overallConversionRate?.toFixed(1) ?? '—'}%</div>
            <small className="text-muted">Overall Conversion</small>
          </div>
        </div>
      </div>
    </div>
  );
};
