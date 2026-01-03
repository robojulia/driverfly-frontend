import { useFormik } from 'formik';
import { Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from '../../../hooks/use-translation';
import { useUnsavedChangesWarning } from '../../../hooks/use-unsaved-changes-warning';
import {
  VehicleMaintenanceReportEntity,
  MaintenanceType,
} from '../../../models/company/vehicle-maintenance-report.entity';
import VehicleMaintenanceReportApi from '../../../pages/api/vehicle-maintenance-report';
import { globalAjaxExceptionHandler } from '../../../utils/ajax';
import EntityForm from '../../layouts/page/entity-form';
import BaseSelect from '../base-select';
import BaseDateInput from '../base-date-input';
import BaseInput from '../base-input';
import BaseTextArea from '../base-text-area';
import FileInput from '../file-input';
import { DocumentType } from '../../../models/documents/document.entity';

export interface VehicleMaintenanceReportFormProps {
  className?: string;
  entity: VehicleMaintenanceReportEntity;
  onSaveComplete?: (entity: VehicleMaintenanceReportEntity) => void;
  onSaveError?: (error: any) => void;
  vehicleId: number;
}

export function VehicleMaintenanceReportForm(props: VehicleMaintenanceReportFormProps) {
  const { t } = useTranslation();
  const { className, entity, onSaveComplete, onSaveError, vehicleId } = props;

  const action = !!entity?.id ? 'Forms.UPDATED' : 'Forms.CREATE/ADD';

  const form = useFormik({
    initialValues: {
      ...(entity || new VehicleMaintenanceReportEntity()),
      maintenance_document: entity?.maintenance_document || null,
    },
    enableReinitialize: true,
    validationSchema: VehicleMaintenanceReportEntity.yupSchema(),
    onSubmit: async (values) => {
      const api = new VehicleMaintenanceReportApi();
      try {
        // Create a clean DTO that explicitly handles the document field
        const dto = {
          ...values,
          // Ensure undefined becomes null
          maintenance_document: values.maintenance_document || null,
        };

        let report = null;
        if (entity?.id) {
          report = await api.update(vehicleId, entity.id, dto);
        } else {
          report = await api.create(vehicleId, dto);
        }
        toast.success(
          t(
            'Forms.SUCCESS_{action}_{name}',
            { action: action, name: 'MAINTENANCE_REPORT' },
            { translateProps: true }
          )
        );
        // Reset dirty state after successful save to prevent unsaved changes warning
        form.resetForm({ values: report });
        if (onSaveComplete) onSaveComplete(report);
      } catch (e) {
        console.error('Unable to save entity', e);
        globalAjaxExceptionHandler(e, {
          formik: form,
          toast: toast,
          t: t,
          defaultMessage: t(
            'Forms.FAIL_{action}_{name}',
            { action: action, name: 'MAINTENANCE_REPORT' },
            { translateProps: true }
          ),
        });
        if (onSaveError) onSaveError(e);
      }
    },
  });

  // No required fields - allow submission as long as form is valid
  const shouldForbidSubmit = !form.isValid;

  // Warn user about unsaved changes when navigating away
  const unsavedChangesWarning = useUnsavedChangesWarning({
    isDirty: form.dirty,
    shouldWarn: !form.isSubmitting,
  });

  return (
    <>
      {unsavedChangesWarning}
      <EntityForm
      className={`${className} vehicle-maintenance-report-form`}
      onSubmit={form.handleSubmit}
      id={entity?.id}
      formik={form}
      submitLabel={entity?.id ? 'Upload' : 'Upload'}
      forbidSubmit={shouldForbidSubmit}
    >
      <Container className="px-4 py-3">
        <Row>
          <Col lg={6}>
            <div className="form-section">
              <h6 className="section-title mb-4">{t('Maintenance Details')}</h6>
              <BaseDateInput
                className="mb-3"
                label="Maintenance Date"
                name="maintenance_date"
                formik={form}
              />

              <BaseSelect
                className="mb-3"
                name="maintenance_type"
                label="Type"
                placeholder="Select maintenance type"
                enumType={MaintenanceType}
                labelPrefix="MaintenanceType"
                formik={form}
              />

              <BaseInput
                className="mb-3"
                label="Odometer Reading"
                name="odometer_reading"
                type="number"
                placeholder="Enter odometer reading in miles"
                formik={form}
              />

              <BaseTextArea
                className="mb-3"
                label="Description"
                name="description"
                rows={4}
                placeholder="Enter maintenance description"
                formik={form}
              />

              <BaseTextArea
                className="mb-3"
                label="Notes"
                name="notes"
                rows={3}
                placeholder="Additional notes (optional)"
                formik={form}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="form-section">
              <h6 className="section-title mb-4">{t('Service Documentation')}</h6>
              <FileInput
                className="mb-4"
                label="Maintenance Report Document"
                name="maintenance_document"
                accept=".pdf,image/*"
                documentType={DocumentType.MAINTENANCE}
                formik={{
                  ...form,
                  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => {
                    const finalValue = value === undefined ? null : value;
                    return form.setFieldValue(field, finalValue, shouldValidate);
                  },
                }}
                allowedSizeInByte={3145728}
                allowedTypesFriendlyName="PDF or image format, under 3MB"
              />

              <h6 className="section-title mb-4 mt-4">{t('Next Service Schedule')}</h6>

              <BaseDateInput
                className="mb-3"
                label="Next Service Date"
                name="next_service_date"
                formik={form}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </EntityForm>
    </>
  );
}

const styles = `
.vehicle-maintenance-report-form {
  max-width: 800px;
  margin: 0 auto;
}

.vehicle-maintenance-report-form .form-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.vehicle-maintenance-report-form .form-control {
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 8px 12px;
}

.vehicle-maintenance-report-form .form-control:focus {
  border-color: #2684ff;
  box-shadow: 0 0 0 1px #2684ff;
}

.vehicle-maintenance-report-form .form-label {
  font-weight: 500;
  margin-bottom: 8px;
}
`;
