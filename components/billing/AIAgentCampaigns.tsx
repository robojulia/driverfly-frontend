import React, { useState } from 'react';
import { Card, Row, Col, Button, Badge, Modal } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';
import { AI_AGENT_PLANS } from '../../config/billing/plans.config';
import { Check } from 'react-bootstrap-icons';
import { BillingInterval } from '../../enums/billing/subscription-plan.enum';

interface AIAgentCampaignsProps {
  currentPlan?: 'STARTER' | 'STANDARD' | 'ENTERPRISE' | null;
  billingInterval?: BillingInterval;
  onSelectPlan: (
    plan: 'STARTER' | 'STANDARD' | 'ENTERPRISE' | null
  ) => Promise<void>;
  loading?: boolean;
}

export function AIAgentCampaigns({
  currentPlan,
  billingInterval = BillingInterval.MONTHLY,
  onSelectPlan,
  loading,
}: AIAgentCampaignsProps) {
  const { t } = useTranslation();
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<
    'STARTER' | 'STANDARD' | 'ENTERPRISE' | null
  >(null);

  const handlePlanClick = (planKey: 'STARTER' | 'STANDARD' | 'ENTERPRISE') => {
    setSelectedPlan(planKey);
    setShowPlanSelector(false);
    setShowConfirmation(true);
  };

  const handleCancelPlan = () => {
    setSelectedPlan(null);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    await onSelectPlan(selectedPlan);
    setSelectedPlan(null);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedPlan(null);
  };

  const plans = [
    { key: 'STARTER' as const, config: AI_AGENT_PLANS.STARTER },
    { key: 'STANDARD' as const, config: AI_AGENT_PLANS.STANDARD },
    { key: 'ENTERPRISE' as const, config: AI_AGENT_PLANS.ENTERPRISE },
  ];

  const interval =
    billingInterval === BillingInterval.ANNUAL ? 'annual' : 'monthly';

  const currentPlanConfig = currentPlan ? AI_AGENT_PLANS[currentPlan] : null;

  const getPlanName = (key: 'STARTER' | 'STANDARD' | 'ENTERPRISE' | null) => {
    if (!key) return 'service';
    return AI_AGENT_PLANS[key].name;
  };

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <h5 className="mb-2">AI Agent SMS/Call Campaigns</h5>
              <p className="text-muted mb-3">
                Automated outreach via SMS and phone calls powered by AI
              </p>

              {currentPlan ? (
                <div className="mb-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Badge bg="success">Active</Badge>
                    <strong>{currentPlanConfig?.name} Plan</strong>
                  </div>
                  <div className="text-muted small">
                    <div>
                      ${currentPlanConfig?.price[interval]}/month •{' '}
                      {currentPlanConfig?.credits} credits/month
                    </div>
                    <div>
                      {currentPlanConfig?.personas === -1
                        ? 'Unlimited'
                        : currentPlanConfig?.personas}{' '}
                      Personas • {currentPlanConfig?.phoneLines} Phone Lines
                    </div>
                  </div>
                </div>
              ) : (
                <div className="alert alert-info mb-3">
                  <strong>Not subscribed.</strong> Choose a plan to get started
                  with AI-powered campaigns.
                </div>
              )}

              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowPlanSelector(true)}
                >
                  {currentPlan ? 'Change Plan' : 'Choose a Plan'}
                </Button>
                {currentPlan && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleCancelPlan}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Plan Selector Modal */}
      <Modal
        show={showPlanSelector}
        onHide={() => setShowPlanSelector(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>AI Agent Campaign Plans</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-4">
            Select a plan that fits your outreach needs. All plans include
            AI-powered SMS and call campaigns.
          </p>

          <Row>
            {plans.map(({ key, config }) => (
              <Col md={4} key={key} className="mb-3">
                <Card
                  className={`h-100 ${
                    key === 'STANDARD' ? 'border-primary' : ''
                  } ${currentPlan === key ? 'border-success border-2' : ''}`}
                  style={{ position: 'relative', paddingTop: '15px' }}
                >
                  {key === 'STANDARD' && (
                    <Badge
                      bg="primary"
                      style={{
                        position: 'absolute',
                        top: '15px',
                        right: '20px',
                        zIndex: 10,
                      }}
                    >
                      Most Popular
                    </Badge>
                  )}
                  {currentPlan === key && (
                    <Badge
                      bg="success"
                      style={{
                        position: 'absolute',
                        top: '15px',
                        left: '20px',
                        zIndex: 10,
                      }}
                    >
                      Current Plan
                    </Badge>
                  )}
                  <Card.Body className="d-flex flex-column">
                    <h4 className="mb-3">{config.name}</h4>

                    <div className="mb-3">
                      <h2>
                        ${config.price[interval]}
                        <small className="text-muted">/mo</small>
                      </h2>
                      {billingInterval === BillingInterval.ANNUAL && (
                        <small className="text-success">
                          Save 30% with annual billing
                        </small>
                      )}
                    </div>

                    <ul className="list-unstyled mb-4 flex-grow-1">
                      <li className="mb-2">
                        <Check className="me-2 text-success" size={18} />
                        <strong>{config.credits} credits/mo</strong>
                      </li>
                      <li className="mb-2">
                        <Check className="me-2 text-success" size={18} />
                        {config.personas === -1
                          ? 'Unlimited'
                          : config.personas}{' '}
                        Agent {config.personas === 1 ? 'Persona' : 'Personas'}
                      </li>
                      <li className="mb-2">
                        <Check className="me-2 text-success" size={18} />
                        {config.flows === -1
                          ? 'Unlimited'
                          : `Up to ${config.flows}`}{' '}
                        {config.flows === 1 ? 'Flow' : 'Flows'}
                      </li>
                      <li className="mb-2">
                        <Check className="me-2 text-success" size={18} />
                        {config.phoneLines}{' '}
                        {config.phoneLines === 1 ? 'Phone Line' : 'Phone Lines'}
                      </li>
                      {(config as any).customIntegration && (
                        <li className="mb-2">
                          <Check className="me-2 text-success" size={18} />
                          Custom Integration Setup
                        </li>
                      )}
                      <li className="mt-3 text-muted small">
                        Additional credits: ${config.additionalCredits.price}{' '}
                        for {config.additionalCredits.amount} credits
                      </li>
                    </ul>

                    <Button
                      variant={currentPlan === key ? 'secondary' : 'primary'}
                      onClick={() => handlePlanClick(key)}
                      disabled={loading || currentPlan === key}
                      className="w-100"
                    >
                      {currentPlan === key
                        ? 'Current Plan'
                        : currentPlan
                        ? 'Switch to This Plan'
                        : 'Select Plan'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-4 p-3 bg-light rounded">
            <h6>Credit System</h6>
            <p className="mb-1">
              <strong>1 credit =</strong>
            </p>
            <ul className="mb-0">
              <li>1 minute of phone call, OR</li>
              <li>8 SMS messages</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPlanSelector(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPlan ? 'Subscribe to' : 'Cancel'} AI Agent Campaigns
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlan ? (
            <>
              <h6>Terms & Conditions</h6>
              <p>
                By subscribing to the{' '}
                <strong>{getPlanName(selectedPlan)}</strong> plan, you agree to
                the following:
              </p>
              <ul>
                <li>
                  You will be charged{' '}
                  <strong>
                    ${AI_AGENT_PLANS[selectedPlan].price[interval]}
                  </strong>{' '}
                  per month
                </li>
                <li>Credits do not roll over to the next billing period</li>
                <li>You can purchase additional credits at any time</li>
                <li>
                  You can upgrade, downgrade, or cancel your subscription at any
                  time
                </li>
                <li>
                  All AI agent communications comply with TCPA regulations
                </li>
              </ul>
              <p className="text-muted small">
                For full terms and conditions, please see our{' '}
                <a href="/terms" target="_blank">
                  Terms of Service
                </a>
                .
              </p>
            </>
          ) : (
            <p>
              Are you sure you want to cancel AI Agent Campaigns? This will stop
              all automated outreach and you will lose access to unused credits.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant={selectedPlan ? 'primary' : 'danger'}
            onClick={handleConfirm}
            disabled={loading}
          >
            {selectedPlan ? 'I Agree - Subscribe' : 'Cancel Subscription'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
