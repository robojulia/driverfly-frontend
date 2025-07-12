import React from 'react';
import { JobEntity } from '../../../../models/job/job.entity';
import { useTranslation } from '../../../../hooks/use-translation';
import styles from '../../../../styles/digitalhiringapp.module.css';

interface SplashPageJobViewProps {
  job: JobEntity;
}

export function SplashPageJobView({ job }: SplashPageJobViewProps) {
  const { t } = useTranslation();

  const formatEmploymentType = (type: string): string => {
    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatPayFrequency = (frequency: string): string => {
    return frequency.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <>
      <h4 className={styles.Application}>
        {t('JOB_APPLICATION_FOR')}: {job.title}
      </h4>

      <div className={`${styles.jobDetailsCard} mb-4`}>
        <table className={styles.jobDetailsTable}>
          <tbody>
            {job.location && (job.location.city || job.location.state) && (
              <tr>
                <td className={styles.jobDetailLabel}>{t('LOCATION')}:</td>
                <td className={styles.jobDetailValue}>
                  {job.location.city && job.location.state
                    ? `${job.location.city}, ${job.location.state}`
                    : job.location.city || job.location.state}
                </td>
              </tr>
            )}

            {job.employment_type && (
              <tr>
                <td className={styles.jobDetailLabel}>{t('EMPLOYMENT_TYPE')}:</td>
                <td className={styles.jobDetailValue}>
                  {formatEmploymentType(job.employment_type)}
                </td>
              </tr>
            )}

            {(job.min_salary || job.max_salary) && (
              <tr>
                <td className={styles.jobDetailLabel}>{t('SALARY_RANGE')}:</td>
                <td className={styles.jobDetailValue}>
                  {job.min_salary && `$${job.min_salary.toLocaleString()}`}
                  {job.min_salary && job.max_salary && ' - '}
                  {job.max_salary && `$${job.max_salary.toLocaleString()}`}
                  {job.pay_frequency && ` (${formatPayFrequency(job.pay_frequency)})`}
                </td>
              </tr>
            )}

            {job.schedule && (
              <tr>
                <td className={styles.jobDetailLabel}>{t('SCHEDULE')}:</td>
                <td className={styles.jobDetailValue}>{formatEmploymentType(job.schedule)}</td>
              </tr>
            )}

            {job.geography && (
              <tr>
                <td className={styles.jobDetailLabel}>{t('ROUTE_TYPE')}:</td>
                <td className={styles.jobDetailValue}>{formatEmploymentType(job.geography)}</td>
              </tr>
            )}

            {job.description_short && (
              <tr>
                <td className={styles.jobDetailLabel}>{t('DESCRIPTION')}:</td>
                <td className={styles.jobDetailValue}>{job.description_short}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h6 className={styles.paragraph}>
        {t('COMPLETE_FORM_FOR_POSITION', { jobTitle: job.title })}
      </h6>
    </>
  );
}
