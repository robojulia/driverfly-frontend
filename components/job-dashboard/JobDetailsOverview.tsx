import React from 'react';
import {
  GeoAltFill,
  CurrencyDollar,
  TruckFrontFill,
  CalendarEventFill,
  ClockFill,
  FileTextFill,
  CheckSquareFill,
  StarFill,
} from 'react-bootstrap-icons';
import { JobEntity } from '../../models/job/job.entity';
import styles from '../../styles/job-dashboard.module.css';

interface JobDetailsOverviewProps {
  job: JobEntity;
  className?: string;
}

export const JobDetailsOverview: React.FC<JobDetailsOverviewProps> = ({ job, className = '' }) => {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return 'Not specified';
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return 'Not specified';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusDisplay = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { label: 'Active', class: styles.statusActive };
      case 'inactive':
        return { label: 'Inactive', class: styles.statusInactive };
      default:
        return { label: status || 'Unknown', class: styles.statusInactive };
    }
  };

  const statusDisplay = getStatusDisplay(job.status);

  return (
    <div className={`${styles.jobDetails} ${className}`}>
      <div>
        {/* Basic Information */}
        <div className={styles.detailSection}>
          <h3 className={styles.detailSectionTitle}>
            <FileTextFill />
            Job Information
          </h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Status</div>
              <div className={`${styles.detailValue}`}>
                <span className={`${styles.statusBadge} ${statusDisplay.class}`}>
                  {statusDisplay.label}
                </span>
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Employment Type</div>
              <div className={styles.detailValue}>{job.employment_type || 'Not specified'}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Geography</div>
              <div className={styles.detailValue}>{job.geography || 'Not specified'}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>CDL Required</div>
              <div className={styles.detailValue}>{job.cdl_class || 'None'}</div>
            </div>
          </div>
        </div>

        {/* Location & Schedule */}
        <div className={styles.detailSection}>
          <h3 className={styles.detailSectionTitle}>
            <GeoAltFill />
            Location & Schedule
          </h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Location</div>
              <div className={styles.detailValue}>
                {job.location ? `${job.location.city}, ${job.location.state}` : 'Not specified'}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Schedule</div>
              <div className={styles.detailValue}>{job.schedule || 'Not specified'}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Home Time</div>
              <div className={styles.detailValue}>{(job as any).home_time || 'Not specified'}</div>
            </div>
          </div>
        </div>

        {/* Compensation */}
        <div className={styles.detailSection}>
          <h3 className={styles.detailSectionTitle}>
            <CurrencyDollar />
            Compensation
          </h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Weekly Pay</div>
              <div className={styles.detailValue}>
                {formatSalary(job.min_weekly_pay, job.max_weekly_pay)}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Per Mile</div>
              <div className={styles.detailValue}>
                {(job as any).per_mile_pay
                  ? `$${(job as any).per_mile_pay.toFixed(2)}/mile`
                  : 'Not specified'}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Sign-on Bonus</div>
              <div className={styles.detailValue}>
                {(job as any).sign_on_bonus
                  ? `$${(job as any).sign_on_bonus.toLocaleString()}`
                  : 'None'}
              </div>
            </div>
          </div>
        </div>

        {/* Experience Requirements */}
        <div className={styles.detailSection}>
          <h3 className={styles.detailSectionTitle}>
            <StarFill />
            Requirements
          </h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Min Experience</div>
              <div className={styles.detailValue}>
                {job.min_years_experience ? `${job.min_years_experience} years` : 'No minimum'}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Clean MVR</div>
              <div className={styles.detailValue}>
                {job.must_have_clean_mvr ? 'Required' : 'Not required'}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Drug Test</div>
              <div className={styles.detailValue}>
                {job.must_pass_drug_test ? 'Required' : 'Not required'}
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        {job.description && (
          <div className={styles.detailSection}>
            <h3 className={styles.detailSectionTitle}>
              <FileTextFill />
              Description
            </h3>
            <div
              className={styles.detailValue}
              style={{ lineHeight: '1.6' }}
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        )}
      </div>

      {/* Sidebar - Dates & Metrics */}
      <div>
        <div className={styles.detailSection}>
          <h3 className={styles.detailSectionTitle}>
            <CalendarEventFill />
            Timeline
          </h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Posted</div>
              <div className={styles.detailValue}>{formatDate(job.created_at)}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Expires</div>
              <div className={styles.detailValue}>{formatDate(job.expiry_date)}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Last Updated</div>
              <div className={styles.detailValue}>{formatDate((job as any).updated_at)}</div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div className={styles.detailSection}>
            <h3 className={styles.detailSectionTitle}>
              <CheckSquareFill />
              Benefits
            </h3>
            <div className="d-flex flex-wrap gap-2">
              {job.benefits.map((benefit, index) => (
                <span key={index} className="badge bg-primary" style={{ fontSize: '0.875rem' }}>
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Equipment */}
        {job.equipment_type && (
          <div className={styles.detailSection}>
            <h3 className={styles.detailSectionTitle}>
              <TruckFrontFill />
              Equipment
            </h3>
            <div className={styles.detailValue}>{job.equipment_type}</div>
          </div>
        )}
      </div>
    </div>
  );
};
