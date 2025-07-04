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
import { useTranslation } from '../../hooks/use-translation';
import styles from '../../styles/job-dashboard.module.css';

interface JobDetailsOverviewProps {
  job: JobEntity;
  className?: string;
}

export const JobDetailsOverview: React.FC<JobDetailsOverviewProps> = ({ job, className = '' }) => {
  const { t } = useTranslation();

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return t('NOT_SPECIFIED');
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `${t('UP_TO')} $${max.toLocaleString()}`;
    return t('NOT_SPECIFIED');
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return t('NOT_SPECIFIED');
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
        return { label: t('ACTIVE'), class: styles.statusActive };
      case 'inactive':
        return { label: t('INACTIVE'), class: styles.statusInactive };
      default:
        return {
          label: status ? t(status.toUpperCase()) : t('UNKNOWN'),
          class: styles.statusInactive,
        };
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
            {t('JOB_INFORMATION')}
          </h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('STATUS')}</div>
              <div className={`${styles.detailValue}`}>
                <span className={`${styles.statusBadge} ${statusDisplay.class}`}>
                  {statusDisplay.label}
                </span>
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('EMPLOYMENT_TYPE')}</div>
              <div className={styles.detailValue}>
                {job.employment_type ? t(job.employment_type.toUpperCase()) : t('NOT_SPECIFIED')}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('GEOGRAPHY')}</div>
              <div className={styles.detailValue}>
                {job.geography ? t(job.geography.toUpperCase()) : t('NOT_SPECIFIED')}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('CDL_REQUIRED')}</div>
              <div className={styles.detailValue}>
                {job.cdl_class ? t(`CDL_CLASS_${job.cdl_class}`) : t('NONE')}
              </div>
            </div>
          </div>
        </div>

        {/* Location & Schedule */}
        <div className={styles.detailSection}>
          <h3 className={styles.detailSectionTitle}>
            <GeoAltFill />
            {t('LOCATION_AND_SCHEDULE')}
          </h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('LOCATION')}</div>
              <div className={styles.detailValue}>
                {job.location ? `${job.location.city}, ${job.location.state}` : t('NOT_SPECIFIED')}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('SCHEDULE')}</div>
              <div className={styles.detailValue}>
                {job.schedule ? t(job.schedule.toUpperCase()) : t('NOT_SPECIFIED')}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('HOME_TIME')}</div>
              <div className={styles.detailValue}>
                {(job as any).home_time || t('NOT_SPECIFIED')}
              </div>
            </div>
          </div>
        </div>

        {/* Compensation */}
        <div className={styles.detailSection}>
          <h3 className={styles.detailSectionTitle}>
            <CurrencyDollar />
            {t('COMPENSATION')}
          </h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('WEEKLY_PAY')}</div>
              <div className={styles.detailValue}>
                {formatSalary(job.min_weekly_pay, job.max_weekly_pay)}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('PER_MILE')}</div>
              <div className={styles.detailValue}>
                {(job as any).per_mile_pay
                  ? `$${(job as any).per_mile_pay.toFixed(2)}/${t('MILE').toLowerCase()}`
                  : t('NOT_SPECIFIED')}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('SIGN_ON_BONUS')}</div>
              <div className={styles.detailValue}>
                {(job as any).sign_on_bonus
                  ? `$${(job as any).sign_on_bonus.toLocaleString()}`
                  : t('NONE')}
              </div>
            </div>
          </div>
        </div>

        {/* Experience Requirements */}
        <div className={styles.detailSection}>
          <h3 className={styles.detailSectionTitle}>
            <StarFill />
            {t('REQUIREMENTS')}
          </h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('MIN_EXPERIENCE')}</div>
              <div className={styles.detailValue}>
                {job.min_years_experience
                  ? `${job.min_years_experience} ${t('YEARS')}`
                  : t('NO_MINIMUM')}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('CLEAN_MVR')}</div>
              <div className={styles.detailValue}>
                {job.must_have_clean_mvr ? t('REQUIRED') : t('NOT_REQUIRED')}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('DRUG_TEST')}</div>
              <div className={styles.detailValue}>
                {job.must_pass_drug_test ? t('REQUIRED') : t('NOT_REQUIRED')}
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        {job.description && (
          <div className={styles.detailSection}>
            <h3 className={styles.detailSectionTitle}>
              <FileTextFill />
              {t('DESCRIPTION')}
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
            {t('TIMELINE')}
          </h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('POSTED')}</div>
              <div className={styles.detailValue}>{formatDate(job.created_at)}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('EXPIRES')}</div>
              <div className={styles.detailValue}>{formatDate(job.expiry_date)}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>{t('LAST_UPDATED')}</div>
              <div className={styles.detailValue}>{formatDate((job as any).updated_at)}</div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div className={styles.detailSection}>
            <h3 className={styles.detailSectionTitle}>
              <CheckSquareFill />
              {t('BENEFITS')}
            </h3>
            <div className="d-flex flex-wrap gap-2">
              {job.benefits.map((benefit, index) => (
                <span key={index} className="badge bg-primary" style={{ fontSize: '0.875rem' }}>
                  {t(benefit.toUpperCase().replace(/[^A-Z0-9]/g, '_'))}
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
              {t('EQUIPMENT')}
            </h3>
            <div className={styles.detailValue}>
              {Array.isArray(job.equipment_type)
                ? job.equipment_type
                    .map((equipment) =>
                      t(
                        String(equipment)
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, '_')
                      )
                    )
                    .join(', ')
                : t(
                    String(job.equipment_type)
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, '_')
                  )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
