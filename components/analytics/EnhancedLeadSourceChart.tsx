import React, { useState, useMemo } from 'react';
import { Form, Row, Col, Badge } from 'react-bootstrap';
import { UtmBreakdown } from '../../pages/api/job-analytics';

interface EnhancedLeadSourceChartProps {
  data: UtmBreakdown[];
}

const SOURCE_COLORS = [
  '#1d4355',
  '#2ec8c4',
  '#B4FD55',
  '#ff6b6b',
  '#ffd93d',
  '#6bcb77',
  '#4d96ff',
  '#c77dff',
  '#ff9f43',
  '#ee5a24',
];

type ViewMode = 'applications' | 'views' | 'clicks';

export const EnhancedLeadSourceChart: React.FC<EnhancedLeadSourceChartProps> = ({ data }) => {
  const [filterSource, setFilterSource] = useState('');
  const [filterMedium, setFilterMedium] = useState('');
  const [filterCampaign, setFilterCampaign] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('applications');

  const sources = useMemo(
    () => [...new Set(data.map((d) => d.utm_source).filter(Boolean))] as string[],
    [data]
  );
  const mediums = useMemo(
    () => [...new Set(data.map((d) => d.utm_medium).filter(Boolean))] as string[],
    [data]
  );
  const campaigns = useMemo(
    () => [...new Set(data.map((d) => d.utm_campaign).filter(Boolean))] as string[],
    [data]
  );

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      if (filterSource && d.utm_source !== filterSource) return false;
      if (filterMedium && d.utm_medium !== filterMedium) return false;
      if (filterCampaign && d.utm_campaign !== filterCampaign) return false;
      return true;
    });
  }, [data, filterSource, filterMedium, filterCampaign]);

  // Group by source for chart display
  const chartRows = useMemo(() => {
    const groups: Record<
      string,
      { views: number; clicks: number; applications: number; mediums: Set<string>; campaigns: Set<string> }
    > = {};

    filteredData.forEach((d) => {
      const key = d.utm_source || 'direct';
      if (!groups[key]) {
        groups[key] = { views: 0, clicks: 0, applications: 0, mediums: new Set(), campaigns: new Set() };
      }
      groups[key].views += d.views;
      groups[key].clicks += d.clicks;
      groups[key].applications += d.applications;
      if (d.utm_medium) groups[key].mediums.add(d.utm_medium);
      if (d.utm_campaign) groups[key].campaigns.add(d.utm_campaign);
    });

    return Object.entries(groups)
      .map(([source, stats]) => ({
        source,
        views: stats.views,
        clicks: stats.clicks,
        applications: stats.applications,
        conversionRate: stats.views > 0 ? (stats.applications / stats.views) * 100 : 0,
        mediums: [...stats.mediums].join(', '),
        campaigns: [...stats.campaigns].join(', '),
      }))
      .sort((a, b) => b[viewMode] - a[viewMode]);
  }, [filteredData, viewMode]);

  const maxValue = Math.max(...chartRows.map((r) => r[viewMode]), 1);

  const totals = useMemo(
    () =>
      filteredData.reduce(
        (acc, d) => ({
          views: acc.views + d.views,
          clicks: acc.clicks + d.clicks,
          applications: acc.applications + d.applications,
        }),
        { views: 0, clicks: 0, applications: 0 }
      ),
    [filteredData]
  );

  const getConversionColor = (rate: number) => {
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
      {/* Filters */}
      <Row className="g-2 mb-4 align-items-end">
        <Col md={3}>
          <Form.Label className="small fw-semibold mb-1">Source</Form.Label>
          <Form.Select
            size="sm"
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
          >
            <option value="">All Sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label className="small fw-semibold mb-1">Medium</Form.Label>
          <Form.Select
            size="sm"
            value={filterMedium}
            onChange={(e) => setFilterMedium(e.target.value)}
          >
            <option value="">All Mediums</option>
            {mediums.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label className="small fw-semibold mb-1">Campaign</Form.Label>
          <Form.Select
            size="sm"
            value={filterCampaign}
            onChange={(e) => setFilterCampaign(e.target.value)}
          >
            <option value="">All Campaigns</option>
            {campaigns.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label className="small fw-semibold mb-1">Show</Form.Label>
          <Form.Select
            size="sm"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
          >
            <option value="applications">Applications</option>
            <option value="views">Views</option>
            <option value="clicks">Clicks</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Bar chart */}
      <div>
        {chartRows.length === 0 ? (
          <div className="text-center text-muted py-3">No data matches the selected filters</div>
        ) : (
          chartRows.map((item, i) => {
            const value = item[viewMode];
            const barPct = (value / maxValue) * 100;
            const color = SOURCE_COLORS[i % SOURCE_COLORS.length];
            const textColor = color === '#B4FD55' || color === '#ffd93d' ? '#1d4355' : 'white';
            return (
              <div key={item.source} className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div>
                    <span className="fw-semibold" style={{ fontSize: '0.875rem' }}>
                      {item.source}
                    </span>
                    {item.mediums && (
                      <small className="text-muted ms-2" style={{ fontSize: '0.75rem' }}>
                        via {item.mediums}
                      </small>
                    )}
                    {item.campaigns && (
                      <small className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>
                        — {item.campaigns}
                      </small>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <small className="text-muted">
                      {value.toLocaleString()} {viewMode}
                    </small>
                    <Badge bg={getConversionColor(item.conversionRate)}>
                      {item.conversionRate.toFixed(1)}% conv.
                    </Badge>
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
                    {barPct > 12 && (
                      <small style={{ color: textColor, fontWeight: 600, fontSize: '0.8rem' }}>
                        {value.toLocaleString()}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary totals */}
      <div className="mt-4 p-3 bg-light rounded">
        <Row className="text-center g-0">
          <Col>
            <div className="fw-bold fs-6">{totals.views.toLocaleString()}</div>
            <small className="text-muted">Total Views</small>
          </Col>
          <Col>
            <div className="fw-bold fs-6">{totals.clicks.toLocaleString()}</div>
            <small className="text-muted">Total Clicks</small>
          </Col>
          <Col>
            <div className="fw-bold fs-6">{totals.applications.toLocaleString()}</div>
            <small className="text-muted">Total Applications</small>
          </Col>
          <Col>
            <div className="fw-bold fs-6">
              {totals.views > 0
                ? ((totals.applications / totals.views) * 100).toFixed(1)
                : '0.0'}
              %
            </div>
            <small className="text-muted">Conversion Rate</small>
          </Col>
        </Row>
      </div>
    </div>
  );
};
