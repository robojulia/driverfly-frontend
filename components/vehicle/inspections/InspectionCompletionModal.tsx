import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import { useTranslation } from '../../../hooks/use-translation';
import {
  VehicleInspectionEntity,
  InspectionStatus,
  InspectionType,
} from '../../../models/company/vehicle-inspection.entity';
import { DocumentType } from '../../../models/documents/document.entity';
import FileInput from '../../forms/file-input';
import { useFormik } from 'formik';
import classNames from 'classnames';
import styles from '../../../styles/inspections.module.css';

interface InspectionCompletionModalProps {
  inspection: VehicleInspectionEntity | null;
  onClose: () => void;
  onComplete: (values: {
    status: string;
    notes: string;
    inspection_document: any;
    inspection_date: Date;
    follow_up_inspection?: {
      inspection_type: string;
      due_date: Date;
      notes: string;
    };
  }) => Promise<void>;
}

export const InspectionCompletionModal: React.FC<InspectionCompletionModalProps> = ({
  inspection,
  onClose,
  onComplete,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleFollowup, setScheduleFollowup] = useState(false);

  const getDefaultInspectionDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const getFollowupNote = (inspectionDate: Date) => {
    return `Followup inspection from ${
      inspection?.inspection_type
    } performed on ${inspectionDate.toLocaleDateString()}`;
  };

  const formik = useFormik({
    initialValues: {
      status: '',
      notes: inspection?.notes || '',
      inspection_document: inspection?.inspection_document || null,
      inspection_date: getDefaultInspectionDate(),
      schedule_followup: false,
      followup_due_date: new Date(getDefaultInspectionDate().getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      followup_notes: getFollowupNote(getDefaultInspectionDate()),
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);

      const followupInspection = {
        inspection_type: inspection?.inspection_type || InspectionType.SAFETY,
        due_date: values.followup_due_date,
        notes: values.followup_notes,
      };

      try {
        const submitData = {
          status: values.status,
          notes: values.notes,
          inspection_document: values.inspection_document,
          inspection_date: values.inspection_date,
        };
        if (values.status === 'Failed' && values.schedule_followup) {
          const updatedSubmitData = {
            ...submitData,
            follow_up_inspection: followupInspection,
          };
          await onComplete(updatedSubmitData);
        } else {
          await onComplete(submitData);
        }
        onClose();
      } catch (error) {
        console.error('Error completing inspection:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  const handleStatusChange = (status: string) => {
    formik.setFieldValue('status', status);
    if (status !== 'Failed') {
      setScheduleFollowup(false);
      formik.setFieldValue('schedule_followup', false);
    }
  };

  const handleInspectionDateChange = (date: Date) => {
    formik.setFieldValue('inspection_date', date);
    if (formik.values.followup_notes === getFollowupNote(formik.values.inspection_date)) {
      formik.setFieldValue('followup_notes', getFollowupNote(date));
    }
  };

  const setFollowupDueDate = (weeks: number = 1, months: number = 0) => {
    const inspectionDate = formik.values.inspection_date;
    const dueDate = new Date(inspectionDate);
    dueDate.setDate(dueDate.getDate() + weeks * 7 + months * 30);
    formik.setFieldValue('followup_due_date', dueDate);
  };

  const getInspectionTypeChipClass = (type: string) => {
    return classNames(styles.inspectionChip, styles.typeChip, {
      [styles.safety]: type === 'Safety',
      [styles.maintenance]: type === 'Maintenance',
      [styles.roadside]: type === 'Roadside',
    });
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <Modal
      show={!!inspection}
      onHide={() => {
        onClose();
        formik.resetForm();
      }}
      centered
      className="completion-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('Complete Inspection')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="inspection-summary mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className={getInspectionTypeChipClass(inspection?.inspection_type || '')}>
              {inspection && t(`InspectionType.${inspection.inspection_type}`)}
            </span>
            {inspection?.due_date && (
              <span className="text-muted">
                {t('Due')}: {formatDate(inspection.due_date)}
              </span>
            )}
          </div>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>{t('Inspection Date')} ({t('Optional')})</Form.Label>
          <Form.Control
            type="date"
            value={formik.values.inspection_date.toISOString().split('T')[0]}
            onChange={(e) => handleInspectionDateChange(new Date(e.target.value))}
            disabled={isSubmitting}
          />
        </Form.Group>

        <div className="completion-actions mb-4">
          <Form.Label className="mb-2">{t('Status')} ({t('Optional')})</Form.Label>
          <div className="d-flex gap-3 mb-4">
            <Button
              variant={formik.values.status === 'Passed' ? 'success' : 'outline-success'}
              className="flex-grow-1 py-3 position-relative"
              onClick={() => handleStatusChange('Passed')}
              disabled={isSubmitting}
            >
              <div className="d-flex flex-column align-items-center">
                <CheckCircleFill size={24} className="mb-2" />
                <span>{t('Pass')}</span>
              </div>
              {formik.values.status === 'Passed' && (
                <div className="position-absolute top-0 end-0 p-2">
                  <CheckCircleFill size={16} />
                </div>
              )}
            </Button>
            <Button
              variant={formik.values.status === 'Failed' ? 'danger' : 'outline-danger'}
              className="flex-grow-1 py-3 position-relative"
              onClick={() => handleStatusChange('Failed')}
              disabled={isSubmitting}
            >
              <div className="d-flex flex-column align-items-center">
                <XCircleFill size={24} className="mb-2" />
                <span>{t('Fail')}</span>
              </div>
              {formik.values.status === 'Failed' && (
                <div className="position-absolute top-0 end-0 p-2">
                  <CheckCircleFill size={16} />
                </div>
              )}
            </Button>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>{t('Notes')} ({t('Optional')})</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...formik.getFieldProps('notes')}
              placeholder={t('Add inspection notes...')}
              disabled={isSubmitting}
            />
          </Form.Group>

          <FileInput
            className="mb-3"
            label="Inspection Document (Optional)"
            name="inspection_document"
            accept=".pdf,image/*"
            documentType={DocumentType.INSPECTION}
            formik={formik}
            allowedSizeInByte={3145728}
            allowedTypesFriendlyName="PDF or image format, under 3MB"
            required={false}
          />

          {formik.values.status === 'Failed' && (
            <div className="followup-section border-top pt-4 mt-4">
              <Form.Check
                type="checkbox"
                id="schedule-followup"
                label={t('Schedule followup inspection')}
                checked={scheduleFollowup}
                onChange={(e) => {
                  setScheduleFollowup(e.target.checked);
                  formik.setFieldValue('schedule_followup', e.target.checked);
                }}
                className="mb-3"
              />

              {scheduleFollowup && (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>{t('Next Due Date')}</Form.Label>
                    <Form.Control
                      type="date"
                      value={formik.values.followup_due_date.toISOString().split('T')[0]}
                      onChange={(e) =>
                        formik.setFieldValue('followup_due_date', new Date(e.target.value))
                      }
                      disabled={isSubmitting}
                    />
                  </Form.Group>

                  <div className="d-flex gap-2 mb-3">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setFollowupDueDate(1, 0)}
                    >
                      {t('in 1 week')}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setFollowupDueDate(0, 1)}
                    >
                      {t('in 1 month')}
                    </Button>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>{t('Followup Notes')}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      {...formik.getFieldProps('followup_notes')}
                      placeholder={t('Add followup inspection notes...')}
                      disabled={isSubmitting}
                    />
                  </Form.Group>
                </>
              )}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            onClose();
            formik.resetForm();
          }}
          disabled={isSubmitting}
        >
          {t('Cancel')}
        </Button>
        <Button
          variant="primary"
          onClick={() => formik.handleSubmit()}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="d-flex align-items-center gap-2">
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              {t('Completing...')}
            </div>
          ) : (
            t('Complete Inspection')
          )}
        </Button>
      </Modal.Footer>

      <style>{`
        .completion-modal .modal-content {
          border-radius: 12px;
        }

        .completion-actions .btn {
          border-width: 2px;
          transition: all 0.2s ease;
        }

        .completion-actions .btn:hover {
          transform: translateY(-2px);
        }

        .inspection-summary {
          padding: 16px;
          background-color: #f8f9fa;
          border-radius: 8px;
        }

        .completion-status-button {
          min-height: 80px;
        }

        .completion-status-button.selected {
          box-shadow: 0 0 0 2px var(--bs-primary);
        }

        .followup-section {
          background-color: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
        }
      `}</style>
    </Modal>
  );
};
