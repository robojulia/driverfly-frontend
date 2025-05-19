import { useFormik } from 'formik';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useTranslation } from '../../hooks/use-translation';
import { VehicleEntity } from '../../models/company/vehicle.entity';
import VehicleApi from '../../pages/api/vehicle';
import { DocumentType } from '../../models/documents/document.entity';
import FileInput from '../forms/file-input';
import BaseDateInput from '../forms/base-date-input';
import { globalAjaxExceptionHandler } from '../../utils/ajax';

interface UpdateRegistrationModalProps {
  show: boolean;
  onHide: () => void;
  vehicle: VehicleEntity;
  onRegistrationUpdated: (updatedVehicle: VehicleEntity) => void;
}

const validationSchema = yup.object({
  registration_document: yup.mixed().required('Registration document is required'),
  registration_expiration_date: yup.date().required('Expiration date is required'),
});

export default function UpdateRegistrationModal({
  show,
  onHide,
  vehicle,
  onRegistrationUpdated,
}: UpdateRegistrationModalProps) {
  const { t } = useTranslation();

  const form = useFormik({
    initialValues: {
      registration_document: null,
      registration_expiration_date: vehicle.registration_expiration_date || null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const api = new VehicleApi();

        // First update the vehicle
        await api.update(vehicle.id, {
          ...vehicle,
          registration_document: values.registration_document,
          registration_expiration_date: values.registration_expiration_date,
        });

        // Then re-fetch the vehicle with documents
        const updatedVehicle = await api.findById(vehicle.id, { withDocuments: true });

        toast.success(t('Registration updated successfully'));
        onRegistrationUpdated(updatedVehicle);
        onHide();
      } catch (e) {
        console.error('Unable to update registration', e);
        globalAjaxExceptionHandler(e, {
          formik: form,
          toast: toast,
          t: t,
          defaultMessage: t('Failed to update registration'),
        });
      }
    },
  });

  return (
    <Modal show={show} onHide={onHide} centered>
      <form onSubmit={form.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{t('Update Registration')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FileInput
            className="mb-4"
            label="Registration Document"
            name="registration_document"
            accept=".pdf,image/*"
            documentType={DocumentType.REGISTRATION}
            formik={form}
            allowedSizeInByte={3145728} // 3MB
            required
          />

          <BaseDateInput
            label="Expiration Date"
            name="registration_expiration_date"
            formik={form}
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            {t('Cancel')}
          </Button>
          <Button variant="primary" type="submit" disabled={form.isSubmitting || !form.isValid}>
            {form.isSubmitting ? t('Updating...') : t('Update')}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
