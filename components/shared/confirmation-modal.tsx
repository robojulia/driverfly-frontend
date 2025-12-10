import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { ExclamationTriangle, Trash, X, Check } from 'react-bootstrap-icons';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: 'primary' | 'danger' | 'warning' | 'success' | 'secondary';
  isLoading?: boolean;
  loadingText?: string;
  icon?: 'warning' | 'danger' | 'success' | 'info';
  size?: 'sm' | 'lg' | 'xl';
  centered?: boolean;
  additionalContent?: React.ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonColor = 'primary',
  isLoading = false,
  loadingText = 'Processing...',
  icon = 'warning',
  size,
  centered = true,
  additionalContent,
}) => {
  // Add styles to prevent hover gradient change on cancel button
  React.useEffect(() => {
    const styleId = 'confirmation-modal-button-styles';
    if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .confirmation-modal-cancel-btn.btn-secondary:hover {
          background-color: #6c757d !important;
          border-color: #6c757d !important;
          background-image: none !important;
        }
        .confirmation-modal-cancel-btn.btn-secondary:active,
        .confirmation-modal-cancel-btn.btn-secondary:focus {
          background-color: #6c757d !important;
          border-color: #6c757d !important;
          background-image: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const getIconComponent = () => {
    const iconSize = 24;
    const iconClass = 'text-white';

    switch (icon) {
      case 'danger':
        return <Trash size={iconSize} className={iconClass} />;
      case 'warning':
        return <ExclamationTriangle size={iconSize} className={iconClass} />;
      case 'success':
        return <Check size={iconSize} className={iconClass} />;
      case 'info':
      default:
        return <ExclamationTriangle size={iconSize} className={iconClass} />;
    }
  };

  const getIconBackgroundClass = () => {
    switch (icon) {
      case 'danger':
        return 'bg-danger';
      case 'warning':
        return 'bg-warning';
      case 'success':
        return 'bg-success';
      case 'info':
      default:
        return 'bg-info';
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered={centered} size={size}>
      <ModalHeader toggle={onClose}>{title}</ModalHeader>
      <ModalBody>
        <div className="d-flex align-items-start mb-3">
          <div className={`${getIconBackgroundClass()} rounded-circle p-3 me-3 flex-shrink-0`}>
            {getIconComponent()}
          </div>
          <div className="flex-grow-1">
            {typeof message === 'string' ? <p className="mb-0">{message}</p> : message}
          </div>
        </div>

        {additionalContent && <div className="mt-3">{additionalContent}</div>}
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          className="confirmation-modal-cancel-btn"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button color={confirmButtonColor} onClick={onConfirm} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              {loadingText}
            </>
          ) : (
            confirmText
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
