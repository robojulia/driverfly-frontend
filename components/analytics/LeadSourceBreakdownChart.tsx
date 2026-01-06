import React, { useMemo } from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { LeadSourceBreakdown } from '../../pages/api/job-analytics';

interface LeadSourceBreakdownChartProps {
  data: LeadSourceBreakdown[];
}

export const LeadSourceBreakdownChart: React.FC<LeadSourceBreakdownChartProps> = ({ data }) => {
  // Sort by applications descending
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.applications - a.applications);
  }, [data]);

  // Calculate totals
  const totals = useMemo(() => {
    return data.reduce(
      (acc, item) => ({
        views: acc.views + item.views,
        clicks: acc.clicks + item.clicks,
        applications: acc.applications + item.applications,
      }),
      { views: 0, clicks: 0, applications: 0 }
    );
  }, [data]);

  const getConversionRateColor = (rate: number) => {
    if (rate >= 10) return 'success';
    if (rate >= 5) return 'warning';
    return 'secondary';
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        No lead source data available for the selected period
      </div>
    );
  }

  return (
    <div>
      <div className="table-responsive">
        <Table hover className="mb-0">
          <thead>
            <tr>
              <th>Lead Source</th>
              <th className="text-end">Views</th>
              <th className="text-end">Clicks</th>
              <th className="text-end">Applications</th>
              <th className="text-end">Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index}>
                <td>
                  <strong>{item.sourceName || item.source || 'Direct'}</strong>
                </td>
                <td className="text-end">{item.views.toLocaleString()}</td>
                <td className="text-end">{item.clicks.toLocaleString()}</td>
                <td className="text-end">{item.applications.toLocaleString()}</td>
                <td className="text-end">
                  <Badge bg={getConversionRateColor(item.conversionRate)}>
                    {item.conversionRate.toFixed(1)}%
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
          {data.length > 1 && (
            <tfoot>
              <tr className="table-active fw-bold">
                <td>Total</td>
                <td className="text-end">{totals.views.toLocaleString()}</td>
                <td className="text-end">{totals.clicks.toLocaleString()}</td>
                <td className="text-end">{totals.applications.toLocaleString()}</td>
                <td className="text-end">
                  {totals.views > 0
                    ? ((totals.applications / totals.views) * 100).toFixed(1)
                    : '0.0'}
                  %
                </td>
              </tr>
            </tfoot>
          )}
        </Table>
      </div>
    </div>
  );
};
