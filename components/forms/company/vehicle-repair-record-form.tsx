import { useFormik } from 'formik';
import { Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import InputMask from 'react-input-mask';
import { NumericFormat } from 'react-number-format';
import { useTranslation } from '../../../hooks/use-translation';
import {
  VehicleRepairRecordEntity,
  RepairType,
} from '../../../models/company/vehicle-repair-record.entity';
import VehicleRepairRecordApi from '../../../pages/api/vehicle-repair-record';
import { globalAjaxExceptionHandler } from '../../../utils/ajax';
import EntityForm from '../../layouts/page/entity-form';
import BaseSelect from '../base-select';
import BaseDateInput from '../base-date-input';
import BaseInput from '../base-input';
import BaseTextArea from '../base-text-area';
import FileInput from '../file-input';
import { DocumentType } from '../../../models/documents/document.entity';

export interface VehicleRepairRecordFormProps {
  className?: string;
  entity: VehicleRepairRecordEntity;
  onSaveComplete?: (entity: VehicleRepairRecordEntity) => void;
  onSaveError?: (error: any) => void;
  vehicleId: number;
}

export function VehicleRepairRecordForm(props: VehicleRepairRecordFormProps) {
  const { t } = useTranslation();
  const { className, entity, onSaveComplete, onSaveError, vehicleId } = props;

  const action = !!entity?.id ? 'Forms.UPDATED' : 'Forms.CREATE/ADD';

  const formatAmount = (value: number | null): string => {
    if (!value && value !== 0) return '';
    return value.toString();
  };

  const parseAmount = (value: string): number => {
    // Remove dollar sign and any non-numeric characters except decimal
    const cleaned = value.replace(/[^\d.]/g, '');
    // Parse as float, default to 0 if invalid
    return cleaned ? parseFloat(cleaned) : 0;
  };

  const form = useFormik({
    initialValues: {
      ...(entity || new VehicleRepairRecordEntity()),
      repair_receipt_document: entity?.repair_receipt_document || null,
    },
    enableReinitialize: true,
    validationSchema: VehicleRepairRecordEntity.yupSchema(),
    onSubmit: async (values) => {
      const api = new VehicleRepairRecordApi();
      try {
        // Create a clean DTO with all fields, including the document
        const dto = {
          repair_date: values.repair_date,
          repair_type: values.repair_type,
          amount: values.amount,
          description: values.description,
          repair_receipt_document: values.repair_receipt_document,
        };

        let repair = null;
        if (entity?.id) {
          repair = await api.update(vehicleId, entity.id, dto);
        } else {
          repair = await api.create(vehicleId, dto);
        }
        toast.success(
          t(
            'Forms.SUCCESS_{action}_{name}',
            { action: action, name: 'REPAIR_RECORD' },
            { translateProps: true }
          )
        );
        if (onSaveComplete) onSaveComplete(repair);
      } catch (e) {
        console.error('Unable to save entity', e);
        globalAjaxExceptionHandler(e, {
          formik: form,
          toast: toast,
          t: t,
          defaultMessage: t(
            'Forms.FAIL_{action}_{name}',
            { action: action, name: 'REPAIR_RECORD' },
            { translateProps: true }
          ),
        });
        if (onSaveError) onSaveError(e);
      }
    },
  });

  // Check if required fields are filled
  const shouldForbidSubmit =
    !form.values.repair_date ||
    !form.values.repair_type ||
    !form.values.amount ||
    !form.values.description ||
    !form.isValid;

  return (
    <EntityForm
      className={`${className} vehicle-repair-record-form`}
      onSubmit={form.handleSubmit}
      id={entity?.id}
      formik={form}
      submitLabel={entity?.id ? 'Forms.UPDATE_REPAIR_RECORD' : 'Forms.CREATE_REPAIR_RECORD'}
      forbidSubmit={shouldForbidSubmit}
    >
      <Container className="px-4 py-3">
        <Row>
          <Col lg={6}>
            <div className="form-section">
              <h6 className="section-title mb-4">{t('Repair Details')}</h6>
              <BaseDateInput
                className="mb-3"
                label="Repair Date"
                name="repair_date"
                required
                formik={form}
              />

              <BaseSelect
                className="mb-3"
                name="repair_type"
                label="Type"
                placeholder="Select repair type"
                required
                enumType={RepairType}
                labelPrefix="RepairType"
                formik={form}
              />

              <div className="mb-3">
                <label className="form-label" htmlFor="amount">
                  {t('Amount')} <span className="text-danger">*</span>
                </label>
                <NumericFormat
                  id="amount"
                  name="amount"
                  value={form.values.amount}
                  onValueChange={(values) => {
                    form.setFieldValue('amount', values.floatValue || 0);
                  }}
                  thousandSeparator={true}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  prefix="$"
                  placeholder="$0.00"
                  allowNegative={false}
                  className={`form-control ${
                    form.touched.amount && form.errors.amount ? 'is-invalid' : ''
                  }`}
                  onBlur={form.handleBlur}
                />
                {form.touched.amount && form.errors.amount && (
                  <div className="invalid-feedback">{form.errors.amount}</div>
                )}
              </div>

              <BaseTextArea
                className="mb-3"
                label="Description"
                name="description"
                rows={4}
                required
                placeholder="Enter repair description"
                formik={form}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="form-section">
              <h6 className="section-title mb-4">{t('Receipt Documentation')}</h6>
              <FileInput
                className="mb-4"
                label="Receipt Document"
                name="repair_receipt_document"
                accept=".pdf,image/*"
                documentType={DocumentType.REPAIR}
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
            </div>
          </Col>
        </Row>
      </Container>
    </EntityForm>
  );
}

const styles = `
.vehicle-repair-record-form {
  max-width: 800px;
  margin: 0 auto;
}

.vehicle-repair-record-form .form-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.vehicle-repair-record-form .form-control {
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 8px 12px;
}

.vehicle-repair-record-form .form-control:focus {
  border-color: #2684ff;
  box-shadow: 0 0 0 1px #2684ff;
}

.vehicle-repair-record-form .form-label {
  font-weight: 500;
  margin-bottom: 8px;
}
`;
