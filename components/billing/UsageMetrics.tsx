import React from 'react';
import { Card, ProgressBar, Row, Col, Alert, Badge } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';
import { UsageMetricsEntity } from '../../models/billing/usage-metrics.entity';
import { ExclamationTriangle } from 'react-bootstrap-icons';

interface UsageMetricsProps {
  metrics: UsageMetricsEntity;
}

export function UsageMetrics({ metrics }: UsageMetricsProps) {
  const { t } = useTranslation();

  const getProgressVariant = (percentage: number) => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const renderUsageCard = (
    title: string,
    current: number,
    limit: number,
    percentage: number
  ) => {
    const isUnlimited = limit === -1;

    return (
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">{title}</h6>
            {percentage >= 90 && !isUnlimited && (
              <ExclamationTriangle className="text-warning" />
            )}
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">
              {current} {isUnlimited ? '' : `/ ${limit}`}
            </span>
            {!isUnlimited && <span>{percentage}%</span>}
          </div>
          {!isUnlimited && (
            <ProgressBar
              now={percentage}
              variant={getProgressVariant(percentage)}
            />
          )}
          {isUnlimited && <Badge bg="success">{t('UNLIMITED')}</Badge>}
        </Card.Body>
      </Card>
    );
  };

  return (
    <>
      <h4 className="mb-4">{t('USAGE_AND_LIMITS')}</h4>

      {metrics.approaching_limits && (
        <Alert variant="warning">
          <ExclamationTriangle className="me-2" />
          {t('APPROACHING_PLAN_LIMITS')}
        </Alert>
      )}

      {metrics.exceeded_limits && (
        <Alert variant="danger">
          <ExclamationTriangle className="me-2" />
          {t('EXCEEDED_PLAN_LIMITS')}
        </Alert>
      )}

      <Row>
        <Col md={4}>
          {renderUsageCard(
            t('ACTIVE_JOB_LISTINGS'),
            metrics.usage?.active_jobs?.current || 0,
            metrics.usage?.active_jobs?.limit || 0,
            metrics.usage?.active_jobs?.percentage || 0
          )}
        </Col>
        <Col md={4}>
          {renderUsageCard(
            t('USER_ACCOUNTS'),
            metrics.usage?.users?.current || 0,
            metrics.usage?.users?.limit || 0,
            metrics.usage?.users?.percentage || 0
          )}
        </Col>
        <Col md={4}>
          {renderUsageCard(
            t('APPLICANTS_THIS_MONTH'),
            metrics.usage?.applicants_this_month?.current || 0,
            metrics.usage?.applicants_this_month?.limit || 0,
            metrics.usage?.applicants_this_month?.percentage || 0
          )}
        </Col>
      </Row>
    </>
  );
}
