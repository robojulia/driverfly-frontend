import React, { useState } from 'react';
import { Card, Row, Col, Button, Form, Badge } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';
import { PLAN_CONFIGS } from '../../config/billing/plans.config';
import {
  SubscriptionPlan,
  BillingInterval,
} from '../../enums/billing/subscription-plan.enum';
import { Check } from 'react-bootstrap-icons';

interface PlanSelectorProps {
  currentPlan?: SubscriptionPlan;
  currentInterval?: BillingInterval;
  onSelectPlan: (plan: SubscriptionPlan, interval: BillingInterval) => void;
  loading?: boolean;
}

export function PlanSelector({
  currentPlan,
  currentInterval,
  onSelectPlan,
  loading,
}: PlanSelectorProps) {
  const { t } = useTranslation();
  const [interval, setInterval] = useState<BillingInterval>(
    currentInterval || BillingInterval.MONTHLY
  );

  const plans = [
    PLAN_CONFIGS[SubscriptionPlan.BASIC],
    PLAN_CONFIGS[SubscriptionPlan.PRO],
    PLAN_CONFIGS[SubscriptionPlan.ENTERPRISE],
  ];

  return (
    <>
      <div className="text-center mb-4">
        <h2>{t('CHOOSE_YOUR_PLAN')}</h2>
        <p className="text-muted">{t('PLAN_SELECTION_DESCRIPTION')}</p>

        <Form.Check
          type="switch"
          id="billing-interval-switch"
          label={
            interval === BillingInterval.MONTHLY
              ? 'Monthly'
              : 'Annual (Save 30%)'
          }
          checked={interval === BillingInterval.ANNUAL}
          onChange={(e) =>
            setInterval(
              e.target.checked
                ? BillingInterval.ANNUAL
                : BillingInterval.MONTHLY
            )
          }
          className="d-inline-block"
        />
      </div>

      <Row className="justify-content-center">
        {plans.map((planConfig) => (
          <Col md={4} key={planConfig.plan} className="mb-4">
            <Card
              className={`h-100 ${planConfig.popular ? 'border-primary' : ''}`}
              style={{ position: 'relative' }}
            >
              {planConfig.popular && (
                <Badge
                  bg="primary"
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '20px',
                  }}
                >
                  {t('MOST_POPULAR')}
                </Badge>
              )}
              <Card.Body className="d-flex flex-column">
                <h3>{planConfig.name}</h3>
                <p className="text-muted">{planConfig.description}</p>

                <div className="mb-4">
                  <h2>
                    ${planConfig.price[interval]}
                    <small className="text-muted">
                      /
                      {interval === BillingInterval.MONTHLY
                        ? t('MONTH')
                        : t('YEAR')}
                    </small>
                  </h2>
                </div>

                <ul className="list-unstyled mb-4 flex-grow-1">
                  {planConfig.features.map((feature, idx) => (
                    <li key={idx} className="mb-2">
                      <Check
                        className={`me-2 ${
                          feature.included ? 'text-success' : 'text-muted'
                        }`}
                      />
                      {feature.name}:{' '}
                      <strong>
                        {typeof feature.included === 'boolean'
                          ? feature.included
                            ? t('YES')
                            : t('NO')
                          : feature.included}
                      </strong>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={
                    currentPlan === planConfig.plan ? 'secondary' : 'primary'
                  }
                  onClick={() => onSelectPlan(planConfig.plan, interval)}
                  disabled={loading || currentPlan === planConfig.plan}
                  className="w-100"
                >
                  {currentPlan === planConfig.plan
                    ? t('CURRENT_PLAN')
                    : planConfig.cta}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
