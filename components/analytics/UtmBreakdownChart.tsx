import React, { useMemo, useState } from 'react';
import { Card, Table, Badge, ButtonGroup, Button } from 'react-bootstrap';
import { UtmBreakdown } from '../../pages/api/job-analytics';

interface UtmBreakdownChartProps {
  data: UtmBreakdown[];
}

type UtmGroupBy = 'source' | 'medium' | 'campaign' | 'content';

export const UtmBreakdownChart: React.FC<UtmBreakdownChartProps> = ({ data }) => {
  const [groupBy, setGroupBy] = useState<UtmGroupBy>('source');

  // Group and aggregate data based on selected UTM parameter
  const groupedData = useMemo(() => {
    const groups = new Map<
      string,
      { views: number; clicks: number; applications: number; count: number }
    >();

    data.forEach((item) => {
      let key: string;
      switch (groupBy) {
        case 'source':
          key = item.utm_source || '(not set)';
          break;
        case 'medium':
          key = item.utm_medium || '(not set)';
          break;
        case 'campaign':
          key = item.utm_campaign || '(not set)';
          break;
        case 'content':
          key = item.utm_content || '(not set)';
          break;
        default:
          key = '(not set)';
      }

      const existing = groups.get(key) || { views: 0, clicks: 0, applications: 0, count: 0 };
      groups.set(key, {
        views: existing.views + item.views,
        clicks: existing.clicks + item.clicks,
        applications: existing.applications + item.applications,
        count: existing.count + 1,
      });
    });

    return Array.from(groups.entries())
      .map(([key, values]) => ({
        key,
        ...values,
        conversionRate: values.views > 0 ? (values.applications / values.views) * 100 : 0,
      }))
      .sort((a, b) => b.applications - a.applications);
  }, [data, groupBy]);

  // Calculate totals
  const totals = useMemo(() => {
    return groupedData.reduce(
      (acc, item) => ({
        views: acc.views + item.views,
        clicks: acc.clicks + item.clicks,
        applications: acc.applications + item.applications,
      }),
      { views: 0, clicks: 0, applications: 0 }
    );
  }, [groupedData]);

  const getConversionRateColor = (rate: number) => {
    if (rate >= 10) return 'success';
    if (rate >= 5) return 'warning';
    return 'secondary';
  };

  const getGroupByLabel = (type: UtmGroupBy) => {
    switch (type) {
      case 'source':
        return 'Source';
      case 'medium':
        return 'Medium';
      case 'campaign':
        return 'Campaign';
      case 'content':
        return 'Content';
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        No UTM parameter data available for the selected period
      </div>
    );
  }

  return (
    <div>
      {/* Group By Selector */}
      <div className="mb-3">
        <small className="text-muted d-block mb-2">Group by UTM parameter:</small>
        <ButtonGroup size="sm">
          {(['source', 'medium', 'campaign', 'content'] as UtmGroupBy[]).map((type) => (
            <Button
              key={type}
              variant={groupBy === type ? 'primary' : 'outline-primary'}
              onClick={() => setGroupBy(type)}
            >
              {getGroupByLabel(type)}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div className="table-responsive">
        <Table hover className="mb-0">
          <thead>
            <tr>
              <th>UTM {getGroupByLabel(groupBy)}</th>
              <th className="text-end">Views</th>
              <th className="text-end">Clicks</th>
              <th className="text-end">Applications</th>
              <th className="text-end">Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {groupedData.map((item, index) => (
              <tr key={index}>
                <td>
                  <strong>{item.key}</strong>
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
          {groupedData.length > 1 && (
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
