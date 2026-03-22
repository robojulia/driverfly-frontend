import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card, Row, Col, Button, Modal, Table, Alert } from 'react-bootstrap';
import {
  BASE_SUBSCRIPTION,
  EMPLOYEE_TIER_PRICING,
  AI_AGENT_PLANS,
  MVR_RECORD_PRICE,
} from '../../config/billing/plans.config';
import { BillingInterval } from '../../enums/billing/subscription-plan.enum';
import { SubscriptionEntity } from '../../models/billing/subscription.entity';
import { ChevronRight, People, Building } from 'react-bootstrap-icons';

interface BaseSubscriptionDisplayProps {
  subscription: SubscriptionEntity | null;
  billingInterval: BillingInterval;
  onIntervalChange: (interval: BillingInterval) => void;
  trackedDriverEmployeeCount: number;
  employees: Array<{ id: number; name: string; email: string }>;
  users?: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    isDriver: boolean;
  }>;
  mvrEnabled?: boolean;
  mvrRecordsPulled?: number;
  aiAgentPlan?: 'STARTER' | 'STANDARD' | 'ENTERPRISE' | null;
  onToggleMvr?: (enabled: boolean) => Promise<void>;
  onCancelAiAgent?: () => Promise<void>;
  loading?: boolean;
}

const INCLUDED_EMPLOYEES = BASE_SUBSCRIPTION.includedDriverEmployees;
const INCLUDED_USERS = BASE_SUBSCRIPTION.includedUserAccounts;

const BILLING_LEGEND_USERS = '$10/mo for each additional seat';

function calculateTieredEmployeeMonthlyCost(count: number): number {
  if (count <= 0) return 0;
  let total = 0;
  let remaining = count;
  for (const tier of EMPLOYEE_TIER_PRICING) {
    const tierMin = tier.min;
    const tierMax = tier.max === Infinity ? count : tier.max;
    const tierCapacity = tierMax - tierMin + 1;
    const tierCount = Math.min(remaining, tierCapacity);
    if (tierCount > 0) {
      total += tierCount * tier.pricePerEmployee;
      remaining -= tierCount;
    }
    if (remaining <= 0) break;
  }
  return total;
}

function marginalPriceForPaidDriverSlot(paidSlotIndex: number): number {
  if (paidSlotIndex < 0) return 0;
  let slot = paidSlotIndex;
  for (const tier of EMPLOYEE_TIER_PRICING) {
    const capacity =
      tier.max === Infinity ? Infinity : tier.max - tier.min + 1;
    if (slot < capacity) return tier.pricePerEmployee;
    slot -= capacity;
  }
  return EMPLOYEE_TIER_PRICING[EMPLOYEE_TIER_PRICING.length - 1].pricePerEmployee;
}

function formatBillingDate(value?: Date | string): string | null {
  if (value == null || value === '') return null;
  try {
    return format(new Date(value), 'MMMM d, yyyy');
  } catch {
    return null;
  }
}

function OverviewStatCard({
  icon,
  label,
  value,
  hint,
  onAction,
  actionLabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint: string;
  onAction: () => void;
  actionLabel: string;
}) {
  return (
    <Card className="h-100 border shadow-sm">
      <Card.Body className="d-flex flex-column pt-4 pb-3">
        <div className="text-primary mb-2">{icon}</div>
        <div className="text-muted small fw-semibold text-uppercase mb-1">
          {label}
        </div>
        <div className="display-6 fw-bold lh-1 mb-2">{value}</div>
        <p className="text-muted small mb-3 flex-grow-1">{hint}</p>
        <Button
          type="button"
          variant="outline-primary"
          size="sm"
          className="btn-billing-action w-100 d-flex align-items-center justify-content-center gap-1"
          onClick={onAction}
        >
          {actionLabel}
          <ChevronRight size={16} aria-hidden />
        </Button>
      </Card.Body>
    </Card>
  );
}

