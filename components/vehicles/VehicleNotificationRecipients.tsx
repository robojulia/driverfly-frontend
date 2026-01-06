import React, { useState, useEffect } from 'react';
import { Card, Form, Button, InputGroup, FormControl, Badge, Spinner } from 'react-bootstrap';
import { PlusCircle, PersonCircle, Envelope, Telephone } from 'react-bootstrap-icons';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useTranslation } from '../../hooks/use-translation';
import { useUnsavedChangesWarning } from '../../hooks/use-unsaved-changes-warning';
import { useEffectAsync } from '../../utils/react';
import { EmployeeEntity } from '../../models/employee/employee.entity';
import VehiclePreferencesApi from '../../pages/api/vehicle-preferences';

interface VehicleNotificationRecipientsProps {
  vehicleId: number;
  assignedDriver?: EmployeeEntity | null;
  canEdit?: boolean;
}

export default function VehicleNotificationRecipients({
  vehicleId,
  assignedDriver,
  canEdit = true,
}: VehicleNotificationRecipientsProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [preferenceId, setPreferenceId] = useState<number | null>(null);
  const [newEmailRecipient, setNewEmailRecipient] = useState('');
  const [newPhoneRecipient, setNewPhoneRecipient] = useState('');

  const form = useFormik({
    initialValues: {
      notify_driver: false,
      driver_email: assignedDriver?.email || '',
      driver_phone: assignedDriver?.phone || '',
      third_party_emails: [] as string[],
      third_party_phones: [] as string[],
    },
    validationSchema: Yup.object({
      driver_email: Yup.string().email(t('Invalid email format')).nullable(),
      driver_phone: Yup.string().nullable(),
      third_party_emails: Yup.array().of(Yup.string().email(t('Invalid email format'))),
      third_party_phones: Yup.array().of(Yup.string()),
    }),
    onSubmit: async (values) => {
      try {
        const api = new VehiclePreferencesApi();
        const payload = {
          notification_recipients: {
            notify_driver: values.notify_driver,
            driver_email: values.notify_driver ? values.driver_email : null,
            driver_phone: values.notify_driver ? values.driver_phone : null,
            third_party_emails: values.third_party_emails,
            third_party_phones: values.third_party_phones,
          }
        };

        if (preferenceId) {
          await api.update(vehicleId, payload);
        } else {
          const created = await api.create(vehicleId, payload);
          setPreferenceId(created.id);
        }

        toast.success(t('Notification recipients saved successfully'));
        form.resetForm({ values }); // Reset dirty state
      } catch (error) {
        console.error('Error saving recipients:', error);
        toast.error(t('Error saving notification recipients'));
      }
    }
  });

  // Load existing preferences
  useEffectAsync(async () => {
    if (vehicleId) {
      setIsLoading(true);
      try {
        const api = new VehiclePreferencesApi();
        const data = await api.getByVehicleId(vehicleId);

        if (data?.notification_recipients) {
          setPreferenceId(data.id);
          const newValues = {
            notify_driver: data.notification_recipients.notify_driver ?? false,
            driver_email: data.notification_recipients.driver_email || assignedDriver?.email || '',
            driver_phone: data.notification_recipients.driver_phone || assignedDriver?.phone || '',
            third_party_emails: data.notification_recipients.third_party_emails || [],
            third_party_phones: data.notification_recipients.third_party_phones || [],
          };
          form.setValues(newValues);
          form.resetForm({ values: newValues }); // Set as clean state
        }
      } catch (error) {
        console.error('Error loading recipients:', error);
        // toast.error(t('Error loading notification recipients'));
      } finally {
        setIsLoading(false);
      }
    }
  }, [vehicleId]);

  // Update form when assigned driver changes
  useEffect(() => {
    if (assignedDriver) {
      if (!form.values.driver_email) {
        form.setFieldValue('driver_email', assignedDriver.email || '');
      }
      if (!form.values.driver_phone) {
        form.setFieldValue('driver_phone', assignedDriver.phone || '');
      }
    }
  }, [assignedDriver]);

  // Unsaved changes warning
  useUnsavedChangesWarning({
    isDirty: form.dirty,
    shouldWarn: !form.isSubmitting,
  });

  const handleAddEmailRecipient = () => {
    if (newEmailRecipient && !form.values.third_party_emails.includes(newEmailRecipient)) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmailRecipient)) {
        toast.error(t('Invalid email format'));
        return;
      }
      form.setFieldValue('third_party_emails', [...form.values.third_party_emails, newEmailRecipient]);
      setNewEmailRecipient('');
    }
  };

  const handleRemoveEmailRecipient = (email: string) => {
    form.setFieldValue('third_party_emails', form.values.third_party_emails.filter((e) => e !== email));
  };

  const handleAddPhoneRecipient = () => {
    if (newPhoneRecipient && !form.values.third_party_phones.includes(newPhoneRecipient)) {
      form.setFieldValue('third_party_phones', [...form.values.third_party_phones, newPhoneRecipient]);
      setNewPhoneRecipient('');
    }
  };

  const handleRemovePhoneRecipient = (phone: string) => {
    form.setFieldValue('third_party_phones', form.values.third_party_phones.filter((p) => p !== phone));
  };

  if (isLoading) {
    return (
      <Card className="mb-4">
        <Card.Body className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Card.Body>
      </Card>
    );
  }

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
            {t('Notification Recipients')}
          </h6>
          <p style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: 0 }}>
            {t('Configure who receives notifications for this vehicle\'s documentation reminders')}
          </p>
        </div>

        <Form onSubmit={form.handleSubmit}>
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
                  <h6 style={{ margin: 0, fontWeight: 600 }}>{t('Assigned Driver')}</h6>
                  {assignedDriver ? (
                    <p style={{ fontSize: '0.875rem', color: '#6c757d', margin: 0 }}>
                      {assignedDriver.first_name} {assignedDriver.last_name}
                    </p>
                  ) : (
                    <p style={{ fontSize: '0.875rem', color: '#dc3545', margin: 0 }}>
                      {t('No driver assigned')}
                    </p>
                  )}
                </div>
              </div>
              {assignedDriver && (
                <Form.Check
                  type="switch"
                  id="notify-driver-switch"
                  label={t('Notify Driver')}
                  checked={form.values.notify_driver}
                  onChange={(e) => form.setFieldValue('notify_driver', e.target.checked)}
                  disabled={!canEdit}
                  style={{ fontSize: '0.875rem' }}
                />
              )}
            </div>

            {assignedDriver && form.values.notify_driver && (
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #dee2e6' }}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {t('Driver Email')}
                  </Form.Label>
                  <InputGroup size="sm">
                    <InputGroup.Text>
                      <Envelope size={14} />
                    </InputGroup.Text>
                    <FormControl
                      type="email"
                      placeholder="driver@email.com"
                      value={form.values.driver_email}
                      onChange={(e) => form.setFieldValue('driver_email', e.target.value)}
                      disabled={!canEdit}
                      isInvalid={form.touched.driver_email && !!form.errors.driver_email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {form.errors.driver_email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-0">
                  <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {t('Driver Phone')}
                  </Form.Label>
                  <InputGroup size="sm">
                    <InputGroup.Text>
                      <Telephone size={14} />
                    </InputGroup.Text>
                    <FormControl
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={form.values.driver_phone}
                      onChange={(e) => form.setFieldValue('driver_phone', e.target.value)}
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
                {t('Assign a driver to this vehicle to enable driver notifications')}
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
              marginBottom: '1.5rem',
            }}
          >
            <h6 style={{ fontWeight: 600, marginBottom: '1rem' }}>{t('Third Party Email Recipients')}</h6>
            <p style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '1rem' }}>
              {t('Add additional email addresses to receive notifications')}
            </p>

            <InputGroup size="sm" className="mb-3">
              <FormControl
                placeholder={t('Enter email address')}
                value={newEmailRecipient}
                onChange={(e) => setNewEmailRecipient(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddEmailRecipient();
                  }
                }}
                disabled={!canEdit}
              />
              <Button
                variant="outline-secondary"
                onClick={handleAddEmailRecipient}
                disabled={!canEdit || !newEmailRecipient}
              >
                <PlusCircle size={16} />
              </Button>
            </InputGroup>

            {form.values.third_party_emails.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {form.values.third_party_emails.map((email, idx) => (
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
                    {email}
                    {canEdit && (
                      <span
                        onClick={() => handleRemoveEmailRecipient(email)}
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
                {t('No third party email recipients added yet')}
              </div>
            )}
          </div>

          {/* Third Party Phone Recipients Section */}
          <div
            style={{
              border: '1px solid #dee2e6',
              borderRadius: '0.375rem',
              padding: '1rem',
              backgroundColor: '#fff',
            }}
          >
            <h6 style={{ fontWeight: 600, marginBottom: '1rem' }}>{t('Third Party Phone Recipients')}</h6>
            <p style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '1rem' }}>
              {t('Add additional phone numbers to receive SMS notifications')}
            </p>

            <InputGroup size="sm" className="mb-3">
              <FormControl
                placeholder={t('Enter phone number')}
                value={newPhoneRecipient}
                onChange={(e) => setNewPhoneRecipient(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPhoneRecipient();
                  }
                }}
                disabled={!canEdit}
              />
              <Button
                variant="outline-secondary"
                onClick={handleAddPhoneRecipient}
                disabled={!canEdit || !newPhoneRecipient}
              >
                <PlusCircle size={16} />
              </Button>
            </InputGroup>

            {form.values.third_party_phones.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {form.values.third_party_phones.map((phone, idx) => (
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
                    {phone}
                    {canEdit && (
                      <span
                        onClick={() => handleRemovePhoneRecipient(phone)}
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
                {t('No third party phone recipients added yet')}
              </div>
            )}
          </div>

          {canEdit && (
            <div className="d-flex justify-content-end mt-4">
              <Button
                type="submit"
                disabled={!form.dirty || !form.isValid || form.isSubmitting}
                style={{
                  backgroundColor: 'rgb(0, 96, 120)',
                  border: 'none',
                  padding: '0.5rem 2rem',
                }}
              >
                {form.isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    {t('Saving...')}
                  </>
                ) : (
                  t('SAVE')
                )}
              </Button>
            </div>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}
