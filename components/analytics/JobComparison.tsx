import React, { useState, useEffect, useMemo } from 'react';
import { Card, Form, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { ArrowUp, ArrowDown, Dash } from 'react-bootstrap-icons';
import { JobEntity } from '../../models/job/job.entity';
import { useJobAnalyticsData } from '../../hooks/use-job-analytics-data';
import { JobConversionMetrics } from '../../pages/api/job-analytics';

interface JobComparisonProps {
  currentJob: JobEntity;
  availableJobs: JobEntity[];
  period: '7d' | '30d' | '90d';
}

interface ComparisonData {
  job: JobEntity;
  metrics: JobConversionMetrics | null;
  loading: boolean;
  error: string | null;
}

export const JobComparison: React.FC<JobComparisonProps> = ({
  currentJob,
  availableJobs,
  period,
}) => {
  const [selectedJobIds, setSelectedJobIds] = useState<number[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);

  // Memoize params to prevent infinite re-renders
  const currentJobParams = useMemo(() => ({ period }), [period]);

  // Get current job analytics
  const { metrics: currentMetrics } = useJobAnalyticsData(currentJob.id, currentJobParams);

  useEffect(() => {
    if (selectedJobIds.length === 0) {
      setComparisonData([]);
      return;
    }

    const loadComparisonData = async () => {
      const data: ComparisonData[] = selectedJobIds.map((jobId) => ({
        job: availableJobs.find((j) => j.id === jobId)!,
        metrics: null,
        loading: true,
        error: null,
      }));

      setComparisonData(data);

      // Load metrics for each selected job
      for (let i = 0; i < data.length; i++) {
        try {
          // Note: In a real implementation, you'd want to use the hook or API directly
          // For now, we'll simulate this
          const jobData = data[i];

          // This is a placeholder - you'd actually call the analytics API
          setTimeout(() => {
            setComparisonData((prev) =>
              prev.map((item, index) =>
                index === i
                  ? {
                      ...item,
                      loading: false,
                      metrics: {
                        views: Math.floor(Math.random() * 500) + 50,
                        clickToApply: Math.floor(Math.random() * 100) + 10,
                        totalApplications: Math.floor(Math.random() * 50) + 5,
                        viewToClickRate: Math.random() * 20 + 5,
                        clickToApplicationRate: Math.random() * 30 + 10,
                        overallConversionRate: Math.random() * 15 + 2,
                      } as JobConversionMetrics,
                    }
                  : item
              )
            );
          }, i * 500); // Stagger the loading
        } catch (error) {
          setComparisonData((prev) =>
            prev.map((item, index) =>
              index === i
                ? {
                    ...item,
                    loading: false,
                    error: 'Failed to load metrics',
                  }
                : item
            )
          );
        }
      }
    };

    loadComparisonData();
  }, [selectedJobIds, availableJobs, period]);

  const handleJobSelection = (jobId: number, selected: boolean) => {
    if (selected) {
      setSelectedJobIds((prev) => [...prev, jobId]);
    } else {
      setSelectedJobIds((prev) => prev.filter((id) => id !== jobId));
    }
  };

  const getComparisonIcon = (currentValue: number, compareValue: number) => {
    if (currentValue > compareValue) {
      return <ArrowUp className="text-success" size={14} />;
    } else if (currentValue < compareValue) {
      return <ArrowDown className="text-danger" size={14} />;
    } else {
      return <Dash className="text-muted" size={14} />;
    }
  };

  const getPerformanceBadge = (currentValue: number, compareValue: number) => {
    const diff = ((currentValue - compareValue) / compareValue) * 100;
    if (Math.abs(diff) < 5) {
      return <Badge bg="secondary">Similar</Badge>;
    } else if (diff > 0) {
      return <Badge bg="success">+{diff.toFixed(1)}%</Badge>;
    } else {
      return <Badge bg="danger">{diff.toFixed(1)}%</Badge>;
    }
  };

  const availableJobsForComparison = availableJobs.filter((job) => job.id !== currentJob.id);

  if (!currentMetrics) {
    return (
      <Card>
        <Card.Header>
          <Card.Title className="mb-0">Job Performance Comparison</Card.Title>
        </Card.Header>
        <Card.Body>
          <Spinner animation="border" size="sm" className="me-2" />
          Loading current job metrics...
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title className="mb-0">Job Performance Comparison</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label>
            Select jobs to compare with <strong>{currentJob.title}</strong>:
          </Form.Label>
          <div className="border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {availableJobsForComparison.map((job) => (
              <Form.Check
                key={job.id}
                type="checkbox"
                id={`compare-job-${job.id}`}
                label={`${job.title} (${job.location})`}
                checked={selectedJobIds.includes(job.id)}
                onChange={(e) => handleJobSelection(job.id, e.target.checked)}
                className="mb-1"
              />
            ))}
          </div>
          {availableJobsForComparison.length === 0 && (
            <small className="text-muted">No other jobs available for comparison</small>
          )}
        </Form.Group>

        {comparisonData.length > 0 && (
          <div className="table-responsive">
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Views</th>
                  <th>Clicks</th>
                  <th>Applications</th>
                  <th>View-to-Click Rate</th>
                  <th>Click-to-App Rate</th>
                  <th>Overall Conversion</th>
                </tr>
              </thead>
              <tbody>
                {/* Current job row */}
                <tr className="table-primary">
                  <td>
                    <strong>{currentJob.title}</strong>
                    <br />
                    <small className="text-muted">Current Job</small>
                  </td>
                  <td>
                    <strong>{currentMetrics.views}</strong>
                  </td>
                  <td>
                    <strong>{currentMetrics.clickToApply}</strong>
                  </td>
                  <td>
                    <strong>{currentMetrics.totalApplications}</strong>
                  </td>
                  <td>
                    <strong>{currentMetrics.viewToClickRate.toFixed(1)}%</strong>
                  </td>
                  <td>
                    <strong>{currentMetrics.clickToApplicationRate.toFixed(1)}%</strong>
                  </td>
                  <td>
                    <strong>{currentMetrics.overallConversionRate.toFixed(1)}%</strong>
                  </td>
                </tr>

                {/* Comparison job rows */}
                {comparisonData.map((data, index) => (
                  <tr key={data.job.id}>
                    <td>
                      {data.job.title}
                      <br />
                      <small className="text-muted">{data.job.location}</small>
                    </td>
                    {data.loading ? (
                      <>
                        <td colSpan={6} className="text-center">
                          <Spinner animation="border" size="sm" />
                          <span className="ms-2">Loading...</span>
                        </td>
                      </>
                    ) : data.error ? (
                      <>
                        <td colSpan={6} className="text-center text-danger">
                          {data.error}
                        </td>
                      </>
                    ) : data.metrics ? (
                      <>
                        <td>
                          {getComparisonIcon(currentMetrics.views, data.metrics.views)}
                          <span className="ms-1">{data.metrics.views}</span>
                          <br />
                          <small>
                            {getPerformanceBadge(currentMetrics.views, data.metrics.views)}
                          </small>
                        </td>
                        <td>
                          {getComparisonIcon(
                            currentMetrics.clickToApply,
                            data.metrics.clickToApply
                          )}
                          <span className="ms-1">{data.metrics.clickToApply}</span>
                          <br />
                          <small>
                            {getPerformanceBadge(
                              currentMetrics.clickToApply,
                              data.metrics.clickToApply
                            )}
                          </small>
                        </td>
                        <td>
                          {getComparisonIcon(
                            currentMetrics.totalApplications,
                            data.metrics.totalApplications
                          )}
                          <span className="ms-1">{data.metrics.totalApplications}</span>
                          <br />
                          <small>
                            {getPerformanceBadge(
                              currentMetrics.totalApplications,
                              data.metrics.totalApplications
                            )}
                          </small>
                        </td>
                        <td>
                          {getComparisonIcon(
                            currentMetrics.viewToClickRate,
                            data.metrics.viewToClickRate
                          )}
                          <span className="ms-1">{data.metrics.viewToClickRate.toFixed(1)}%</span>
                          <br />
                          <small>
                            {getPerformanceBadge(
                              currentMetrics.viewToClickRate,
                              data.metrics.viewToClickRate
                            )}
                          </small>
                        </td>
                        <td>
                          {getComparisonIcon(
                            currentMetrics.clickToApplicationRate,
                            data.metrics.clickToApplicationRate
                          )}
                          <span className="ms-1">
                            {data.metrics.clickToApplicationRate.toFixed(1)}%
                          </span>
                          <br />
                          <small>
                            {getPerformanceBadge(
                              currentMetrics.clickToApplicationRate,
                              data.metrics.clickToApplicationRate
                            )}
                          </small>
                        </td>
                        <td>
                          {getComparisonIcon(
                            currentMetrics.overallConversionRate,
                            data.metrics.overallConversionRate
                          )}
                          <span className="ms-1">
                            {data.metrics.overallConversionRate.toFixed(1)}%
                          </span>
                          <br />
                          <small>
                            {getPerformanceBadge(
                              currentMetrics.overallConversionRate,
                              data.metrics.overallConversionRate
                            )}
                          </small>
                        </td>
                      </>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {selectedJobIds.length === 0 && (
          <Alert variant="info" className="mb-0">
            <strong>💡 Tip:</strong> Select one or more jobs above to compare their performance
            metrics with the current job.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};
