import { useFormik } from 'formik';
import { Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from '../../../hooks/use-translation';
import {
  VehicleInspectionEntity,
  InspectionType,
  InspectionStatus,
} from '../../../models/company/vehicle-inspection.entity';
import VehicleInspectionApi from '../../../pages/api/vehicle-inspection';
import { globalAjaxExceptionHandler } from '../../../utils/ajax';
import EntityForm from '../../layouts/page/entity-form';
import BaseSelect from '../base-select';
import BaseDateInput from '../base-date-input';
import BaseTextArea from '../base-text-area';
import FileInput from '../file-input';
import { DocumentType } from '../../../models/documents/document.entity';

export interface VehicleInspectionFormProps {
  className?: string;
  entity: VehicleInspectionEntity;
  onSaveComplete?: (entity: VehicleInspectionEntity) => void;
  onSaveError?: (error: any) => void;
  vehicleId: number;
}

export function VehicleInspectionForm(props: VehicleInspectionFormProps) {
  const { t } = useTranslation();
  const { className, entity, onSaveComplete, onSaveError, vehicleId } = props;

  const action = !!entity?.id ? 'Forms.UPDATED' : 'Forms.CREATE/ADD';

  const form = useFormik({
    initialValues: entity || new VehicleInspectionEntity(),
    enableReinitialize: true,
    validationSchema: VehicleInspectionEntity.yupSchema(),
    onSubmit: async (dto) => {
      const api = new VehicleInspectionApi();
      try {
        let inspection = null;
        if (entity?.id) {
          inspection = await api.update(vehicleId, entity.id, dto);
        } else {
          inspection = await api.create(vehicleId, dto);
        }
        toast.success(
          t(
            'Forms.SUCCESS_{action}_{name}',
            { action: action, name: 'INSPECTION' },
            { translateProps: true }
          )
        );
        if (onSaveComplete) onSaveComplete(inspection);
      } catch (e) {
        console.error('Unable to save entity', e);
        globalAjaxExceptionHandler(e, {
          formik: form,
          toast: toast,
          t: t,
          defaultMessage: t(
            'Forms.FAIL_{action}_{name}',
            { action: action, name: 'INSPECTION' },
            { translateProps: true }
          ),
        });
        if (onSaveError) onSaveError(e);
      }
    },
  });

  // Check if required fields are filled
  const shouldForbidSubmit = !form.values.inspection_type || !form.values.status || !form.isValid;

  return (
    <EntityForm
      className={`${className} vehicle-inspection-form`}
      onSubmit={form.handleSubmit}
      id={entity?.id}
      formik={form}
      submitLabel={entity?.id ? 'Forms.UPDATE_INSPECTION' : 'Forms.CREATE_INSPECTION'}
      forbidSubmit={shouldForbidSubmit}
    >
      <Container className="px-4 py-3">
        <Row>
          <Col lg={6}>
            <div className="form-section">
              <h6 className="section-title mb-4">{t('Inspection Details')}</h6>
              <BaseSelect
                className="mb-3"
                name="inspection_type"
                label="Type"
                placeholder="Select inspection type"
                required
                enumType={InspectionType}
                labelPrefix="InspectionType"
                formik={form}
              />

              <BaseSelect
                className="mb-3"
                name="status"
                label="Status"
                placeholder="Select status"
                required
                enumType={InspectionStatus}
                labelPrefix="InspectionStatus"
                formik={form}
              />

              <BaseDateInput
                className="mb-3"
                label="Inspection Date"
                name="inspection_date"
                formik={form}
                helpText="The date when the actual inspection was performed"
              />

              <BaseDateInput
                className="mb-3"
                label="Due Date"
                name="due_date"
                formik={form}
                helpText="The date when the inspection is/was due to be completed"
              />

              <BaseTextArea
                className="mb-3"
                label="Notes"
                name="notes"
                rows={4}
                placeholder="Enter inspection notes"
                formik={form}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="form-section">
              <h6 className="section-title mb-4">{t('Inspection Documentation')}</h6>
              <FileInput
                className="mb-4"
                label="Inspection Document"
                name="inspection_document"
                accept=".pdf,image/*"
                documentType={DocumentType.INSPECTION}
                formik={form}
                allowedSizeInByte={3145728}
                allowedTypesFriendlyName="PDF or image format, under 3MB"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </EntityForm>
  );
}

const styles = `
.vehicle-inspection-form {
  max-width: 800px;
  margin: 0 auto;
}

.vehicle-inspection-form .form-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.vehicle-inspection-form .form-control {
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 8px 12px;
}

.vehicle-inspection-form .form-control:focus {
  border-color: #2684ff;
  box-shadow: 0 0 0 1px #2684ff;
}

.vehicle-inspection-form .form-label {
  font-weight: 500;
  margin-bottom: 8px;
}
`;
