import React, { useState } from 'react';
import { Card, Form, Button, InputGroup, FormControl, Badge } from 'react-bootstrap';
import { PlusCircle, PersonCircle, Envelope } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/use-translation';
import { EmployeeEntity } from '../../models/employee/employee.entity';

interface VehicleNotificationRecipientsProps {
  assignedDriver?: EmployeeEntity | null;
  canEdit?: boolean;
  onSave?: (recipients: { driverEmail?: string; driverPhone?: string; thirdPartyRecipients: string[] }) => void;
}

export default function VehicleNotificationRecipients({
  assignedDriver,
  canEdit = true,
  onSave,
}: VehicleNotificationRecipientsProps) {
  const { t } = useTranslation();

  const [notifyDriver, setNotifyDriver] = useState(true);
  const [driverEmail, setDriverEmail] = useState(assignedDriver?.email || '');
  const [driverPhone, setDriverPhone] = useState(assignedDriver?.phone || '');
  const [thirdPartyRecipients, setThirdPartyRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState('');

  const handleAddRecipient = () => {
    if (newRecipient && !thirdPartyRecipients.includes(newRecipient)) {
      setThirdPartyRecipients([...thirdPartyRecipients, newRecipient]);
      setNewRecipient('');
    }
  };

  const handleRemoveRecipient = (recipient: string) => {
    setThirdPartyRecipients(thirdPartyRecipients.filter((r) => r !== recipient));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        driverEmail: notifyDriver ? driverEmail : undefined,
        driverPhone: notifyDriver ? driverPhone : undefined,
        thirdPartyRecipients,
      });
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="mb-4">
          <h6 style={{ fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                width: '8px',
                height: '24px',
                backgroundColor: 'rgb(0, 96, 120)',
                marginRight: '0.75rem',
                borderRadius: '2px',
              }}
            ></span>
            Notification Recipients
          </h6>
          <p style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: 0 }}>
            Configure who receives notifications for this vehicle's documentation reminders
          </p>
        </div>

        {/* Assigned Driver Section */}
        <div
          style={{
            border: '1px solid #dee2e6',
            borderRadius: '0.375rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            backgroundColor: '#f8f9fa',
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2">
              <PersonCircle size={24} style={{ color: 'rgb(0, 96, 120)' }} />
              <div>
                <h6 style={{ margin: 0, fontWeight: 600 }}>Assigned Driver</h6>
                {assignedDriver ? (
                  <p style={{ fontSize: '0.875rem', color: '#6c757d', margin: 0 }}>
                    {assignedDriver.first_name} {assignedDriver.last_name}
                  </p>
                ) : (
                  <p style={{ fontSize: '0.875rem', color: '#dc3545', margin: 0 }}>
                    No driver assigned
                  </p>
                )}
              </div>
            </div>
            {assignedDriver && (
              <Form.Check
                type="switch"
                id="notify-driver-switch"
                label="Notify Driver"
                checked={notifyDriver}
                onChange={(e) => setNotifyDriver(e.target.checked)}
                disabled={!canEdit}
                style={{ fontSize: '0.875rem' }}
              />
            )}
          </div>

          {assignedDriver && notifyDriver && (
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #dee2e6' }}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  Driver Email
                </Form.Label>
                <InputGroup size="sm">
                  <InputGroup.Text>
                    <Envelope size={14} />
                  </InputGroup.Text>
                  <FormControl
                    type="email"
                    placeholder="driver@email.com"
                    value={driverEmail}
                    onChange={(e) => setDriverEmail(e.target.value)}
                    disabled={!canEdit}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-0">
                <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  Driver Phone
                </Form.Label>
                <InputGroup size="sm">
                  <InputGroup.Text>
                    <PersonCircle size={14} />
                  </InputGroup.Text>
                  <FormControl
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    disabled={!canEdit}
                  />
                </InputGroup>
              </Form.Group>
            </div>
          )}

          {!assignedDriver && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#fff',
                borderRadius: '0.25rem',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: '#6c757d',
              }}
            >
              Assign a driver to this vehicle to enable driver notifications
            </div>
          )}
        </div>

        {/* Third Party Recipients Section */}
        <div
          style={{
            border: '1px solid #dee2e6',
            borderRadius: '0.375rem',
            padding: '1rem',
            backgroundColor: '#fff',
          }}
        >
          <h6 style={{ fontWeight: 600, marginBottom: '1rem' }}>Third Party Recipients</h6>
          <p style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '1rem' }}>
            Add additional email addresses or phone numbers to receive notifications
          </p>

          <InputGroup size="sm" className="mb-3">
            <FormControl
              placeholder="Enter email or phone number"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddRecipient();
                }
              }}
              disabled={!canEdit}
            />
            <Button
              variant="outline-secondary"
              onClick={handleAddRecipient}
              disabled={!canEdit || !newRecipient}
            >
              <PlusCircle size={16} />
            </Button>
          </InputGroup>

          {thirdPartyRecipients.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {thirdPartyRecipients.map((recipient, idx) => (
                <Badge
                  key={idx}
                  bg="secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {recipient}
                  {canEdit && (
                    <span
                      onClick={() => handleRemoveRecipient(recipient)}
                      style={{
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        marginLeft: '0.25rem',
                      }}
                    >
                      ×
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '0.25rem',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: '#6c757d',
              }}
            >
              No third party recipients added yet
            </div>
          )}
        </div>

        {canEdit && (
          <div className="d-flex justify-content-end mt-4">
            <Button
              onClick={handleSave}
              style={{
                backgroundColor: 'rgb(0, 96, 120)',
                border: 'none',
                padding: '0.5rem 2rem',
              }}
            >
              {t('SAVE')}
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
