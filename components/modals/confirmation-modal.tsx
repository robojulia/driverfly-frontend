import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';

interface ConfirmationModalProps {
  show: boolean;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: string;
}

export default function ConfirmationModal({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'DELETE',
  cancelLabel = 'CANCEL',
  confirmVariant = 'danger',
}: ConfirmationModalProps) {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{t(title)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{typeof message === 'string' ? t(message) : message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          {t(cancelLabel)}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {t(confirmLabel)}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