export function BaseSubscriptionDisplay({
  subscription,
  billingInterval,
  onIntervalChange,
  trackedDriverEmployeeCount,
  employees,
  users = [],
  mvrEnabled = false,
  mvrRecordsPulled = 0,
  aiAgentPlan = null,
  onToggleMvr,
  onCancelAiAgent,
  loading = false,
}: BaseSubscriptionDisplayProps) {
  const [showDriverBreakdownModal, setShowDriverBreakdownModal] = useState(false);
  const [showUserBreakdownModal, setShowUserBreakdownModal] = useState(false);
  const [showSwitchToAnnualModal, setShowSwitchToAnnualModal] = useState(false);
  const [showTieredPricingModal, setShowTieredPricingModal] = useState(false);

  const basePrice =
    billingInterval === BillingInterval.ANNUAL
      ? BASE_SUBSCRIPTION.displayAnnualMonthlyEquivalent
      : BASE_SUBSCRIPTION.displayMonthToMonthRate;

  const paidEmployeeCount = Math.max(0, trackedDriverEmployeeCount - INCLUDED_EMPLOYEES);
  const employeeMonthlyCost = calculateTieredEmployeeMonthlyCost(paidEmployeeCount);
  const paidUserCount = Math.max(0, users.length - INCLUDED_USERS);
  const additionalUsersMonthlyCost = paidUserCount * BASE_SUBSCRIPTION.additionalSeatPrice;

  const interval = billingInterval === BillingInterval.ANNUAL ? 'annual' : 'monthly';
  const aiAgentMonthlyCost = aiAgentPlan ? AI_AGENT_PLANS[aiAgentPlan].price[interval] : 0;
  const mvrMonthlyCost = mvrEnabled ? mvrRecordsPulled * MVR_RECORD_PRICE : 0;

  const estimatedMonthlyTotal = basePrice + employeeMonthlyCost + additionalUsersMonthlyCost + aiAgentMonthlyCost + mvrMonthlyCost;

  const estimateWithMonthlyBase =
    BASE_SUBSCRIPTION.displayMonthToMonthRate + employeeMonthlyCost + additionalUsersMonthlyCost + aiAgentMonthlyCost + mvrMonthlyCost;
  const estimateWithAnnualDiscountBase =
    BASE_SUBSCRIPTION.displayAnnualMonthlyEquivalent + employeeMonthlyCost + additionalUsersMonthlyCost + aiAgentMonthlyCost + mvrMonthlyCost;
  const baseSavingsPerMonth =
    BASE_SUBSCRIPTION.displayMonthToMonthRate - BASE_SUBSCRIPTION.displayAnnualMonthlyEquivalent;

  const employeesSorted = useMemo(() => [...employees].sort((a, b) => a.id - b.id), [employees]);
  const usersSorted = useMemo(() => [...users].sort((a, b) => a.id - b.id), [users]);

  const employeeLineItems = useMemo(
    () =>
      employeesSorted.map((row, index) => {
        if (index < INCLUDED_EMPLOYEES) return { ...row, price: 0 };
        const paidSlot = index - INCLUDED_EMPLOYEES;
        return { ...row, price: marginalPriceForPaidDriverSlot(paidSlot) };
      }),
    [employeesSorted]
  );
  const userLineItems = useMemo(
    () =>
      usersSorted.map((row, index) =>
        index < INCLUDED_USERS
          ? { ...row, price: 0 }
          : { ...row, price: BASE_SUBSCRIPTION.additionalSeatPrice }
      ),
    [usersSorted]
  );
  const modalEmployeeSubtotal = employeeLineItems.reduce((s, r) => s + r.price, 0);
  const modalUserSubtotal = userLineItems.reduce((s, r) => s + r.price, 0);
  const listTruncated = trackedDriverEmployeeCount > employeesSorted.length;
  const employeeSubtotalForSummary = listTruncated ? employeeMonthlyCost : modalEmployeeSubtotal;
  const renewalDateLabel = formatBillingDate(subscription?.current_period_end);

  return (
    <div className="billing-overview">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        .billing-overview :global(.btn-billing-action:hover),
        .billing-overview :global(.btn-billing-action:focus) {
          background: var(--primary-button) !important;
          border-color: var(--primary-button) !important;
          color: var(--text-light) !important;
        }
        :global(.billing-tab-link) {
          color: var(--primary);
        }
        :global(.billing-tab-link:hover),
        :global(.billing-tab-link:focus) {
          color: var(--primary-button) !important;
        }
      `}</style>

      {subscription && (
        <Card className="mb-4 border-primary border-opacity-25 bg-primary bg-opacity-10">
          <Card.Body className="py-3">
            <Row className="align-items-start g-3">
              <Col xs={12} sm={6} md={4}>
                <span className="text-muted small d-block">Plan</span>
                <span className="fw-semibold">
                  {subscription.plan ? String(subscription.plan).toUpperCase() : '—'}
                </span>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <span className="text-muted small d-block">Status</span>
                <span className="fw-semibold text-capitalize">
                  {subscription.status ? String(subscription.status).replace(/_/g, ' ') : '—'}
                </span>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <span className="text-muted small d-block">Billing cadence</span>
                <span className="fw-semibold">
                  {billingInterval === BillingInterval.ANNUAL ? 'Annual' : 'Monthly'}
                </span>
              </Col>
              {formatBillingDate(subscription.current_period_end) &&
                billingInterval === BillingInterval.MONTHLY && (
                  <Col xs={12}>
                    <hr className="my-2 opacity-25" />
                    <span className="text-muted small d-block">Next billing date</span>
                    <span className="fw-semibold">
                      {formatBillingDate(subscription.current_period_end)}
                    </span>
                  </Col>
                )}
            </Row>
          </Card.Body>
        </Card>
      )}

      <h5 className="mb-3">Your usage</h5>
      <p className="text-muted small mb-3">
        These numbers drive variable charges. Open the breakdown to see each person and line-item pricing.
      </p>
      <Row className="g-3 mb-3">
        <Col md={4}>
          <Card className="h-100 border shadow-sm">
            <Card.Body className="d-flex flex-column pt-4 pb-3">
              <div className="text-muted small fw-semibold text-uppercase mb-1">
                Base Subscription
              </div>
              <div className="display-6 fw-bold text-primary lh-1 mb-2">
                ${basePrice}/mo
              </div>
              {billingInterval === BillingInterval.MONTHLY && (
                <p className="mb-2">
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-underline text-primary small"
                    onClick={() => setShowSwitchToAnnualModal(true)}
                  >
                    Switch to annual?
                  </button>
                </p>
              )}
              {billingInterval === BillingInterval.ANNUAL && renewalDateLabel && (
                <p className="text-muted small mb-2">Renewal: {renewalDateLabel}</p>
              )}
              <div className="text-muted small flex-grow-1">
                <p className="mb-2">
                  Up to {INCLUDED_EMPLOYEES} driver employees included; additional drivers incur{' '}
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-underline small align-baseline"
                    style={{ fontSize: 'inherit' }}
                    onClick={() => setShowTieredPricingModal(true)}
                  >
                    additional fees
                  </button>
                  .
                </p>
                <p className="mb-0">{BILLING_LEGEND_USERS}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <OverviewStatCard
            icon={<People size={28} aria-hidden />}
            label="Driver employees tracked"
            value={trackedDriverEmployeeCount}
            hint={`First ${INCLUDED_EMPLOYEES} included. Additional employees use tiered rates.`}
            onAction={() => setShowDriverBreakdownModal(true)}
            actionLabel="View pricing breakdown"
          />
        </Col>
        <Col md={4}>
          <OverviewStatCard
            icon={<Building size={28} aria-hidden />}
            label="Active company users"
            value={users.length}
            hint={`First ${INCLUDED_USERS} included. ${BILLING_LEGEND_USERS}.`}
            onAction={() => setShowUserBreakdownModal(true)}
            actionLabel="View pricing breakdown"
          />
        </Col>
        {aiAgentPlan && (
          <Col md={4}>
            <Card className="h-100 border shadow-sm">
              <Card.Body className="d-flex flex-column pt-4 pb-3">
                <div className="text-muted small fw-semibold text-uppercase mb-1">
                  AI Agent Campaigns
                </div>
                <div className="display-6 fw-bold text-primary lh-1 mb-2">
                  ${aiAgentMonthlyCost}/mo
                </div>
                <p className="text-muted small mb-3 flex-grow-1">
                  {AI_AGENT_PLANS[aiAgentPlan].name} Plan &bull;{' '}
                  {AI_AGENT_PLANS[aiAgentPlan].credits} credits/mo
                </p>
                <div className="d-flex gap-2">
                  <Button
                    type="button"
                    variant="outline-primary"
                    size="sm"
                    className="btn-billing-action flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                    onClick={() => {
                      document
                        .getElementById('ai-agent-campaigns')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Change Plan
                    <ChevronRight size={16} aria-hidden />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to cancel AI Agent Campaigns?'
                        )
                      ) {
                        onCancelAiAgent?.();
                      }
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
        {mvrEnabled && (
          <Col md={4}>
            <Card className="h-100 border shadow-sm">
              <Card.Body className="d-flex flex-column pt-4 pb-3">
                <div className="text-muted small fw-semibold text-uppercase mb-1">
                  MVR Records
                </div>
                <div className="display-6 fw-bold text-primary lh-1 mb-2">
                  ${mvrMonthlyCost.toFixed(2)}
                </div>
                <p className="text-muted small mb-3 flex-grow-1">
                  {mvrRecordsPulled} records pulled @ ${MVR_RECORD_PRICE}/ea this
                  month
                </p>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="w-100"
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you want to deactivate MVR Record Pulling?'
                      )
                    ) {
                      onToggleMvr?.(false);
                    }
                  }}
                  disabled={loading}
                >
                  Deactivate
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      <Card className="border shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-2">Estimated this month</h5>
          <p className="text-muted small mb-3">
            Stripe invoices are final; this follows Standard list pricing and your current counts.
          </p>
          <div className="display-5 fw-bold text-primary mb-4">
            ${estimatedMonthlyTotal.toFixed(2)}
            <span className="fs-6 fw-normal text-muted"> / month</span>
          </div>
          <ul className="list-unstyled small mb-0">
            <li className="d-flex justify-content-between py-2 border-bottom">
              <span>Base subscription</span>
              <span className="fw-semibold">${basePrice.toFixed(2)}</span>
            </li>
            <li className="d-flex justify-content-between py-2 border-bottom">
              <span>
                Driver employees (beyond {INCLUDED_EMPLOYEES} included){' '}
                <span className="text-muted">({paidEmployeeCount} billable)</span>
              </span>
              <span className="fw-semibold">${employeeMonthlyCost.toFixed(2)}</span>
            </li>
            <li className="d-flex justify-content-between py-2 border-bottom">
              <span>
                Additional users (beyond {INCLUDED_USERS} included){' '}
                <span className="text-muted">({paidUserCount})</span>
              </span>
              <span className="fw-semibold">${additionalUsersMonthlyCost.toFixed(2)}</span>
            </li>
            {aiAgentPlan && (
              <li className="d-flex justify-content-between py-2 border-bottom">
                <span>
                  AI Agent Campaigns{' '}
                  <span className="text-muted">({AI_AGENT_PLANS[aiAgentPlan].name})</span>
                </span>
                <span className="fw-semibold">${aiAgentMonthlyCost.toFixed(2)}</span>
              </li>
            )}
            {mvrEnabled && (
              <li className="d-flex justify-content-between py-2 border-bottom">
                <span>
                  MVR Records{' '}
                  <span className="text-muted">({mvrRecordsPulled} pulled @ ${MVR_RECORD_PRICE}/ea)</span>
                </span>
                <span className="fw-semibold">${mvrMonthlyCost.toFixed(2)}</span>
              </li>
            )}
          </ul>
        </Card.Body>
      </Card>

      <Modal show={showDriverBreakdownModal} onHide={() => setShowDriverBreakdownModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Driver employee pricing breakdown</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="light" className="border small text-muted mb-4 fw-normal">
            <p className="mb-0">
              Up to {INCLUDED_EMPLOYEES} driver employees included; additional drivers incur{' '}
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-underline small align-baseline"
                style={{ fontSize: 'inherit' }}
                onClick={() => { setShowDriverBreakdownModal(false); setShowTieredPricingModal(true); }}
              >
                additional fees
              </button>
              .
            </p>
          </Alert>

          {listTruncated && (
            <Alert variant="warning" className="py-2 small">
              Showing {employeesSorted.length} of {trackedDriverEmployeeCount} employees in this table. Open the Employee directory for the full list.
            </Alert>
          )}

          <Table responsive striped bordered hover size="sm" className="mb-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th className="text-end">Price / month</th>
              </tr>
            </thead>
            <tbody>
              {employeeLineItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-muted text-center py-3">No active driver employees loaded.</td>
                </tr>
              ) : (
                employeeLineItems.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td className="small">{row.email}</td>
                    <td className="text-end">
                      {row.price === 0 ? <span className="text-success">$0.00 (included)</span> : `$${row.price.toFixed(2)}`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="fw-semibold">
                <td colSpan={2}>
                  Subtotal
                  {listTruncated && <div className="fw-normal text-muted small">Full-account estimate (table may be partial)</div>}
                </td>
                <td className="text-end">${employeeSubtotalForSummary.toFixed(2)}/mo</td>
              </tr>
            </tfoot>
          </Table>
          <p className="text-muted small mb-0">
            To delete any of these employees, go to your{' '}
            <Link href="/dashboard/company/compliance/employee-directory">
              <a className="fw-semibold billing-tab-link">Employee tab</a>
            </Link>{' '}
            and hit delete.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDriverBreakdownModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUserBreakdownModal} onHide={() => setShowUserBreakdownModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Company user pricing breakdown</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="light" className="border small text-muted mb-4 fw-normal">
            <p className="mb-0">
              First {INCLUDED_USERS} user included; {BILLING_LEGEND_USERS}.
            </p>
          </Alert>

          <Table responsive striped bordered hover size="sm" className="mb-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th className="text-end">Price / month</th>
              </tr>
            </thead>
            <tbody>
              {userLineItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-muted text-center py-3">No active company users.</td>
                </tr>
              ) : (
                userLineItems.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td className="small">{row.email}</td>
                    <td className="small">{row.role}</td>
                    <td className="text-end">
                      {row.price === 0 ? <span className="text-success">$0.00 (included)</span> : `$${row.price.toFixed(2)}`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="fw-semibold">
                <td colSpan={3}>Subtotal</td>
                <td className="text-end">${modalUserSubtotal.toFixed(2)}/mo</td>
              </tr>
            </tfoot>
          </Table>
          <p className="text-muted small mb-0">
            To delete any of these users, go to your{' '}
            <Link href="/dashboard/company/settings/users">
              <a className="fw-semibold billing-tab-link">Users tab</a>
            </Link>{' '}
            and hit delete.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserBreakdownModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSwitchToAnnualModal} onHide={() => setShowSwitchToAnnualModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Switch to annual billing?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small mb-3">
            Annual billing uses the lower base rate (
            <strong>${BASE_SUBSCRIPTION.displayAnnualMonthlyEquivalent}/month</strong> equivalent instead of{' '}
            <strong>${BASE_SUBSCRIPTION.displayMonthToMonthRate}/month</strong>).
            Variable charges (employees and users) stay the same.
          </p>
          <Table bordered size="sm" className="mb-3">
            <thead>
              <tr>
                <th />
                <th className="text-end">Month-to-month</th>
                <th className="text-end">Annual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Base subscription</td>
                <td className="text-end">${BASE_SUBSCRIPTION.displayMonthToMonthRate.toFixed(2)}/mo</td>
                <td className="text-end">${BASE_SUBSCRIPTION.displayAnnualMonthlyEquivalent.toFixed(2)}/mo</td>
              </tr>
              <tr>
                <td>Variable (employees + users)</td>
                <td className="text-end">${(employeeMonthlyCost + additionalUsersMonthlyCost).toFixed(2)}/mo</td>
                <td className="text-end">${(employeeMonthlyCost + additionalUsersMonthlyCost).toFixed(2)}/mo</td>
              </tr>
              <tr className="fw-semibold">
                <td>Est. total / month</td>
                <td className="text-end">${estimateWithMonthlyBase.toFixed(2)}</td>
                <td className="text-end">${estimateWithAnnualDiscountBase.toFixed(2)}</td>
              </tr>
            </tbody>
          </Table>
          <p className="small text-success mb-0">
            You save about <strong>${baseSavingsPerMonth.toFixed(2)}/month</strong> on the base plan (
            <strong>~${(baseSavingsPerMonth * 12).toFixed(0)}/year</strong> on base alone).
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSwitchToAnnualModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onIntervalChange(BillingInterval.ANNUAL);
              setShowSwitchToAnnualModal(false);
            }}
          >
            Confirm switch to annual
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTieredPricingModal} onHide={() => setShowTieredPricingModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Additional driver employee fees</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small mb-3">
            The first {INCLUDED_EMPLOYEES} driver employees are included in your base subscription.
            Beyond that, tiered monthly rates apply based on headcount:
          </p>
          <Table bordered size="sm" className="mb-3">
            <thead>
              <tr>
                <th>Additional driver employees</th>
                <th className="text-end">Rate per employee</th>
              </tr>
            </thead>
            <tbody>
              {EMPLOYEE_TIER_PRICING.map((tier) => {
                const rangeLabel =
                  tier.max === Infinity
                    ? `${tier.min}+`
                    : `${tier.min}\u2013${tier.max}`;
                return (
                  <tr key={`${tier.min}-${tier.max}`}>
                    <td>{rangeLabel}</td>
                    <td className="text-end">${tier.pricePerEmployee}/mo</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <p className="text-muted small mb-0">
            For example, if you have {INCLUDED_EMPLOYEES + 15} total driver employees,
            the first {INCLUDED_EMPLOYEES} are included, the next 11 are $4/mo each ($44),
            and the remaining 4 are $3/mo each ($12), totalling $56/mo in additional fees.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTieredPricingModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
