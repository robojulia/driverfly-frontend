import React from 'react';
import { Alert, Badge } from 'react-bootstrap';
import { InfoCircle, ExclamationTriangle, CheckCircle, LightbulbFill } from 'react-bootstrap-icons';
import { JobAnalyticsInsights } from '../../pages/api/job-analytics';

interface InsightsPanelProps {
  insights: JobAnalyticsInsights | null;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights }) => {
  if (!insights) {
    return (
      <div className="text-center py-4">
        <div className="text-muted">
          <LightbulbFill size={32} className="mb-2" />
          <div className="h6">Insights Loading...</div>
          <p className="small mb-0">Analytics insights will appear here</p>
        </div>
      </div>
    );
  }

  const { summary, insights: analysisInsights } = insights;

  const getBottleneckInfo = (bottleneck: string) => {
    switch (bottleneck) {
      case 'views':
        return {
          icon: InfoCircle,
          variant: 'info',
          title: 'Low Visibility',
          description: 'Your job isn&apos;t getting enough views',
        };
      case 'clicks':
        return {
          icon: ExclamationTriangle,
          variant: 'warning',
          title: 'Low Engagement',
          description: 'People see your job but aren&apos;t clicking to apply',
        };
      case 'applications':
        return {
          icon: ExclamationTriangle,
          variant: 'warning',
          title: 'Application Drop-off',
          description: 'People click but don&apos;t complete applications',
        };
      default:
        return {
          icon: CheckCircle,
          variant: 'success',
          title: 'Good Performance',
          description: 'Your conversion funnel looks healthy',
        };
    }
  };

  const getBenchmarkInfo = (comparison: string) => {
    switch (comparison) {
      case 'above_average':
        return { variant: 'success', label: 'Above Average', icon: '📈' };
      case 'below_average':
        return { variant: 'danger', label: 'Below Average', icon: '📉' };
      default:
        return { variant: 'secondary', label: 'Average', icon: '📊' };
    }
  };

  const bottleneckInfo = getBottleneckInfo(analysisInsights.topBottleneck || '');
  const benchmarkInfo = getBenchmarkInfo(analysisInsights.benchmarkComparison || 'average');
  const BottleneckIcon = bottleneckInfo.icon;

  return (
    <div>
      {/* Performance Benchmark */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-medium">Performance Benchmark</span>
          <Badge bg={benchmarkInfo.variant as any}>
            {benchmarkInfo.icon} {benchmarkInfo.label}
          </Badge>
        </div>
        <div className="small text-muted">Compared to similar jobs in your industry</div>
      </div>

      <hr />

      {/* Top Bottleneck */}
      <div className="mb-3">
        <Alert variant={bottleneckInfo.variant as any} className="py-2 mb-2">
          <div className="d-flex align-items-start">
            <BottleneckIcon className="me-2 mt-1" size={16} />
            <div>
              <div className="fw-medium small">{bottleneckInfo.title}</div>
              <div className="small mb-0">{bottleneckInfo.description}</div>
            </div>
          </div>
        </Alert>
      </div>

      {/* Recommendation */}
      {analysisInsights.improvementOpportunity && (
        <div className="mb-3">
          <div className="fw-medium mb-2">
            <LightbulbFill className="me-2 text-warning" size={16} />
            Recommendation
          </div>
          <div className="small text-muted p-2 bg-light rounded">
            {analysisInsights.improvementOpportunity}
          </div>
        </div>
      )}

      {/* Key Metrics Summary */}
      <div className="mt-3">
        <div className="fw-medium mb-2">Quick Stats</div>
        <div className="row text-center">
          <div className="col-4">
            <div className="small text-muted">Views</div>
            <div className="fw-bold">{summary.views.toLocaleString()}</div>
          </div>
          <div className="col-4">
            <div className="small text-muted">Clicks</div>
            <div className="fw-bold">{summary.totalClicks.toLocaleString()}</div>
          </div>
          <div className="col-4">
            <div className="small text-muted">Apps</div>
            <div className="fw-bold">{summary.totalApplications.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
