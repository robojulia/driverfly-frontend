import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Badge, Alert, Spinner } from 'react-bootstrap';
import { PlusCircle, Trash, BellFill, ClockFill, FileTextFill, Envelope, ChatDotsFill } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/use-translation';
import { DocumentReminderType } from '../../enums/vehicles/document-reminder-type.enum';
import { InspectionFrequency } from '../../enums/vehicles/inspection-frequency.enum';
import { VehiclePreferencesEntity } from '../../models/company/vehicle-preferences.entity';
import VehiclePreferencesApi from '../../pages/api/vehicle-preferences';

interface NotificationSetting {
  id: number;
  documentType: DocumentReminderType;
  frequency: InspectionFrequency;
  notifyDriverEmail: boolean;
  notifyDriverSMS: boolean;
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
  onSaveSuccess,
}: VehicleNotificationSettingsProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fixed notification settings - cannot be added or removed
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 1,
      documentType: DocumentReminderType.SAFETY_INSPECTION,
      frequency: InspectionFrequency.QUARTER,
      notifyDriverEmail: true,
      notifyDriverSMS: false,
    },
    {
      id: 2,
      documentType: DocumentReminderType.MAINTENANCE_REPORT,
      frequency: InspectionFrequency.MONTH,
      notifyDriverEmail: true,
      notifyDriverSMS: false,
    },
  ]);

  // Load settings when modal opens
  useEffect(() => {
    if (show) {
      loadSettings();
    }
  }, [show]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const api = new VehiclePreferencesApi();
      const data = await api.getGlobalSettings();

      if (data?.notification_settings) {
        const settings: NotificationSetting[] = [
          {
            id: 1,
            documentType: DocumentReminderType.SAFETY_INSPECTION,
            frequency: data.notification_settings.safety_inspection?.frequency || InspectionFrequency.QUARTER,
            notifyDriverEmail: data.notification_settings.safety_inspection?.notify_driver_email ?? true,
            notifyDriverSMS: data.notification_settings.safety_inspection?.notify_driver_sms ?? false,
          },
          {
            id: 2,
            documentType: DocumentReminderType.MAINTENANCE_REPORT,
            frequency: data.notification_settings.maintenance_report?.frequency || InspectionFrequency.MONTH,
            notifyDriverEmail: data.notification_settings.maintenance_report?.notify_driver_email ?? true,
            notifyDriverSMS: data.notification_settings.maintenance_report?.notify_driver_sms ?? false,
          },
        ];
        setNotificationSettings(settings);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSetting = (id: number, field: keyof NotificationSetting, value: any) => {
    setNotificationSettings(
      notificationSettings.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const api = new VehiclePreferencesApi();

      // Convert notification settings to API format
      const entity: Partial<VehiclePreferencesEntity> = {
        notification_settings: {
          safety_inspection: {
            document_type: DocumentReminderType.SAFETY_INSPECTION,
            frequency: notificationSettings[0].frequency,
            notify_driver_email: notificationSettings[0].notifyDriverEmail,
            notify_driver_sms: notificationSettings[0].notifyDriverSMS,
          },
          maintenance_report: {
            document_type: DocumentReminderType.MAINTENANCE_REPORT,
            frequency: notificationSettings[1].frequency,
            notify_driver_email: notificationSettings[1].notifyDriverEmail,
            notify_driver_sms: notificationSettings[1].notifyDriverSMS,
          },
        },
      };

      await api.updateGlobalSettings(entity);

      if (onSave) {
        onSave(notificationSettings);
      }
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      onHide();
    } catch (error) {
      console.error('Error saving notification settings:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const getDocumentTypeLabel = (type: DocumentReminderType) => {
    switch (type) {
      case DocumentReminderType.SAFETY_INSPECTION:
        return 'Safety Inspection';
      case DocumentReminderType.MAINTENANCE_REPORT:
        return 'Maintenance Report';
      case DocumentReminderType.OTHER:
        return 'Other';
      default:
        return type;
    }
  };

  const getDocumentTypeIcon = (type: DocumentReminderType) => {
    switch (type) {
      case DocumentReminderType.SAFETY_INSPECTION:
        return <BellFill size={16} className="me-2" style={{ color: '#0d6efd' }} />;
      case DocumentReminderType.MAINTENANCE_REPORT:
        return <ClockFill size={16} className="me-2" style={{ color: '#198754' }} />;
      case DocumentReminderType.OTHER:
        return <FileTextFill size={16} className="me-2" style={{ color: '#6c757d' }} />;
      default:
        return null;
    }
  };

  const getFrequencyLabel = (frequency: InspectionFrequency) => {
    switch (frequency) {
      case InspectionFrequency.MONTH:
        return 'Monthly';
      case InspectionFrequency.QUARTER:
        return 'Quarterly';
      case InspectionFrequency.ANNUAL:
        return 'Annually';
      default:
        return frequency;
    }
  };

  const getDocumentTypeBadgeColor = (type: DocumentReminderType) => {
    switch (type) {
      case DocumentReminderType.SAFETY_INSPECTION:
        return 'primary';
      case DocumentReminderType.MAINTENANCE_REPORT:
        return 'success';
      case DocumentReminderType.OTHER:
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header
        closeButton
        closeVariant="white"
        style={{
          background: 'linear-gradient(135deg, rgb(0, 96, 120) 0%, rgb(29, 67, 84) 100%)',
          borderBottom: 'none',
          color: '#fff'
        }}
      >
        <Modal.Title>
          <div className="d-flex align-items-center">
            <BellFill size={24} className="me-3" />
            <div>
              <h5 style={{ fontWeight: 600, margin: 0 }}>
                Vehicle Notification Settings
              </h5>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.25rem', marginBottom: 0, color: '#fff' }}>
                Configure automated email reminders for vehicle documentation
              </p>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: '2rem', backgroundColor: '#f8f9fa' }}>
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" style={{ color: 'rgb(0, 96, 120)' }}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3 text-muted">Loading notification settings...</p>
          </div>
        ) : (
          <>
            <Alert variant="info" className="mb-4" style={{ borderLeft: '4px solid #0dcaf0' }}>
              <small>
                <strong>Note:</strong> All notifications will be sent via email to the recipients configured for each vehicle.
              </small>
            </Alert>

            <div className="mb-3">
              <h6 style={{ fontWeight: 600, margin: 0, color: '#495057' }}>
                Document Reminder Schedule
              </h6>
              <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '0.5rem', marginBottom: 0 }}>
                Configure how often reminders are sent and which contact methods to use
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notificationSettings.map((setting, index) => (
              <div
                key={setting.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '0.5rem',
                  padding: '1.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.2s ease',
                }}
                className="notification-setting-card"
              >
                <Row className="align-items-start g-3">
                  <Col md={3}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#6c757d',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Document Type
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      {getDocumentTypeIcon(setting.documentType)}
                      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>
                        {getDocumentTypeLabel(setting.documentType)}
                      </span>
                    </div>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-0">
                      <Form.Label
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#6c757d',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '0.5rem'
                        }}
                      >
                        Frequency
                      </Form.Label>
                      <Form.Select
                        value={setting.frequency}
                        onChange={(e) =>
                          handleUpdateSetting(
                            setting.id,
                            'frequency',
                            e.target.value as InspectionFrequency
                          )
                        }
                        disabled={!canEdit}
                        style={{
                          border: '1px solid #dee2e6',
                          borderRadius: '0.375rem',
                          fontSize: '0.95rem',
                          padding: '0.5rem 0.75rem',
                        }}
                      >
                        <option value={InspectionFrequency.MONTH}>Every Month</option>
                        <option value={InspectionFrequency.QUARTER}>Every Quarter</option>
                        <option value={InspectionFrequency.ANNUAL}>Every Year</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#6c757d',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Contact Driver Via
                      </span>
                    </div>
                    <div className="d-flex gap-3">
                      <Form.Check
                        type="checkbox"
                        id={`email-${setting.id}`}
                        label={
                          <span className="d-flex align-items-center gap-1">
                            <Envelope size={16} style={{ color: '#0d6efd' }} />
                            Email
                          </span>
                        }
                        checked={setting.notifyDriverEmail}
                        onChange={(e) =>
                          handleUpdateSetting(setting.id, 'notifyDriverEmail', e.target.checked)
                        }
                        disabled={!canEdit}
                        style={{ fontSize: '0.95rem' }}
                      />
                      <Form.Check
                        type="checkbox"
                        id={`sms-${setting.id}`}
                        label={
                          <span className="d-flex align-items-center gap-1">
                            <ChatDotsFill size={16} style={{ color: '#198754' }} />
                            SMS
                          </span>
                        }
                        checked={setting.notifyDriverSMS}
                        onChange={(e) =>
                          handleUpdateSetting(setting.id, 'notifyDriverSMS', e.target.checked)
                        }
                        disabled={!canEdit}
                        style={{ fontSize: '0.95rem' }}
                      />
                    </div>
                  </Col>
                </Row>

                <div style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e9ecef',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#495057',
                  flexWrap: 'wrap'
                }}>
                  <Badge
                    bg={getDocumentTypeBadgeColor(setting.documentType)}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.4rem 0.8rem',
                      fontWeight: 500,
                      borderRadius: '0.25rem',
                    }}
                  >
                    {getDocumentTypeLabel(setting.documentType)}
                  </Badge>
                  <span style={{ color: '#adb5bd' }}>•</span>
                  <span>
                    <ClockFill size={14} className="me-1" style={{ color: '#6c757d' }} />
                    {getFrequencyLabel(setting.frequency)}
                  </span>
                  <span style={{ color: '#adb5bd' }}>•</span>
                  <span className="d-flex align-items-center gap-1">
                    {setting.notifyDriverEmail && (
                      <Badge bg="primary" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}>
                        <Envelope size={12} className="me-1" />
                        Email
                      </Badge>
                    )}
                    {setting.notifyDriverSMS && (
                      <Badge bg="success" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}>
                        <ChatDotsFill size={12} className="me-1" />
                        SMS
                      </Badge>
                    )}
                    {!setting.notifyDriverEmail && !setting.notifyDriverSMS && (
                      <Badge bg="secondary" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}>
                        No Driver Contact
                      </Badge>
                    )}
                  </span>
                </div>
              </div>
              ))}
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: '#fff', borderTop: '1px solid #dee2e6', padding: '1rem 2rem' }}>
        <Button
          variant="light"
          onClick={onHide}
          style={{
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            border: '1px solid #dee2e6',
          }}
        >
          {t('CANCEL')}
        </Button>
        {canEdit && (
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            style={{
              backgroundColor: 'rgb(0, 96, 120)',
              border: 'none',
              padding: '0.5rem 2rem',
              borderRadius: '0.375rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {isSaving ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Saving...
              </>
            ) : (
              <>{t('SAVE')} Settings</>
            )}
          </Button>
        )}
      </Modal.Footer>

      <style>{`
        .notification-setting-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.12) !important;
        }
        .hover-danger:hover {
          background-color: #f8d7da !important;
          border-radius: 0.375rem;
        }
      `}</style>
    </Modal>
  );
}
