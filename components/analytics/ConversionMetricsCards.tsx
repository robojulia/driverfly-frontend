import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Eye, CursorFill, FileText, Bullseye } from 'react-bootstrap-icons';
import { JobConversionMetrics } from '../../pages/api/job-analytics';

interface ConversionMetricsCardsProps {
  metrics: JobConversionMetrics;
  period: '7d' | '30d' | '90d';
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  format?: 'number' | 'percentage';
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  format = 'number',
  subtitle,
}) => {
  const formatValue = (val: number, fmt: 'number' | 'percentage') => {
    if (fmt === 'percentage') {
      return `${val.toFixed(1)}%`;
    }
    return val.toLocaleString();
  };

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="flex-grow-1">
            <div className="text-muted small mb-1">{title}</div>
            <div className="h3 mb-1 fw-bold text-primary">{formatValue(value, format)}</div>
            {subtitle && <div className="text-muted small">{subtitle}</div>}
          </div>
          <div className="text-primary opacity-75 ms-3">
            <Icon size={32} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export const ConversionMetricsCards: React.FC<ConversionMetricsCardsProps> = ({
  metrics,
  period,
}) => {
  const periodLabel = period === '7d' ? 'week' : period === '30d' ? 'month' : '90 days';

  // Calculate percentage of apply clicks that led to completed applications
  const clickToApplicationRate =
    metrics.clickToApply > 0 ? (metrics.totalApplications / metrics.clickToApply) * 100 : 0;

  return (
    <Row className="mb-4">
      <Col sm={6} lg={3} className="mb-3">
        <MetricCard
          title="Total Views"
          value={metrics.views}
          icon={Eye}
          subtitle={`In the last ${periodLabel}`}
        />
      </Col>

      <Col sm={6} lg={3} className="mb-3">
        <MetricCard
          title="Apply Clicks"
          value={metrics.clickToApply}
          icon={CursorFill}
          subtitle={`Button clicks to apply`}
        />
      </Col>

      <Col sm={6} lg={3} className="mb-3">
        <MetricCard
          title="Applications"
          value={metrics.totalApplications}
          icon={FileText}
          subtitle={`${clickToApplicationRate.toFixed(1)}% of apply clicks`}
        />
      </Col>

      <Col sm={6} lg={3} className="mb-3">
        <MetricCard
          title="Conversion Rate"
          value={metrics.overallConversionRate}
          icon={Bullseye}
          format="percentage"
          subtitle="Views to applications"
        />
      </Col>
    </Row>
  );
};
