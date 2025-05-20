import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import { useTranslation } from '../../../hooks/use-translation';
import {
  VehicleInspectionEntity,
  InspectionStatus,
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
  }) => Promise<void>;
}

export const InspectionCompletionModal: React.FC<InspectionCompletionModalProps> = ({
  inspection,
  onClose,
  onComplete,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      status: '',
      notes: inspection?.notes || '',
      inspection_document: inspection?.inspection_document || null,
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await onComplete(values);
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

        <div className="completion-actions mb-4">
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
            <Form.Label>{t('Notes')}</Form.Label>
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
            label="Inspection Document"
            name="inspection_document"
            accept=".pdf,image/*"
            documentType={DocumentType.INSPECTION}
            formik={formik}
            allowedSizeInByte={3145728}
            allowedTypesFriendlyName="PDF or image format, under 3MB"
          />
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
          disabled={!formik.values.status || isSubmitting}
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
      `}</style>
    </Modal>
  );
};
