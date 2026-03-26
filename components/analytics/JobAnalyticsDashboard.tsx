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
  PinMapFill,
  BarChartFill,
  PersonBadgeFill,
  Link45deg,
} from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { JobEntity } from '../../models/job/job.entity';
import { useJobAnalyticsData } from '../../hooks/use-job-analytics-data';
import { GetJobConversionAnalyticsParams } from '../../pages/api/job-analytics';
import { AnalyticsExporter } from '../../utils/analytics-exporter';

import { ConversionMetricsCards } from './ConversionMetricsCards';
import { ConversionTimelineChart } from './ConversionTimelineChart';
import { ConversionFunnelChart } from './ConversionFunnelChart';
import { JobComparison } from './JobComparison';
import { EnhancedLeadSourceChart } from './EnhancedLeadSourceChart';
import { ApplicationsByEntryModeChart } from './ApplicationsByEntryModeChart';
import { ApplicantsByStateHeatmap } from './ApplicantsByStateHeatmap';
import { ApplicantStatsPanel } from './ApplicantStatsPanel';
import { TrackingLinksSection } from './TrackingLinksSection';

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

  const params: GetJobConversionAnalyticsParams = useMemo(
    () => ({ period: selectedPeriod }),
    [selectedPeriod]
  );

  const {
    metrics,
    timeline,
    leadSourceBreakdown,
    utmBreakdown,
    entryModeBreakdown,
    applicantsByState,
    applicantStats,
    loading,
    error,
    lastUpdated,
    refetch,
  } = useJobAnalyticsData(job.id, params);

  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    if (!metrics || !timeline) {
      toast.error('No data available to export');
      return;
    }
    try {
      const options = { format, includeTimeline: true, dateRange: selectedPeriod };
      if (format === 'csv') {
        AnalyticsExporter.exportToCSV(metrics, timeline, options);
        toast.success('Analytics data exported to CSV');
      } else {
        AnalyticsExporter.exportToJSON(metrics, timeline, options);
        toast.success('Analytics data exported to JSON');
      }
    } catch {
      toast.error('Failed to export analytics data');
    }
  };

  const handleCopyInsights = async () => {
    if (!metrics) { toast.error('No metrics available to copy'); return; }
    try {
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
    } catch {
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
            <Button variant="outline-danger" onClick={() => refetch()}>Try Again</Button>
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
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" size="sm">
              <Download className="me-1" size={14} />
              Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleExport('csv')}>
                <CloudDownload className="me-2" size={14} />Export as CSV
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleExport('json')}>
                <CloudDownload className="me-2" size={14} />Export as JSON
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleCopyInsights}>
                <Share className="me-2" size={14} />Copy Insights to Clipboard
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <ButtonGroup size="sm">
            {(['7d', '30d', '90d'] as TimePeriod[]).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'primary' : 'outline-primary'}
                onClick={() => setSelectedPeriod(period)}
              >
                {getPeriodLabel(period)}
              </Button>
            ))}
          </ButtonGroup>
        </Col>
      </Row>

      {/* Applicant Quality Stats — top-level overview */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">
                <PersonBadgeFill className="me-2" />
                Applicant Quality Overview
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <ApplicantStatsPanel stats={applicantStats} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Conversion Metrics Cards — above charts */}
      <ConversionMetricsCards metrics={metrics} period={selectedPeriod} />

      {/* Timeline + Funnel */}
      <Row className="mb-4">
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

      {/* Applications by Entry Mode + Applicants by State — side by side */}
      <Row className="mb-4">
        <Col lg={5} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <Card.Title className="mb-0">
                <BarChartFill className="me-2" />
                Applications by Entry Mode
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <ApplicationsByEntryModeChart data={entryModeBreakdown} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={7} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <Card.Title className="mb-0">
                <PinMapFill className="me-2" />
                Applicants by State
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <ApplicantsByStateHeatmap data={applicantsByState} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tracking Links */}
      <Row className="mb-4">
        <Col>
          <TrackingLinksSection job={job} />
        </Col>
      </Row>

      {/* Lead Source Breakdown — full width, filterable by source/medium/campaign */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">
                <GraphUpArrow className="me-2" />
                Lead Source Breakdown
              </Card.Title>
              <small className="text-muted">
                Filter by source, medium, or campaign to correlate with your tracking links
              </small>
            </Card.Header>
            <Card.Body>
              <EnhancedLeadSourceChart data={utmBreakdown} />
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
    </div>
  );
};
