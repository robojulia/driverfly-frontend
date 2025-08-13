import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Row, Col, Form, Alert } from 'react-bootstrap';
import { Camera, Upload, Eye, Trash2, CheckCircle } from 'react-bootstrap-icons';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from '../../hooks/use-translation';
import { useJobAnalytics } from '../../hooks/use-job-analytics';
import { DocumentEntity } from '../../models/documents/document.entity';
import { ApplicantDocumentType } from '../../enums/applicants/applicant-document-type.enum';
import { DocumentCard, Button, Input, Checkbox } from '../shared/dha';
import ViewModal from '../view-details/view-modal';
import { CameraComponent } from '../forms/jotform/longForm/camera';
import FileInput from '../forms/file-input';
import { DRIVER_LICENSE_SIZE_LIMIT } from '../../constants/file-upload.constants';
import styles from '../../styles/digitalhiringapp.module.css';

interface QuickApplyDriversLicenseProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (document: DocumentEntity) => void;
  jobId: number;
  companyId: number;
  isSubmitting?: boolean;
}

interface FormValues {
  document: DocumentEntity;
  useCamera: boolean;
  agreedToInstructions: boolean;
}

const validationSchema = yup.object().shape({
  document: yup.object().shape({
    file_base64: yup.string().required("Please upload or take a photo of your driver's license"),
    name: yup.string().required(),
    mime_type: yup.string().required(),
  }),
  agreedToInstructions: yup
    .boolean()
    .oneOf([true], 'Please confirm you have read and understood the instructions'),
});

