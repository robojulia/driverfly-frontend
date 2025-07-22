import React from 'react';
import { Alert, Badge } from 'react-bootstrap';
import {
  ExclamationTriangleFill,
  CheckCircleFill,
  InfoCircleFill,
  LightningFill,
} from 'react-bootstrap-icons';
import { JobConversionMetrics } from '../../pages/api/job-analytics';

interface AnalyticsAlertsProps {
  metrics: JobConversionMetrics;
  period: '7d' | '30d' | '90d';
}

interface AlertItem {
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export const AnalyticsAlerts: React.FC<AnalyticsAlertsProps> = ({ metrics, period }) => {
  const generateAlerts = (): AlertItem[] => {
    const alerts: AlertItem[] = [];

    // Check for low views
    if (metrics.views < 50 && period === '30d') {
      alerts.push({
        type: 'warning',
        title: 'Low Job Visibility',
        message:
          'Your job has received fewer than 50 views this month. Consider improving SEO or promoting on job boards.',
        priority: 'high',
        actionable: true,
      });
    }

    // Check for high views but low clicks
    if (metrics.views > 100 && metrics.viewToClickRate < 5) {
      alerts.push({
        type: 'warning',
        title: 'Low Click-Through Rate',
        message: `${metrics.views} views but only ${metrics.viewToClickRate.toFixed(
          1
        )}% click rate. Your job title or description may need optimization.`,
        priority: 'high',
        actionable: true,
      });
    }

    // Check for high clicks but low applications
    if (metrics.clickToApply > 20 && metrics.clickToApplicationRate < 15) {
      alerts.push({
        type: 'warning',
        title: 'Application Drop-off',
        message: `${
          metrics.clickToApply
        } people clicked to apply but only ${metrics.clickToApplicationRate.toFixed(
          1
        )}% completed applications. Consider simplifying the application process.`,
        priority: 'high',
        actionable: true,
      });
    }

    // Check for excellent performance
    if (metrics.overallConversionRate > 8) {
      alerts.push({
        type: 'success',
        title: 'Excellent Performance!',
        message: `Outstanding ${metrics.overallConversionRate.toFixed(
          1
        )}% conversion rate. This job is performing well above industry average.`,
        priority: 'low',
        actionable: false,
      });
    }

    // Check for zero applications
    if (metrics.views > 50 && metrics.totalApplications === 0) {
      alerts.push({
        type: 'danger',
        title: 'No Applications Received',
        message: `Despite ${metrics.views} views, no applications have been received. This requires immediate attention.`,
        priority: 'high',
        actionable: true,
      });
    }

    // Check for trending performance
    if (metrics.overallConversionRate > 5 && metrics.views > 100) {
      alerts.push({
        type: 'info',
        title: 'Trending Job',
        message:
          'This job is performing above average with strong engagement. Consider increasing promotion budget.',
        priority: 'medium',
        actionable: true,
      });
    }

    return alerts.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const alerts = generateAlerts();

  if (alerts.length === 0) {
    return (
      <Alert variant="success" className="mb-3">
        <CheckCircleFill className="me-2" />
        <strong>All Good!</strong> No performance issues detected for this job.
      </Alert>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircleFill;
      case 'warning':
        return ExclamationTriangleFill;
      case 'danger':
        return ExclamationTriangleFill;
      default:
        return InfoCircleFill;
    }
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    const variants = {
      high: 'danger',
      medium: 'warning',
      low: 'secondary',
    };

    return (
      <Badge bg={variants[priority]} className="ms-2">
        {priority === 'high' && <LightningFill className="me-1" size={12} />}
        {priority.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="mb-4">
      <h6 className="mb-3">Performance Alerts</h6>
      {alerts.map((alert, index) => {
        const IconComponent = getIcon(alert.type);
        return (
          <Alert key={index} variant={alert.type} className="mb-2">
            <div className="d-flex align-items-start">
              <IconComponent className="me-2 mt-1" size={16} />
              <div className="flex-grow-1">
                <div className="d-flex align-items-center justify-content-between">
                  <strong>{alert.title}</strong>
                  {getPriorityBadge(alert.priority)}
                </div>
                <div className="small mt-1">{alert.message}</div>
                {alert.actionable && (
                  <div className="small text-muted mt-2">
                    💡 This alert requires action to improve performance
                  </div>
                )}
              </div>
            </div>
          </Alert>
        );
      })}
    </div>
  );
};
