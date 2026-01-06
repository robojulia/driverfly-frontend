import React, { useState } from 'react';
import { Card, Row, Col, Form, Button, Modal, Table, Badge } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';
import {
  BASE_SUBSCRIPTION,
  EMPLOYEE_TIER_PRICING,
} from '../../config/billing/plans.config';
import { BillingInterval } from '../../enums/billing/subscription-plan.enum';
import { People } from 'react-bootstrap-icons';

interface BaseSubscriptionDisplayProps {
  billingInterval: BillingInterval;
  onIntervalChange: (interval: BillingInterval) => void;
  employeeCount?: number;
  driverSeats?: number;
  users?: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    isDriver: boolean;
  }>;
}

export function BaseSubscriptionDisplay({
  billingInterval,
  onIntervalChange,
  employeeCount = 0,
  driverSeats = 0,
  users = [],
}: BaseSubscriptionDisplayProps) {
  const { t } = useTranslation();
  const [showUserList, setShowUserList] = useState(false);

  const basePrice =
    billingInterval === BillingInterval.ANNUAL
      ? BASE_SUBSCRIPTION.annual
      : BASE_SUBSCRIPTION.monthly;

  const calculateEmployeeCost = (count: number): number => {
    if (count <= 0) return 0;

    let total = 0;
    let remaining = count;

    for (const tier of EMPLOYEE_TIER_PRICING) {
      const tierMin = tier.min;
      const tierMax = tier.max === Infinity ? count : tier.max;
      const tierCount = Math.min(remaining, tierMax - tierMin + 1);

      if (tierCount > 0) {
        total += tierCount * tier.pricePerEmployee;
        remaining -= tierCount;
      }

      if (remaining <= 0) break;
    }

    return total;
  };

  const employeeCost = calculateEmployeeCost(employeeCount);
  const totalMonthly = basePrice + employeeCost;

  const driverUsers = users.filter((u) => u.isDriver);
  const nonDriverUsers = users.filter((u) => !u.isDriver);
  const additionalSeats = Math.max(0, driverSeats - BASE_SUBSCRIPTION.baseDriverSeats);

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 className="mb-1">Base Subscription</h5>
              <p className="text-muted mb-0">
                Your monthly subscription and employee seats
              </p>
            </div>
            <div>
              <Form.Check
                type="switch"
                id="billing-interval-toggle"
                label={
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>
                    {billingInterval === BillingInterval.MONTHLY
                      ? 'Monthly'
                      : 'Annual (Save 30%)'}
                  </span>
                }
                checked={billingInterval === BillingInterval.ANNUAL}
                onChange={(e) =>
                  onIntervalChange(
                    e.target.checked
                      ? BillingInterval.ANNUAL
                      : BillingInterval.MONTHLY
                  )
                }
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>

        <Row>
          <Col md={6}>
            <div className="mb-3">
              <h3 className="mb-0">
                ${basePrice}
                <small className="text-muted">/month</small>
              </h3>
              <p className="text-muted mb-0">
                Base subscription (includes up to{' '}
                {BASE_SUBSCRIPTION.baseDriverSeats} driver seats)
              </p>
              {billingInterval === BillingInterval.ANNUAL && (
                <small className="text-success">
                  Annual billing - saving 30%
                </small>
              )}
            </div>

            <div className="mb-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <People size={20} className="text-primary" />
                <strong>Driver Seats:</strong>
                <span>{driverSeats} seats</span>
                {additionalSeats > 0 && (
                  <Badge bg="info">+{additionalSeats} additional</Badge>
                )}
              </div>
              <p className="text-muted small mb-0">
                Includes {BASE_SUBSCRIPTION.baseDriverSeats} base seats •
                Additional seats: ${BASE_SUBSCRIPTION.additionalSeatPrice}/seat
              </p>
            </div>

            <div className="p-3 bg-light rounded mb-3">
              <h6>Tiered Employee Pricing:</h6>
              <ul className="mb-0 small">
                <li>0-10 employees: $4 per employee/month</li>
                <li>11-50 employees: $3 per employee/month</li>
                <li>51+ employees: $2 per employee/month</li>
              </ul>
              <div className="mt-2 text-muted small">
                Current: {employeeCount} employees
              </div>
            </div>

            <div>
              <h6 className="mb-2">Additional Seats</h6>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowUserList(true)}
              >
                View User List ({users.length} users)
              </Button>
            </div>
          </Col>

          <Col md={6}>
            <Card className="bg-primary text-white">
              <Card.Body>
                <h6 className="text-white-50 mb-2">Current Monthly Total</h6>
                <h2 className="mb-3">
                  ${totalMonthly.toFixed(2)}
                  <small>/month</small>
                </h2>
                <div className="border-top border-white-50 pt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Base subscription:</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>
                  {employeeCount > 0 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>
                        Employees ({employeeCount}):
                      </span>
                      <span>${employeeCost.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>

    {/* User List Modal */}
    <Modal show={showUserList} onHide={() => setShowUserList(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>User List & Seat Allocation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h6>Seat Summary</h6>
          <div className="d-flex gap-4">
            <div>
              <div className="text-muted small">Total Driver Seats</div>
              <div className="h5 mb-0">{driverSeats}</div>
            </div>
            <div>
              <div className="text-muted small">Driver Users</div>
              <div className="h5 mb-0">{driverUsers.length}</div>
            </div>
            <div>
              <div className="text-muted small">Non-Driver Users</div>
              <div className="h5 mb-0">{nonDriverUsers.length}</div>
            </div>
            <div>
              <div className="text-muted small">Available Seats</div>
              <div className="h5 mb-0">
                {Math.max(0, driverSeats - driverUsers.length)}
              </div>
            </div>
          </div>
        </div>

        {driverUsers.length > 0 && (
          <div className="mb-4">
            <h6>Driver Users ({driverUsers.length})</h6>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {driverUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg="primary">{user.role}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {nonDriverUsers.length > 0 && (
          <div>
            <h6>Non-Driver Users ({nonDriverUsers.length})</h6>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {nonDriverUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg="secondary">{user.role}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {users.length === 0 && (
          <div className="text-center py-4 text-muted">
            No users found in your account.
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowUserList(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  );
}
