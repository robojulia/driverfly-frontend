import { useState } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';
import { VehicleEntity } from '../../models/company/vehicle.entity';
import { DocumentEntity } from '../../models/documents/document.entity';
import { format, differenceInDays } from 'date-fns';
import UpdateRegistrationModal from './update-registration-modal';

interface VehicleRegistrationProps {
  vehicle: VehicleEntity;
  onRegistrationUpdated: (updatedVehicle: VehicleEntity) => void;
}

export default function VehicleRegistration({
  vehicle,
  onRegistrationUpdated,
}: VehicleRegistrationProps) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  // Calculate days until expiration
  const getDaysUntilExpiration = () => {
    if (!vehicle.registration_expiration_date) return null;
    const today = new Date();
    const expiryDate = new Date(vehicle.registration_expiration_date);
    return differenceInDays(expiryDate, today);
  };

  const daysUntilExpiration = getDaysUntilExpiration();

  const renderExpirationAlert = () => {
    if (!daysUntilExpiration) return null;

    if (daysUntilExpiration <= 30) {
      return (
        <Alert variant="danger" className="mt-3">
          <Alert.Heading className="h6">Registration Expiring Soon!</Alert.Heading>
          {daysUntilExpiration <= 0
            ? t('VEHICLE_REGISTRATION_EXPIRED')
            : t('VEHICLE_REGISTRATION_EXPIRES_IN_DAYS', { days: daysUntilExpiration })}
        </Alert>
      );
    }

    if (daysUntilExpiration <= 90) {
      return (
        <Alert variant="warning" className="mt-3">
          <Alert.Heading className="h6">Registration Expiration Warning</Alert.Heading>
          {t('VEHICLE_REGISTRATION_WILL_EXPIRE_IN_DAYS', { days: daysUntilExpiration })}
        </Alert>
      );
    }

    return null;
  };

  return (
    <Card className="view-card">
      <Card.Header>
        <h5 className="mb-0">{t('Registration')}</h5>
      </Card.Header>
      <Card.Body>
        <div className="mb-4">
          <h6 className="text-muted mb-2">{t('Current Registration')}</h6>
          {vehicle.registration_document ? (
            <div className="d-flex align-items-center">
              <a
                href={vehicle.registration_document.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-decoration-none"
              >
                {vehicle.registration_document.name || 'registration_1.pdf'}
              </a>
            </div>
          ) : (
            <p className="text-muted mb-0">{t('No registration document uploaded')}</p>
          )}
        </div>

        <div>
          <h6 className="text-muted mb-2">{t('Expiry Date')}</h6>
          {vehicle.registration_expiration_date ? (
            <p className="mb-0">
              {format(new Date(vehicle.registration_expiration_date), 'MMMM dd, yyyy')}
            </p>
          ) : (
            <p className="text-muted mb-0">{t('No expiry date set')}</p>
          )}
        </div>
        {renderExpirationAlert()}
      </Card.Body>
      <Card.Footer className="bg-white border-top-0">
        <Button variant="primary" onClick={handleModalShow} className="w-100">
          {t('Update Registration')}
        </Button>
      </Card.Footer>

      <UpdateRegistrationModal
        show={showModal}
        onHide={handleModalClose}
        vehicle={vehicle}
        onRegistrationUpdated={onRegistrationUpdated}
      />
    </Card>
  );
}
