import React from 'react';
import { Modal } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';

export interface ModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'lg' | 'xl';
  centered?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const BaseModal: React.FC<ModalProps> = ({
  show,
  onClose,
  title,
  size,
  centered = true,
  className = '',
  children,
}) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      size={size}
      centered={centered}
      className={`unified-modal ${className}`}
      backdrop="static"
      keyboard={true}
    >
      {/* Unified Header with consistent styling */}
      <Modal.Header className="border-0 pb-2 px-4 pt-4" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="d-flex justify-content-between align-items-center w-100">
          {title && (
            <h4
              className="modal-title mb-0"
              style={{
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '1.25rem',
              }}
            >
              {title}
            </h4>
          )}

          {/* Unified close button */}
          <button
            type="button"
            className="btn p-0 ms-auto"
            onClick={onClose}
            style={{
              border: '1px solid #dee2e6',
              background: '#ffffff',
              color: '#495057',
              fontSize: '1.5rem',
              lineHeight: 1,
              opacity: 1,
              transition: 'all 0.2s ease-in-out',
              borderRadius: '6px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.borderColor = '#adb5bd';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#dee2e6';
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </Modal.Header>

      {/* Body with consistent padding */}
      <Modal.Body
        className="px-4 py-3"
        style={{
          backgroundColor: '#ffffff',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        }}
      >
        {children}
      </Modal.Body>
    </Modal>
  );
};

export default BaseModal;
