import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { XLg, ClipboardCheck, Code } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/use-translation';
import { useAuth } from '../../hooks/use-auth';

interface EmbedJobsModalProps {
  show: boolean;
  onClose: () => void;
}

export const EmbedJobsModal: React.FC<EmbedJobsModalProps> = ({ show, onClose }) => {
  const { t } = useTranslation();
  const { company } = useAuth();
  const [copied, setCopied] = useState(false);

  // Generate the embed URL filtered to the company's jobs
  const getEmbedUrl = () => {
    if (!company?.id) return '';
    // Assuming the job board is accessible at /jobs with a company filter
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/jobs?company=${company.id}`;
  };

  // Generate the iframe embed code
  const getEmbedCode = () => {
    const embedUrl = getEmbedUrl();
    return `<iframe
  src="${embedUrl}"
  width="100%"
  height="800"
  frameborder="0"
  title="Job Listings">
</iframe>`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(getEmbedCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(getEmbedUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header className="justify-content-between">
        <div className="d-flex align-items-center">
          <Code className="me-2" size={24} />
          <h4 className="modal-title font-weight-normal mb-0">
            {t('Embed Job Listings')}
          </h4>
        </div>
        <Button
          style={{ backgroundColor: 'grey', color: 'white' }}
          variant="theme-general-btn"
          onClick={onClose}
        >
          <XLg className="me-2" /> {t('CLOSE')}
        </Button>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-4">
          <h5 className="mb-3">{t('Embed Instructions')}</h5>
          <p className="text-muted">
            {t('Add DriverFly job listings to your company website by copying and pasting the code below into your website\'s HTML.')}
          </p>
        </div>

        <div className="mb-4">
          <h6 className="mb-2">{t('Option 1: Direct Link')}</h6>
          <p className="text-muted small mb-2">
            {t('Share this link to direct visitors to your job listings:')}
          </p>
          <InputGroup>
            <Form.Control
              type="text"
              readOnly
              value={getEmbedUrl()}
              className="font-monospace"
            />
            <Button variant="outline-secondary" onClick={handleCopyUrl}>
              <ClipboardCheck className="me-1" />
              {copied ? t('Copied!') : t('Copy')}
            </Button>
          </InputGroup>
        </div>

        <div className="mb-3">
          <h6 className="mb-2">{t('Option 2: Embed Code')}</h6>
          <p className="text-muted small mb-2">
            {t('Copy and paste this code into your website to embed the job board:')}
          </p>
          <InputGroup className="mb-3">
            <Form.Control
              as="textarea"
              rows={6}
              readOnly
              value={getEmbedCode()}
              className="font-monospace"
              style={{ fontSize: '0.875rem' }}
            />
          </InputGroup>
          <Button variant="primary" onClick={handleCopyCode} className="w-100">
            <ClipboardCheck className="me-1" />
            {copied ? t('Copied!') : t('Copy Embed Code')}
          </Button>
        </div>

        <div className="alert alert-info mt-4">
          <strong>{t('Note:')}</strong>{' '}
          {t('The embedded job board will automatically display only your company\'s active job listings.')}
        </div>
      </Modal.Body>
    </Modal>
  );
};
