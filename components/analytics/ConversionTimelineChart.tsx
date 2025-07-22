import React from 'react';
import { ConversionTimelineData } from '../../pages/api/job-analytics';

interface ConversionTimelineChartProps {
  timeline: ConversionTimelineData[];
  groupBy: 'day' | 'week';
  period: '7d' | '30d' | '90d';
}

interface SimpleBarChartProps {
  data: { label: string; value: number; color: string }[];
  height?: number;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  if (maxValue === 0) {
    return (
      <div className="text-center py-4 text-muted">
        <div>No data available for this period</div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-end" style={{ height: `${height}px`, gap: '4px' }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          return (
            <div key={index} className="flex-fill d-flex flex-column justify-content-end">
              <div
                className="rounded-top"
                style={{
                  height: `${Math.max(barHeight, 2)}px`,
                  backgroundColor: item.color,
                  minWidth: '8px',
                }}
                title={`${item.label}: ${item.value.toLocaleString()}`}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis labels - show every nth label to avoid crowding */}
      <div className="d-flex mt-2" style={{ gap: '4px' }}>
        {data.map((item, index) => {
          const shouldShow = data.length <= 7 || index % Math.ceil(data.length / 7) === 0;
          return (
            <div key={index} className="flex-fill text-center">
              {shouldShow && (
                <small className="text-muted" style={{ fontSize: '10px' }}>
                  {item.label}
                </small>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ConversionTimelineChart: React.FC<ConversionTimelineChartProps> = ({
  timeline,
  groupBy,
  period,
}) => {
  const formatDate = (dateStr: string, groupBy: 'day' | 'week') => {
    const date = new Date(dateStr);

    if (groupBy === 'week') {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }

    // For daily view, format based on period
    if (period === '7d') {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (period === '30d') {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="text-muted">
          <div className="h5">No Timeline Data</div>
          <p>Timeline chart will appear once analytics data is available.</p>
        </div>
      </div>
    );
  }

  // Prepare chart data for views
  const viewsData = timeline.map((item) => ({
    label: formatDate(item.date, groupBy),
    value: item.views,
    color: '#0d6efd', // Bootstrap primary blue
  }));

  // Prepare chart data for applications
  const applicationsData = timeline.map((item) => ({
    label: formatDate(item.date, groupBy),
    value: item.totalApplications,
    color: '#198754', // Bootstrap green
  }));

  const totalViews = timeline.reduce((sum, item) => sum + item.views, 0);
  const totalApplications = timeline.reduce((sum, item) => sum + item.totalApplications, 0);
  const avgConversionRate = totalViews > 0 ? (totalApplications / totalViews) * 100 : 0;

  return (
    <div>
      {/* Summary Stats */}
      <div className="row mb-4">
        <div className="col-md-4 text-center">
          <div className="h4 text-primary mb-1">{totalViews.toLocaleString()}</div>
          <div className="small text-muted">Total Views</div>
        </div>
        <div className="col-md-4 text-center">
          <div className="h4 text-success mb-1">{totalApplications.toLocaleString()}</div>
          <div className="small text-muted">Total Applications</div>
        </div>
        <div className="col-md-4 text-center">
          <div className="h4 text-warning mb-1">{avgConversionRate.toFixed(1)}%</div>
          <div className="small text-muted">Avg Conversion Rate</div>
        </div>
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <div
                className="rounded me-2"
                style={{ width: '12px', height: '12px', backgroundColor: '#0d6efd' }}
              />
              <span className="fw-medium">Job Views</span>
            </div>
            <SimpleBarChart data={viewsData} height={150} />
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <div
                className="rounded me-2"
                style={{ width: '12px', height: '12px', backgroundColor: '#198754' }}
              />
              <span className="fw-medium">Applications</span>
            </div>
            <SimpleBarChart data={applicationsData} height={150} />
          </div>
        </div>
      </div>

      {/* Timeline Summary */}
      <div className="mt-3 p-3 bg-light rounded">
        <div className="small text-muted">
          <strong>Period:</strong> {groupBy === 'day' ? 'Daily' : 'Weekly'} view over{' '}
          {period === '7d' ? 'last 7 days' : period === '30d' ? 'last 30 days' : 'last 90 days'}
        </div>
      </div>
    </div>
  );
};
