import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Button, ButtonGroup, Spinner, Alert, Dropdown } from 'react-bootstrap';
import {
  Eye,
  CursorFill,
  FileText,
  GraphUpArrow,
  Calendar,
  Download,
  Share,
  CloudDownload,
} from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { JobEntity } from '../../models/job/job.entity';
import { useJobAnalyticsData } from '../../hooks/use-job-analytics-data';
import { GetJobConversionAnalyticsParams } from '../../pages/api/job-analytics';
import { AnalyticsExporter } from '../../utils/analytics-exporter';

// Import components locally to avoid module resolution issues
import { ConversionMetricsCards } from './ConversionMetricsCards';
import { ConversionTimelineChart } from './ConversionTimelineChart';
import { ConversionFunnelChart } from './ConversionFunnelChart';
import { InsightsPanel } from './InsightsPanel';
import { AnalyticsAlerts } from './AnalyticsAlerts';
import { JobComparison } from './JobComparison';
import { LeadSourceBreakdownChart } from './LeadSourceBreakdownChart';
import { UtmBreakdownChart } from './UtmBreakdownChart';

interface JobAnalyticsDashboardProps {
  job: JobEntity;
  availableJobs?: JobEntity[];
}

type TimePeriod = '7d' | '30d' | '90d';

export const JobAnalyticsDashboard: React.FC<JobAnalyticsDashboardProps> = ({
  job,
  availableJobs = [],
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');

  // Memoize params to prevent infinite re-renders
  const params: GetJobConversionAnalyticsParams = useMemo(
    () => ({
      period: selectedPeriod,
    }),
    [selectedPeriod]
  );

  const {
    metrics,
    timeline,
    leadSourceBreakdown,
    utmBreakdown,
    loading,
    error,
    lastUpdated,
    refetch,
  } = useJobAnalyticsData(job.id, params);

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
  };

  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case '7d':
        return 'Last 7 Days';
      case '30d':
        return 'Last 30 Days';
      case '90d':
        return 'Last 90 Days';
      default:
        return period;
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    if (!metrics || !timeline) {
      toast.error('No data available to export');
      return;
    }

    try {
      const filename = `job-analytics-${job.id}-${selectedPeriod}`;
      const options = {
        format,
        includeTimeline: true,
        dateRange: selectedPeriod,
      };

      if (format === 'csv') {
        AnalyticsExporter.exportToCSV(metrics, timeline, options);
        toast.success('Analytics data exported to CSV');
      } else {
        AnalyticsExporter.exportToJSON(metrics, timeline, options);
        toast.success('Analytics data exported to JSON');
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export analytics data');
    }
  };

  const handleCopyInsights = async () => {
    if (!metrics) {
      toast.error('No metrics available to copy');
      return;
    }

    try {
      // Generate insights summary for clipboard
      const summary =
        `Job Analytics Summary - ${job.title}\n` +
        `Period: ${getPeriodLabel(selectedPeriod)}\n` +
        `Views: ${metrics.views}\n` +
        `Clicks: ${metrics.clickToApply}\n` +
        `Applications: ${metrics.totalApplications}\n` +
        `View-to-Click Rate: ${metrics.viewToClickRate.toFixed(1)}%\n` +
        `Click-to-Application Rate: ${metrics.clickToApplicationRate.toFixed(1)}%\n` +
        `Overall Conversion Rate: ${metrics.overallConversionRate.toFixed(1)}%`;

      await navigator.clipboard.writeText(summary);
      toast.success('Insights copied to clipboard');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy insights');
    }
  };

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <Spinner animation="border" className="mb-3" />
          <div>Loading job analytics...</div>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="danger">
            <Alert.Heading>Error Loading Analytics</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={() => refetch()}>
              Try Again
            </Button>
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="info">
            <Alert.Heading>No Analytics Data</Alert.Heading>
            <p>No analytics data is available for this job in the selected time period.</p>
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="job-analytics-dashboard">
      {/* Controls */}
      <Row className="mb-4 mt-4">
        <Col className="d-flex justify-content-end align-items-center gap-2">
          {/* Export Dropdown */}
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" size="sm">
              <Download className="me-1" size={14} />
              Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleExport('csv')}>
                <CloudDownload className="me-2" size={14} />
                Export as CSV
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleExport('json')}>
                <CloudDownload className="me-2" size={14} />
                Export as JSON
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleCopyInsights}>
                <Share className="me-2" size={14} />
                Copy Insights to Clipboard
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Time Period Selector */}
          <ButtonGroup size="sm">
            {(['7d', '30d', '90d'] as TimePeriod[]).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'primary' : 'outline-primary'}
                onClick={() => handlePeriodChange(period)}
              >
                {getPeriodLabel(period)}
              </Button>
            ))}
          </ButtonGroup>
        </Col>
      </Row>

      {/* Performance Alerts - Hidden for now */}
      {/* <AnalyticsAlerts metrics={metrics} period={selectedPeriod} /> */}

      {/* Key Metrics Cards */}
      <ConversionMetricsCards metrics={metrics} period={selectedPeriod} />

      <Row className="mb-4">
        {/* Timeline Chart */}
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <Card.Title className="mb-0">
                <Calendar className="me-2" />
                Performance Timeline
              </Card.Title>
            </Card.Header>
            <Card.Body>
              {timeline ? (
                <ConversionTimelineChart
                  timeline={timeline}
                  period={selectedPeriod}
                  groupBy={selectedPeriod === '7d' ? 'day' : 'week'}
                />
              ) : (
                <div className="text-center text-muted py-4">No timeline data available</div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Conversion Funnel */}
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <Card.Title className="mb-0">
                <GraphUpArrow className="me-2" />
                Conversion Funnel
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <ConversionFunnelChart metrics={metrics} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Lead Source and UTM Breakdown */}
      <Row className="mb-4">
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <Card.Title className="mb-0">
                <GraphUpArrow className="me-2" />
                Lead Source Breakdown
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <LeadSourceBreakdownChart data={leadSourceBreakdown} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <Card.Title className="mb-0">
                <GraphUpArrow className="me-2" />
                UTM Parameter Breakdown
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <UtmBreakdownChart data={utmBreakdown} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Job Comparison */}
      {availableJobs.length > 0 && (
        <Row className="mb-4">
          <Col>
            <JobComparison currentJob={job} availableJobs={availableJobs} period={selectedPeriod} />
          </Col>
        </Row>
      )}

      {/* Insights Panel - Removed placeholder */}
      {/* <Row>
        <Col>
          <InsightsPanel insights={null} />
        </Col>
      </Row> */}
    </div>
  );
};
