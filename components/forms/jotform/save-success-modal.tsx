import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert, InputGroup, Input } from 'reactstrap';
import { CheckCircle } from 'react-bootstrap-icons';

interface SaveSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl: string | null;
  email?: string | null;
}

export const SaveSuccessModal: React.FC<SaveSuccessModalProps> = ({
  isOpen,
  onClose,
  resumeUrl,
  email,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (resumeUrl) {
      navigator.clipboard.writeText(resumeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="md">
      <ModalHeader toggle={onClose}>
        <div className="d-flex align-items-center">
          <div className="bg-success rounded-circle p-2 me-2">
            <CheckCircle size={24} className="text-white" />
          </div>
          Progress Saved!
        </div>
      </ModalHeader>
      <ModalBody>
        <p className="mb-3">
          Your application has been saved. {email ? "We've emailed you a link to continue." : "You can return anytime to continue."}
        </p>

        {email && (
          <Alert color="info" className="mb-3">
            <strong>Email sent to:</strong> {email}
          </Alert>
        )}

        {resumeUrl && (
          <div className="mt-3">
            <label className="form-label fw-bold">Your resume link:</label>
            <InputGroup>
              <Input
                type="text"
                value={resumeUrl}
                readOnly
                style={{
                  fontSize: '0.875rem',
                  backgroundColor: '#f8f9fa'
                }}
              />
              <Button
                color={copied ? 'success' : 'primary'}
                outline
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <i className="fa fa-check me-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <i className="fa fa-copy me-1" />
                    Copy
                  </>
                )}
              </Button>
            </InputGroup>
            <small className="text-muted d-block mt-2">
              <i className="fa fa-bookmark me-1" />
              Bookmark this link or save it to your notes
            </small>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onClose}>
          Got it
        </Button>
      </ModalFooter>
    </Modal>
  );
};