export function QuickApplyDriversLicense({
  show,
  onClose,
  onSubmit,
  jobId,
  companyId,
  isSubmitting = false,
}: QuickApplyDriversLicenseProps) {
  const { t } = useTranslation();
  const { trackJobClick } = useJobAnalytics();
  const [showInstructions, setShowInstructions] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  const form = useFormik<FormValues>({
    initialValues: {
      document: {
        ...new DocumentEntity(),
        type: ApplicantDocumentType.DRIVER_LICENSE,
      },
      useCamera: false,
      agreedToInstructions: false,
    },
    validationSchema,
    onSubmit: (values) => {
      // Track analytics for document upload completion
      trackJobClick(jobId, companyId, 'drivers-license-uploaded', {
        additional: {
          method: values.useCamera ? 'camera' : 'upload',
        },
        source: 'quick-apply-modal',
      });

      onSubmit(values.document);
    },
  });

  // Track when modal opens
  useEffect(() => {
    if (show) {
      trackJobClick(jobId, companyId, 'quick-apply-drivers-license-opened', {
        source: 'quick-apply-modal',
      });
    }
  }, [show, jobId, companyId, trackJobClick]);

  const handleCameraCapture = ({ base64, blob }: { base64: string; blob: Blob }) => {
    try {
      const url = URL.createObjectURL(blob);
      const date = new Date();

      form.setFieldValue('document', {
        ...form.values.document,
        file_base64: base64,
        path: url,
        mime_type: 'image/jpeg',
        name: `drivers_license_${date.getTime()}.jpeg`,
      });

      setPreviewImage(url);
    } catch (error) {
      console.error('Camera capture error:', error);
      toast.error('Failed to capture photo. Please try again.');
    }
  };

  const handleFileUpload = (document: DocumentEntity) => {
    form.setFieldValue('document', document);
    if (document.path || document.file_base64) {
      // Create preview URL for uploaded image
      if (document.file_base64 && document.mime_type?.startsWith('image/')) {
        setPreviewImage(`data:${document.mime_type};base64,${document.file_base64}`);
      }
    }
  };

  // Watch for document changes to update preview
  useEffect(() => {
    const document = form.values.document;
    if (document?.file_base64 && document.mime_type?.startsWith('image/')) {
      setPreviewImage(`data:${document.mime_type};base64,${document.file_base64}`);
    } else if (document?.path) {
      setPreviewImage(document.path);
    }
  }, [form.values.document]);

  const handleClearDocument = () => {
    form.setFieldValue('document', {
      ...new DocumentEntity(),
      type: ApplicantDocumentType.DRIVER_LICENSE,
    });
    setPreviewImage('');
    if (previewImage && previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }
  };

  const handleMethodChange = (useCamera: boolean) => {
    form.setFieldValue('useCamera', useCamera);
    // Clear existing document when switching methods
    if (form.values.document.file_base64) {
      handleClearDocument();
    }
  };

  const handleClose = () => {
    // Cleanup blob URLs
    if (previewImage && previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage('');
    form.resetForm();
    onClose();
  };

  const hasDocument = !!form.values.document.file_base64;
  const formErrors = form.errors.document as any;

  return (
    <ViewModal
      show={show}
      size="lg"
      title="Upload Driver's License"
      closeText="Cancel"
      onCloseClick={handleClose}
      footer={
        <div className="d-flex justify-content-between w-100">
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => form.handleSubmit()}
            disabled={!form.isValid || isSubmitting || !form.values.agreedToInstructions}
            loading={isSubmitting}
          >
            Continue with Application
          </Button>
        </div>
      }
    >
      <Form onSubmit={form.handleSubmit}>
        {/* Instructions Info Card */}
        <div className="alert alert-info mb-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5 className="mb-2">📄 Driver&apos;s License Required</h5>
              <p className="mb-2">
                To complete your quick application, we need a clear photo of your valid
                driver&apos;s license.
              </p>
              <Button variant="outline" size="sm" onClick={() => setShowInstructions(true)}>
                View Photo Guidelines
              </Button>
            </div>
          </div>
        </div>

        {/* Method Selection */}
        <div className="mb-4">
          <h6 className="mb-3">Choose Upload Method</h6>
          <Row>
            <Col md={6}>
              <div
                className={`p-3 border rounded cursor-pointer ${
                  form.values.useCamera ? 'border-primary bg-light' : 'border-secondary'
                }`}
                onClick={() => handleMethodChange(true)}
                role="button"
              >
                <div className="d-flex align-items-center">
                  <Camera size={24} className="me-2" />
                  <div>
                    <strong>Take Photo</strong>
                    <div className="text-muted small">Use your camera</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div
                className={`p-3 border rounded cursor-pointer ${
                  !form.values.useCamera ? 'border-primary bg-light' : 'border-secondary'
                }`}
                onClick={() => handleMethodChange(false)}
                role="button"
              >
                <div className="d-flex align-items-center">
                  <Upload size={24} className="me-2" />
                  <div>
                    <strong>Upload File</strong>
                    <div className="text-muted small">Choose from device</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Document Upload/Camera Section */}
        <DocumentCard
          title="Driver's License"
          subtitle={form.values.useCamera ? 'Take a clear photo' : 'Upload a file (PDF, JPG, PNG)'}
          icon="📄"
          className="mb-4"
        >
          {form.values.useCamera ? (
            <div className="mt-3">
              <CameraComponent form={form} name="document" onRemove={handleClearDocument} />
            </div>
          ) : (
            <div className="mt-3">
              <FileInput
                name="document"
                accept="application/pdf,image/*"
                allowedSizeInByte={DRIVER_LICENSE_SIZE_LIMIT}
                formik={form}
              />
            </div>
          )}

          {/* Document Preview */}
          {hasDocument && previewImage && (
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-success">
                  <CheckCircle className="me-1" />
                  Document ready
                </span>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="me-2"
                    onClick={() => setPreviewImage(previewImage)}
                  >
                    <Eye size={16} className="me-1" />
                    Preview
                  </Button>
                  <Button variant="danger" size="sm" onClick={handleClearDocument}>
                    <Trash2 size={16} className="me-1" />
                    Remove
                  </Button>
                </div>
              </div>
              <div className="border rounded p-2">
                <img
                  src={previewImage}
                  alt="Driver's license preview"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    backgroundColor: '#f8f9fa',
                  }}
                />
              </div>
            </div>
          )}

          {/* Error Display */}
          {formErrors && (
            <Alert variant="danger" className="mt-2">
              {typeof formErrors === 'string' ? formErrors : formErrors.file_base64}
            </Alert>
          )}
        </DocumentCard>

        {/* Agreement Checkbox */}
        <div className="mb-3">
          <Checkbox
            name="agreedToInstructions"
            label="I confirm that the uploaded document is a clear, valid driver's license"
            checked={form.values.agreedToInstructions}
            onChange={(e) => form.setFieldValue('agreedToInstructions', e.target.checked)}
            error={form.errors.agreedToInstructions}
          />
        </div>

        {/* Instructions Modal */}
        <ViewModal
          show={showInstructions}
          title="Driver's License Photo Guidelines"
          size="lg"
          closeText="Got it"
          onCloseClick={() => setShowInstructions(false)}
        >
          <div className="mb-4">
            <div className="text-center mb-4">
              <div className="mb-3">
                <img
                  src="/images/license-example.png"
                  alt="Example of good license photo"
                  className="img-fluid border rounded"
                  style={{ maxHeight: '200px' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            <h6 className="text-success mb-2">✅ Good Photo Tips:</h6>
            <ul className="mb-3">
              <li>Ensure all text is clearly readable</li>
              <li>Take photo in good lighting</li>
              <li>Keep the license flat (no curved edges)</li>
              <li>Include the entire license in the frame</li>
              <li>Avoid glare or shadows</li>
            </ul>

            <h6 className="text-danger mb-2">❌ Avoid:</h6>
            <ul className="mb-3">
              <li>Blurry or out-of-focus images</li>
              <li>Photos with glare or reflections</li>
              <li>Partial or cropped license images</li>
              <li>Screenshots or photos of photos</li>
              <li>Expired or damaged licenses</li>
            </ul>

            <Alert variant="info" className="mb-0">
              <strong>Privacy Notice:</strong> Your driver&apos;s license information is encrypted
              and only used for employment verification purposes.
            </Alert>
          </div>
        </ViewModal>
      </Form>
    </ViewModal>
  );
}
