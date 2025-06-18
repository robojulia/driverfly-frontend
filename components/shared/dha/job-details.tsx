import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from '../../../hooks/use-translation';

// Helper function to format location object into readable string
const formatLocation = (location: any): string => {
  if (!location) return '';

  if (typeof location === 'string') return location;

  // If location is an object, format it properly
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.state) parts.push(location.state);

  return parts.join(', ');
};

interface JobDetailsProps {
  job: any;
}

export const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  const { t } = useTranslation();

  if (!job) return null;

  const styles = {
    card: {
      marginTop: '1.5rem',
      border: '1px solid var(--medium-gray)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    },
    header: {
      background: 'linear-gradient(135deg, var(--form-info-bg) 0%, var(--primary-light) 100%)',
      padding: '1.5rem',
      borderBottom: '1px solid var(--medium-gray)',
    },
    body: {
      padding: '1.5rem',
    },
    title: {
      margin: 0,
      marginBottom: '0.5rem',
      color: 'var(--text-primary)',
    },
    subtitle: {
      color: 'var(--text-secondary)',
      fontSize: '1rem',
    },
    sectionTitle: {
      color: 'var(--text-primary)',
      display: 'block' as const,
      marginBottom: '0.5rem',
    },
    detailItem: {
      marginBottom: '0.25rem',
    },
    detailLabel: {
      color: 'var(--text-secondary)',
    },
    badge: {
      backgroundColor: 'var(--primary)',
      color: 'var(--text-light)',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600' as const,
      marginRight: '0.5rem',
      marginBottom: '0.5rem',
      display: 'inline-block',
    },
    salaryRange: {
      fontWeight: '600' as const,
      color: 'var(--success)',
    },
    requirementsList: {
      margin: 0,
      paddingLeft: '1.25rem',
      color: 'var(--text-secondary)',
    },
    requirementItem: {
      marginBottom: '0.25rem',
    },
    moreRequirements: {
      color: 'var(--primary)',
      fontStyle: 'italic' as const,
    },
    description: {
      color: 'var(--text-secondary)',
      lineHeight: '1.6',
      margin: 0,
    },
    descriptionSection: {
      marginTop: '1rem',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{job.title}</h3>
        <div style={styles.subtitle}>
          {job.location && <span>{formatLocation(job.location)}</span>}
          {job.department && <span> • {job.department}</span>}
        </div>
      </div>

      <div style={styles.body}>
        <Row>
          <Col md={6}>
            <div style={{ marginBottom: '1rem' }}>
              <strong style={styles.sectionTitle}>{t('JOB_DETAILS')}</strong>
              {job.employment_type && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>{t('EMPLOYMENT_TYPE')}: </span>
                  <span style={styles.badge}>{t(job.employment_type)}</span>
                </div>
              )}
              {job.experience_level && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>{t('EXPERIENCE_LEVEL')}: </span>
                  <span>{job.experience_level}</span>
                </div>
              )}
              {job.salary_range && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>{t('SALARY_RANGE')}: </span>
                  <span style={styles.salaryRange}>{job.salary_range}</span>
                </div>
              )}
            </div>
          </Col>

          <Col md={6}>
            {job.requirements && job.requirements.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <strong style={styles.sectionTitle}>{t('REQUIREMENTS')}</strong>
                <ul style={styles.requirementsList}>
                  {job.requirements.slice(0, 3).map((req: string, index: number) => (
                    <li key={index} style={styles.requirementItem}>
                      {req}
                    </li>
                  ))}
                  {job.requirements.length > 3 && (
                    <li style={styles.moreRequirements}>
                      +{job.requirements.length - 3} {t('MORE_REQUIREMENTS')}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </Col>
        </Row>

        {job.description && (
          <div style={styles.descriptionSection}>
            <strong style={styles.sectionTitle}>{t('JOB_DESCRIPTION')}</strong>
            <p style={styles.description}>
              {job.description.length > 200
                ? `${job.description.substring(0, 200)}...`
                : job.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
