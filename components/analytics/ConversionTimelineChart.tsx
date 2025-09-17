import React from 'react';
import { ConversionTimelineData } from '../../pages/api/job-analytics';

interface ConversionTimelineChartProps {
  timeline: ConversionTimelineData[];
  groupBy: 'day' | 'week';
  period: '7d' | '30d' | '90d';
}

interface GroupedBarChartProps {
  data: {
    label: string;
    views: number;
    applications: number;
  }[];
  height?: number;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.flatMap((d) => [d.views, d.applications]));

  if (maxValue === 0) {
    return (
      <div className="text-center py-4 text-muted">
        <div>No data available for this period</div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-end" style={{ height: `${height}px`, gap: '8px' }}>
        {data.map((item, index) => {
          const viewsHeight = (item.views / maxValue) * (height - 40);
          const applicationsHeight = (item.applications / maxValue) * (height - 40);

          return (
            <div
              key={index}
              className="flex-fill d-flex justify-content-center align-items-end"
              style={{ gap: '2px' }}
            >
              {/* Views bar */}
              <div className="d-flex flex-column justify-content-end" style={{ flex: 1 }}>
                <div
                  className="rounded-top"
                  style={{
                    height: `${Math.max(viewsHeight, 2)}px`,
                    backgroundColor: '#17a2b8', // Teal color like screenshot
                    minWidth: '12px',
                  }}
                  title={`${item.label} Views: ${item.views.toLocaleString()}`}
                />
              </div>
              {/* Applications bar */}
              <div className="d-flex flex-column justify-content-end" style={{ flex: 1 }}>
                <div
                  className="rounded-top"
                  style={{
                    height: `${Math.max(applicationsHeight, 2)}px`,
                    backgroundColor: '#28a745', // Green color like screenshot
                    minWidth: '12px',
                  }}
                  title={`${item.label} Applications: ${item.applications.toLocaleString()}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="d-flex mt-2" style={{ gap: '8px' }}>
        {data.map((item, index) => {
          const shouldShow = data.length <= 7 || index % Math.ceil(data.length / 7) === 0;
          return (
            <div key={index} className="flex-fill text-center">
              {shouldShow && (
                <small className="text-muted" style={{ fontSize: '11px' }}>
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

  // Prepare grouped chart data
  const groupedData = timeline.map((item) => ({
    label: formatDate(item.date, groupBy),
    views: item.views,
    applications: item.totalApplications,
  }));

  return (
    <div>
      {/* Grouped Chart */}
      <div className="mb-3">
        <div
          className="d-flex align-items-center justify-content-center mb-3"
          style={{ gap: '20px' }}
        >
          <div className="d-flex align-items-center">
            <div
              className="rounded me-2"
              style={{ width: '12px', height: '12px', backgroundColor: '#17a2b8' }}
            />
            <span className="fw-medium">Views</span>
          </div>
          <div className="d-flex align-items-center">
            <div
              className="rounded me-2"
              style={{ width: '12px', height: '12px', backgroundColor: '#28a745' }}
            />
            <span className="fw-medium">Applications</span>
          </div>
        </div>
        <GroupedBarChart data={groupedData} height={200} />
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
