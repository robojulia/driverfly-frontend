import React from 'react';
import { Card, CardBody, Alert } from 'reactstrap';
import { AutoRecruitingStats } from '../../hooks/useAutoRecruitingStats';

interface AnalyticsDashboardProps {
  stats: AutoRecruitingStats;
  isLoading?: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading analytics...</p>
      </div>
    );
  }

  const hasData = stats.totalUniqueApplicants > 0;

  return (
    <div>
      {/* Overview Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <Card className="text-center border-0 bg-primary text-white">
            <CardBody>
              <h3 className="mb-1">{stats.totalUniqueApplicants}</h3>
              <small>Total Applicants</small>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-4 mb-3">
          <Card className="text-center border-0 bg-success text-white">
            <CardBody>
              <h3 className="mb-1">{stats.thisWeekApplicants}</h3>
              <small>This Week</small>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-4 mb-3">
          <Card className="text-center border-0 bg-info text-white">
            <CardBody>
              <h3 className="mb-1">{stats.thisMonthApplicants}</h3>
              <small>This Month</small>
            </CardBody>
          </Card>
        </div>
      </div>

      {!hasData && (
        <Alert color="info" className="text-center">
          <h5>No Auto-Recruiting Activity Yet</h5>
          <p className="mb-0">
            Once the auto-recruiting system starts finding qualified candidates, you&apos;ll see
            detailed analytics here.
          </p>
        </Alert>
      )}

      {hasData && (
        <>
          {/* Job Breakdown */}
          {stats.jobBreakdown && stats.jobBreakdown.length > 0 && (
            <div className="row mb-4">
              <div className="col-12">
                <Card>
                  <CardBody>
                    <h5 className="card-title">Job Performance Breakdown</h5>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Job Title</th>
                            <th>Applicants</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.jobBreakdown.map((job) => (
                            <tr key={job.jobId}>
                              <td>{job.jobTitle}</td>
                              <td>
                                <span className="badge bg-primary">{job.applicantCount}</span>
                              </td>
                              <td>
                                <a
                                  href={`/dashboard/company/jobs/${job.jobId}`}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  View Job
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}

          {/* Weekly Trend */}
          {stats.weeklyTrend && stats.weeklyTrend.length > 0 && (
            <div className="row mb-4">
              <div className="col-md-4">
                <Card>
                  <CardBody>
                    <h5 className="card-title">Weekly Trend</h5>
                    <div className="list-group list-group-flush">
                      {stats.weeklyTrend.slice(0, 6).map((week, index) => (
                        <div
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center px-0"
                        >
                          <span className="small">
                            Week of {new Date(week.weekStart).toLocaleDateString()}
                          </span>
                          <span className="badge bg-primary">{week.applicantsCount}</span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
