import React from 'react';
import { EntryModeBreakdown } from '../../pages/api/job-analytics';

interface ApplicationsByEntryModeChartProps {
  data: EntryModeBreakdown[];
}

const ENTRY_MODE_COLORS: Record<string, string> = {
  DIGITAL_HIRING_APP: '#2ec8c4',
  SHORT_FORM_APPLICATION: '#1d4355',
  FACEBOOK_LEAD: '#4267B2',
  AUTO_RECRUITING_LEAD: '#B4FD55',
  MANUALLY_ADDED: '#ffd93d',
  COMPANY_UPLOADED: '#ff9f43',
  ATS_IMPORT: '#c77dff',
};

const DEFAULT_COLOR = '#6c757d';

function getEntryModeColor(entryMode: string): string {
  return ENTRY_MODE_COLORS[entryMode] || DEFAULT_COLOR;
}

function getTextColor(bgColor: string): string {
  const lightColors = ['#B4FD55', '#ffd93d'];
  return lightColors.includes(bgColor) ? '#1d4355' : 'white';
}

export const ApplicationsByEntryModeChart: React.FC<ApplicationsByEntryModeChartProps> = ({
  data,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        No entry mode data available for the selected period
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...sorted.map((d) => d.count), 1);
  const total = sorted.reduce((s, d) => s + d.count, 0);

  return (
    <div>
      {/* Legend */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        {sorted.map((item) => {
          const color = getEntryModeColor(item.entryMode);
          return (
            <div key={item.entryMode} className="d-flex align-items-center gap-1">
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: color,
                  flexShrink: 0,
                }}
              />
              <small className="fw-medium">{item.label || item.entryMode}</small>
            </div>
          );
        })}
      </div>

      {/* Horizontal bar chart */}
      {sorted.map((item) => {
        const color = getEntryModeColor(item.entryMode);
        const textColor = getTextColor(color);
        const barPct = (item.count / maxCount) * 100;
        const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0.0';

        return (
          <div key={item.entryMode} className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="fw-semibold" style={{ fontSize: '0.875rem' }}>
                {item.label || item.entryMode}
              </span>
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted">{item.count.toLocaleString()} applicants</small>
                <small
                  className="fw-bold"
                  style={{ minWidth: 42, textAlign: 'right', fontSize: '0.8rem' }}
                >
                  {pct}%
                </small>
              </div>
            </div>
            <div
              style={{
                height: 32,
                backgroundColor: '#f0f4f8',
                borderRadius: 6,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.max(barPct, 0.5)}%`,
                  backgroundColor: color,
                  borderRadius: 6,
                  transition: 'width 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 10,
                }}
              >
                {barPct > 10 && (
                  <small style={{ color: textColor, fontWeight: 600, fontSize: '0.8rem' }}>
                    {item.count.toLocaleString()}
                  </small>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div className="mt-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
        <small className="text-muted fw-semibold">Total applicants tracked: {total.toLocaleString()}</small>
        <small className="text-muted">{sorted.length} entry modes</small>
      </div>
    </div>
  );
};
