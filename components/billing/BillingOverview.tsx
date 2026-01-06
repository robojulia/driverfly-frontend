import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';
import { SubscriptionEntity } from '../../models/billing/subscription.entity';
import { PLAN_CONFIGS } from '../../config/billing/plans.config';
import { format } from 'date-fns';
import {
  CreditCard,
  Calendar,
  GraphUp,
} from 'react-bootstrap-icons';

interface BillingOverviewProps {
  subscription: SubscriptionEntity;
  onManagePlan: () => void;
  onManagePayment: () => void;
}

export function BillingOverview({
  subscription,
  onManagePlan,
  onManagePayment,
}: BillingOverviewProps) {
  const { t } = useTranslation();

  const planConfig = subscription?.plan
    ? PLAN_CONFIGS[subscription.plan]
    : null;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'success',
      trialing: 'info',
      past_due: 'warning',
      canceled: 'danger',
      incomplete: 'warning',
    };
    return (
      <Badge bg={variants[status] || 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Row>
      <Col md={4}>
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <GraphUp size={24} className="me-2 text-primary" />
              <h5 className="mb-0">{t('CURRENT_PLAN')}</h5>
            </div>
            <h3>{planConfig?.name || 'No Plan'}</h3>
            <p className="text-muted">
              {getStatusBadge(subscription?.status || 'inactive')}
            </p>
            {subscription?.billing_interval && (
              <p className="mb-3">
                <strong>
                  ${planConfig?.price[subscription.billing_interval] || 0}
                </strong>
                /
                {subscription.billing_interval === 'monthly'
                  ? t('MONTH')
                  : t('YEAR')}
              </p>
            )}
            <Button
              variant="outline-primary"
              onClick={onManagePlan}
              className="w-100"
            >
              {t('CHANGE_PLAN')}
            </Button>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4}>
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <Calendar size={24} className="me-2 text-primary" />
              <h5 className="mb-0">{t('BILLING_PERIOD')}</h5>
            </div>
            {subscription?.current_period_start &&
              subscription?.current_period_end && (
                <>
                  <p className="mb-1">
                    <small className="text-muted">{t('STARTED')}:</small>
                    <br />
                    {format(
                      new Date(subscription.current_period_start),
                      'MMM dd, yyyy'
                    )}
                  </p>
                  <p className="mb-3">
                    <small className="text-muted">{t('RENEWS')}:</small>
                    <br />
                    {format(
                      new Date(subscription.current_period_end),
                      'MMM dd, yyyy'
                    )}
                  </p>
                </>
              )}
            {subscription?.cancel_at_period_end && (
              <Badge bg="warning">{t('CANCELS_AT_PERIOD_END')}</Badge>
            )}
          </Card.Body>
        </Card>
      </Col>

      <Col md={4}>
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <CreditCard size={24} className="me-2 text-primary" />
              <h5 className="mb-0">{t('PAYMENT_METHOD')}</h5>
            </div>
            <p className="text-muted">{t('MANAGE_YOUR_PAYMENT_METHODS')}</p>
            <Button
              variant="outline-primary"
              onClick={onManagePayment}
              className="w-100"
            >
              {t('MANAGE_PAYMENT_METHODS')}
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
