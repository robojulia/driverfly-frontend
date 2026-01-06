import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Badge, Alert, Spinner } from 'react-bootstrap';
import { BellFill, ClockFill, FileTextFill, Envelope, ChatDotsFill, Calendar3, Shield, Wrench } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useTranslation } from '../../hooks/use-translation';
import { DocumentReminderType } from '../../enums/vehicles/document-reminder-type.enum';
import { InspectionFrequency } from '../../enums/vehicles/inspection-frequency.enum';
import VehiclePreferencesApi from '../../pages/api/vehicle-preferences';

interface NotificationSetting {
  id: string;
  documentType: DocumentReminderType;
  frequency?: InspectionFrequency | null;
  notifyDriverEmail: boolean;
  notifyDriverSMS: boolean;
  reminderDaysBefore?: number | null;
  enabled: boolean;
}

interface VehicleNotificationSettingsProps {
  show: boolean;
  onHide: () => void;
  canEdit?: boolean;
  onSave?: (settings: NotificationSetting[]) => void;
  onSaveSuccess?: () => void;
}

export default function VehicleNotificationSettings({
  show,
  onHide,
  canEdit = true,
  onSave,
  onSaveSuccess
}: VehicleNotificationSettingsProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'safety_inspection',
      documentType: DocumentReminderType.SAFETY_INSPECTION,
      frequency: InspectionFrequency.QUARTER,
      notifyDriverEmail: true,
      notifyDriverSMS: false,
      reminderDaysBefore: null,
      enabled: true,
    },
    {
      id: 'maintenance_report',
      documentType: DocumentReminderType.MAINTENANCE_REPORT,
      frequency: InspectionFrequency.MONTH,
      notifyDriverEmail: true,
      notifyDriverSMS: false,
      reminderDaysBefore: null,
      enabled: true,
    },
    {
      id: 'registration_expiration',
      documentType: DocumentReminderType.REGISTRATION_EXPIRATION,
      frequency: null,
      notifyDriverEmail: true,
      notifyDriverSMS: false,
      reminderDaysBefore: 30,
      enabled: true,
    },
    {
      id: 'insurance_expiration',
      documentType: DocumentReminderType.INSURANCE_EXPIRATION,
      frequency: null,
      notifyDriverEmail: true,
      notifyDriverSMS: false,
      reminderDaysBefore: 30,
      enabled: true,
    },
    {
      id: 'repair_updates',
      documentType: DocumentReminderType.REPAIR_UPDATES,
      frequency: null,
      notifyDriverEmail: true,
      notifyDriverSMS: false,
      reminderDaysBefore: null,
      enabled: true,
    },
  ]);

  useEffect(() => {
    if (show) loadSettings();
  }, [show]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const api = new VehiclePreferencesApi();
      const data = await api.getGlobalSettings();

      // If backend returns data, use it to populate settings
      if (data?.notification_settings) {
        const updatedSettings: NotificationSetting[] = [
          {
            id: 'safety_inspection',
            documentType: DocumentReminderType.SAFETY_INSPECTION,
            frequency: data.notification_settings.safety_inspection?.frequency ?? InspectionFrequency.QUARTER,
            notifyDriverEmail: data.notification_settings.safety_inspection?.notify_driver_email ?? true,
            notifyDriverSMS: data.notification_settings.safety_inspection?.notify_driver_sms ?? false,
            reminderDaysBefore: data.notification_settings.safety_inspection?.reminder_days_before ?? null,
            enabled: data.notification_settings.safety_inspection?.enabled ?? true,
          },
          {
            id: 'maintenance_report',
            documentType: DocumentReminderType.MAINTENANCE_REPORT,
            frequency: data.notification_settings.maintenance_report?.frequency ?? InspectionFrequency.MONTH,
            notifyDriverEmail: data.notification_settings.maintenance_report?.notify_driver_email ?? true,
            notifyDriverSMS: data.notification_settings.maintenance_report?.notify_driver_sms ?? false,
            reminderDaysBefore: data.notification_settings.maintenance_report?.reminder_days_before ?? null,
            enabled: data.notification_settings.maintenance_report?.enabled ?? true,
          },
          {
            id: 'registration_expiration',
            documentType: DocumentReminderType.REGISTRATION_EXPIRATION,
            frequency: null,
            notifyDriverEmail: data.notification_settings.registration_expiration?.notify_driver_email ?? true,
            notifyDriverSMS: data.notification_settings.registration_expiration?.notify_driver_sms ?? false,
            reminderDaysBefore: data.notification_settings.registration_expiration?.reminder_days_before ?? 30,
            enabled: data.notification_settings.registration_expiration?.enabled ?? true,
          },
          {
            id: 'insurance_expiration',
            documentType: DocumentReminderType.INSURANCE_EXPIRATION,
            frequency: null,
            notifyDriverEmail: data.notification_settings.insurance_expiration?.notify_driver_email ?? true,
            notifyDriverSMS: data.notification_settings.insurance_expiration?.notify_driver_sms ?? false,
            reminderDaysBefore: data.notification_settings.insurance_expiration?.reminder_days_before ?? 30,
            enabled: data.notification_settings.insurance_expiration?.enabled ?? true,
          },
          {
            id: 'repair_updates',
            documentType: DocumentReminderType.REPAIR_UPDATES,
            frequency: null,
            notifyDriverEmail: data.notification_settings.repair_updates?.notify_driver_email ?? true,
            notifyDriverSMS: data.notification_settings.repair_updates?.notify_driver_sms ?? false,
            reminderDaysBefore: null,
            enabled: data.notification_settings.repair_updates?.enabled ?? true,
          },
        ];
        setNotificationSettings(updatedSettings);
      }
      // If backend returns null (404), just use default values already in state - no error needed
    } catch (error) {
      console.warn('Backend notification settings endpoint not ready yet, using default values:', error);
      // Don't show error toast - backend might not be implemented yet
      // The component will just use the default values from initial state
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSetting = (id: string, field: keyof NotificationSetting, value: any) => {
    setNotificationSettings(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const api = new VehiclePreferencesApi();

      const payload: any = {
        notification_settings: {}
      };

      notificationSettings.forEach(setting => {
        payload.notification_settings[setting.id] = {
          document_type: setting.documentType,
          frequency: setting.frequency,
          notify_driver_email: setting.notifyDriverEmail,
          notify_driver_sms: setting.notifyDriverSMS,
          reminder_days_before: setting.reminderDaysBefore,
          enabled: setting.enabled,
        };
      });

      await api.updateGlobalSettings(payload);

      toast.success(t('Notification settings saved successfully'));
      onSave?.(notificationSettings);
      onSaveSuccess?.();
      onHide();
    } catch (error) {
      console.error('Error saving notification settings:', error);
      if (error.response?.status === 404 || error.response?.status === 501) {
        toast.warning(t('Backend API not implemented yet. Please coordinate with backend team to add the /vehicles/global-notification-settings endpoint.'));
      } else {
        toast.error(t('Error saving notification settings'));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getDocumentTypeLabel = (type: DocumentReminderType) => {
    switch (type) {
      case DocumentReminderType.SAFETY_INSPECTION:
        return t('Safety Inspection');
      case DocumentReminderType.MAINTENANCE_REPORT:
        return t('Maintenance Report');
      case DocumentReminderType.REGISTRATION_EXPIRATION:
        return t('Registration Expiration');
      case DocumentReminderType.INSURANCE_EXPIRATION:
        return t('Insurance Expiration');
      case DocumentReminderType.REPAIR_UPDATES:
        return t('Repair & Service Updates');
      default:
        return t('Other');
    }
  };

  const getFrequencyLabel = (frequency: InspectionFrequency) => {
    switch (frequency) {
      case InspectionFrequency.MONTH:
        return t('Monthly');
      case InspectionFrequency.QUARTER:
        return t('Quarterly');
      case InspectionFrequency.ANNUAL:
        return t('Annually');
      default:
        return '';
    }
  };

  const getDocumentTypeIcon = (type: DocumentReminderType) => {
    switch (type) {
      case DocumentReminderType.SAFETY_INSPECTION:
        return <BellFill size={16} className="me-2" style={{ color: '#1d4354' }} />;
      case DocumentReminderType.MAINTENANCE_REPORT:
        return <ClockFill size={16} className="me-2" style={{ color: '#198754' }} />;
      case DocumentReminderType.REGISTRATION_EXPIRATION:
        return <Calendar3 size={16} className="me-2" style={{ color: '#fd7e14' }} />;
      case DocumentReminderType.INSURANCE_EXPIRATION:
        return <Shield size={16} className="me-2" style={{ color: '#0dcaf0' }} />;
      case DocumentReminderType.REPAIR_UPDATES:
        return <Wrench size={16} className="me-2" style={{ color: '#dc3545' }} />;
      default:
        return <FileTextFill size={16} className="me-2" style={{ color: '#6c757d' }} />;
    }
  };

  const getDocumentTypeBadgeColor = (type: DocumentReminderType) => {
    switch (type) {
      case DocumentReminderType.SAFETY_INSPECTION:
        return 'primary';
      case DocumentReminderType.MAINTENANCE_REPORT:
        return 'success';
      case DocumentReminderType.REGISTRATION_EXPIRATION:
        return 'warning';
      case DocumentReminderType.INSURANCE_EXPIRATION:
        return 'info';
      case DocumentReminderType.REPAIR_UPDATES:
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const scheduledNotifications = notificationSettings.filter(s =>
    s.documentType === DocumentReminderType.SAFETY_INSPECTION ||
    s.documentType === DocumentReminderType.MAINTENANCE_REPORT
  );

  const expirationNotifications = notificationSettings.filter(s =>
    s.documentType === DocumentReminderType.REGISTRATION_EXPIRATION ||
    s.documentType === DocumentReminderType.INSURANCE_EXPIRATION
  );

  const repairNotifications = notificationSettings.filter(s =>
    s.documentType === DocumentReminderType.REPAIR_UPDATES
  );

  const renderNotificationSetting = (setting: NotificationSetting) => (
    <div
      key={setting.id}
      style={{
        border: '1px solid #dee2e6',
        borderRadius: '0.5rem',
        padding: '1.25rem',
        marginBottom: '1rem',
        backgroundColor: setting.enabled ? '#fff' : '#f8f9fa',
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          {getDocumentTypeIcon(setting.documentType)}
          <div>
            <h6 style={{ margin: 0, fontWeight: 600 }}>{getDocumentTypeLabel(setting.documentType)}</h6>
            <Badge bg={getDocumentTypeBadgeColor(setting.documentType)} className="mt-1">
              {setting.documentType}
            </Badge>
          </div>
        </div>
        <Form.Check
          type="switch"
          id={`${setting.id}-enabled`}
          label={t('Enabled')}
          checked={setting.enabled}
          onChange={(e) => handleUpdateSetting(setting.id, 'enabled', e.target.checked)}
          disabled={!canEdit}
          style={{ fontSize: '0.9rem' }}
        />
      </div>

      {setting.enabled && (
        <>
          {/* Frequency selector for recurring notifications */}
          {setting.frequency !== null && (
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {t('Notification Frequency')}
              </Form.Label>
              <Form.Select
                size="sm"
                value={setting.frequency}
                onChange={(e) => handleUpdateSetting(setting.id, 'frequency', e.target.value as InspectionFrequency)}
                disabled={!canEdit}
              >
                <option value={InspectionFrequency.MONTH}>{getFrequencyLabel(InspectionFrequency.MONTH)}</option>
                <option value={InspectionFrequency.QUARTER}>{getFrequencyLabel(InspectionFrequency.QUARTER)}</option>
                <option value={InspectionFrequency.ANNUAL}>{getFrequencyLabel(InspectionFrequency.ANNUAL)}</option>
              </Form.Select>
            </Form.Group>
          )}

          {/* Reminder days for expiration-based notifications */}
          {setting.reminderDaysBefore !== null && (
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {t('Reminder Days Before Expiration')}
              </Form.Label>
              <Form.Control
                type="number"
                size="sm"
                min="1"
                max="365"
                value={setting.reminderDaysBefore}
                onChange={(e) => handleUpdateSetting(setting.id, 'reminderDaysBefore', parseInt(e.target.value))}
                disabled={!canEdit}
                placeholder={t('Days')}
              />
              <Form.Text className="text-muted">
                {t(`Notify ${setting.reminderDaysBefore || 0} days before expiration`)}
              </Form.Text>
            </Form.Group>
          )}

          <Row>
            <Col md={6}>
              <Form.Check
                type="checkbox"
                id={`${setting.id}-email`}
                label={
                  <span className="d-flex align-items-center">
                    <Envelope size={14} className="me-2" />
                    {t('Notify via Email')}
                  </span>
                }
                checked={setting.notifyDriverEmail}
                onChange={(e) => handleUpdateSetting(setting.id, 'notifyDriverEmail', e.target.checked)}
                disabled={!canEdit}
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="checkbox"
                id={`${setting.id}-sms`}
                label={
                  <span className="d-flex align-items-center">
                    <ChatDotsFill size={14} className="me-2" />
                    {t('Notify via SMS')}
                  </span>
                }
                checked={setting.notifyDriverSMS}
                onChange={(e) => handleUpdateSetting(setting.id, 'notifyDriverSMS', e.target.checked)}
                disabled={!canEdit}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton style={{ backgroundColor: 'rgb(0, 96, 120)', color: 'white' }}>
        <Modal.Title>
          <BellFill size={24} className="me-2" />
          {t('Vehicle Notification Settings')}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">{t('Loading settings...')}</p>
          </div>
        ) : (
          <>
            <Alert variant="info" className="mb-4">
              <Alert.Heading style={{ fontSize: '1rem' }}>
                {t('Company-Wide Settings')}
              </Alert.Heading>
              <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>
                {t('These settings apply to all vehicles by default. Individual vehicles can override these settings.')}
              </p>
            </Alert>

            {/* Scheduled Inspections & Maintenance */}
            <div className="mb-4">
              <h6 style={{ fontWeight: 600, borderBottom: '2px solid rgb(0, 96, 120)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                {t('Scheduled Inspections & Maintenance')}
              </h6>
              {scheduledNotifications.map(setting => renderNotificationSetting(setting))}
            </div>

            {/* Document Expirations */}
            <div className="mb-4">
              <h6 style={{ fontWeight: 600, borderBottom: '2px solid #fd7e14', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                {t('Document Expirations')}
              </h6>
              {expirationNotifications.map(setting => renderNotificationSetting(setting))}
            </div>

            {/* Service & Repair Updates */}
            <div className="mb-4">
              <h6 style={{ fontWeight: 600, borderBottom: '2px solid #dc3545', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                {t('Service & Repair Updates')}
              </h6>
              {repairNotifications.map(setting => renderNotificationSetting(setting))}
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSaving}>
          {t('Cancel')}
        </Button>
        <Button
          style={{ backgroundColor: 'rgb(0, 96, 120)', border: 'none' }}
          onClick={handleSave}
          disabled={!canEdit || isSaving}
        >
          {isSaving ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              {t('Saving...')}
            </>
          ) : (
            t('Save Settings')
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
