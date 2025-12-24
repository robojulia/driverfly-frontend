import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Badge, Alert, Spinner } from 'react-bootstrap';
import { BellFill, ClockFill, FileTextFill, Envelope, ChatDotsFill } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/use-translation';
import { DocumentReminderType } from '../../enums/vehicles/document-reminder-type.enum';
import { InspectionFrequency } from '../../enums/vehicles/inspection-frequency.enum';
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

// Simple fallback interface instead of missing VehiclePreferencesEntity
interface VehiclePreferenceSavePayload {
  notification_settings: {
    safety_inspection: {
      document_type: DocumentReminderType;
      frequency: InspectionFrequency;
      notify_driver_email: boolean;
      notify_driver_sms: boolean;
    };
    maintenance_report: {
      document_type: DocumentReminderType;
      frequency: InspectionFrequency;
      notify_driver_email: boolean;
      notify_driver_sms: boolean;
    };
  };
}

export default function VehicleNotificationSettings({ show, onHide, canEdit = true, onSave, onSaveSuccess }: VehicleNotificationSettingsProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    if (show) loadSettings();
  }, [show]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const api = new VehiclePreferencesApi();
      const data = await api.getGlobalSettings();

      if (data?.notification_settings) {
        setNotificationSettings([
          {
            id: 1,
            documentType: DocumentReminderType.SAFETY_INSPECTION,
            frequency: data.notification_settings.safety_inspection?.frequency ?? InspectionFrequency.QUARTER,
            notifyDriverEmail: data.notification_settings.safety_inspection?.notify_driver_email ?? true,
            notifyDriverSMS: data.notification_settings.safety_inspection?.notify_driver_sms ?? false,
          },
          {
            id: 2,
            documentType: DocumentReminderType.MAINTENANCE_REPORT,
            frequency: data.notification_settings.maintenance_report?.frequency ?? InspectionFrequency.MONTH,
            notifyDriverEmail: data.notification_settings.maintenance_report?.notify_driver_email ?? true,
            notifyDriverSMS: data.notification_settings.maintenance_report?.notify_driver_sms ?? false,
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSetting = (id: number, field: keyof NotificationSetting, value: any) => {
    setNotificationSettings(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const api = new VehiclePreferencesApi();

      const payload: VehiclePreferenceSavePayload = {
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

      await api.updateGlobalSettings(payload);

      onSave?.(notificationSettings);
      onSaveSuccess?.();
      onHide();
    } catch (error) {
      console.error('Error saving notification settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getDocumentTypeLabel = (type: DocumentReminderType) =>
    type === DocumentReminderType.SAFETY_INSPECTION
      ? 'Safety Inspection'
      : type === DocumentReminderType.MAINTENANCE_REPORT
      ? 'Maintenance Report'
      : 'Other';

  const getFrequencyLabel = (frequency: InspectionFrequency) =>
    frequency === InspectionFrequency.MONTH
      ? 'Monthly'
      : frequency === InspectionFrequency.QUARTER
      ? 'Quarterly'
      : 'Annually';

  const getDocumentTypeIcon = (type: DocumentReminderType) =>
    type === DocumentReminderType.SAFETY_INSPECTION ? (
      <BellFill size={16} className="me-2" style={{ color: '#1d4354' }} />
    ) : type === DocumentReminderType.MAINTENANCE_REPORT ? (
      <ClockFill size={16} className="me-2" style={{ color: '#198754' }} />
    ) : (
      <FileTextFill size={16} className="me-2" style={{ color: '#6c757d' }} />
    );

  const getDocumentTypeBadgeColor = (type: DocumentReminderType) =>
    type === DocumentReminderType.SAFETY_INSPECTION
      ? 'primary'
      : type === DocumentReminderType.MAINTENANCE_REPORT
      ? 'success'
      : 'secondary';

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      {/* trimmed for brevity, UI unchanged */}
    </Modal>
  );
}
