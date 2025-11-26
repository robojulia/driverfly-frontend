import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Card, Alert, Spinner, Button, Form } from 'react-bootstrap';
import { FileEarmarkArrowUp, CheckCircle, XCircle, Upload } from 'react-bootstrap-icons';
import VehicleUploadTokenApi from '../../api/vehicle-upload-token';
import { VehicleUploadTokenEntity } from '../../../models/company/vehicle-upload-token.entity';
import { DocumentReminderType } from '../../../enums/vehicles/document-reminder-type.enum';

export default function VehicleDocumentUpload() {
  const router = useRouter();
  const { token } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [tokenData, setTokenData] = useState<VehicleUploadTokenEntity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (token && typeof token === 'string') {
      validateToken(token);
    }
  }, [token]);

  const validateToken = async (tokenString: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const api = new VehicleUploadTokenApi();
      const data = await api.validateToken(tokenString);

      if (!data.is_active) {
        setError('This upload link has expired or has already been used.');
        setTokenData(null);
      } else if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setError('This upload link has expired.');
        setTokenData(null);
      } else {
        setTokenData(data);
      }
    } catch (err: any) {
      console.error('Error validating token:', err);
      if (err.response?.status === 404) {
        setError('Invalid upload link. Please check the link and try again.');
      } else {
        setError('Unable to validate upload link. Please try again later.');
      }
      setTokenData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles.length || !token || typeof token !== 'string') return;

    setIsUploading(true);
    setError(null);

    try {
      const api = new VehicleUploadTokenApi();
      await api.uploadWithToken(token, selectedFiles);

      setUploadSuccess(true);
      setSelectedFiles([]);
    } catch (err: any) {
      console.error('Error uploading files:', err);
      setError(
        err.response?.data?.message ||
          'Unable to upload files. Please try again or contact support.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const getDocumentTypeLabel = (type?: DocumentReminderType) => {
    if (!type) return 'Document';

    switch (type) {
      case DocumentReminderType.SAFETY_INSPECTION:
        return 'Safety Inspection';
      case DocumentReminderType.MAINTENANCE_REPORT:
        return 'Maintenance Report';
      case DocumentReminderType.OTHER:
        return 'Document';
      default:
        return 'Document';
    }
  };

  const getDocumentDescription = (type?: DocumentReminderType) => {
    if (!type) return 'Please upload the requested document(s) for this vehicle.';

    switch (type) {
      case DocumentReminderType.SAFETY_INSPECTION:
        return 'Please upload the safety inspection report for this vehicle. This may include pre-trip inspection forms, DOT inspection certificates, or other safety-related documentation.';
      case DocumentReminderType.MAINTENANCE_REPORT:
        return 'Please upload the maintenance report for this vehicle. This may include service records, repair receipts, oil change documentation, or other maintenance-related documents.';
      case DocumentReminderType.OTHER:
        return 'Please upload the requested document(s) for this vehicle.';
      default:
        return 'Please upload the requested document(s) for this vehicle.';
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Card
          style={{
            maxWidth: '500px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: 'none',
            borderRadius: '1rem',
          }}
        >
          <Spinner
            animation="border"
            role="status"
            style={{ margin: '0 auto 1.5rem', color: 'rgb(0, 96, 120)' }}
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <h5 style={{ color: '#495057', fontWeight: 500 }}>Validating upload link...</h5>
        </Card>
      </div>
    );
  }

  if (error && !tokenData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          padding: '2rem',
        }}
      >
        <Card
          style={{
            maxWidth: '600px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: 'none',
            borderRadius: '1rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <XCircle size={64} color="#fff" />
            <h4 style={{ color: '#fff', marginTop: '1rem', fontWeight: 600 }}>Upload Link Invalid</h4>
          </div>
          <Card.Body style={{ padding: '2rem' }}>
            <Alert variant="danger" style={{ marginBottom: '1.5rem' }}>
              {error}
            </Alert>
            <p style={{ color: '#6c757d', textAlign: 'center' }}>
              If you believe this is an error, please contact your fleet manager or company administrator.
            </p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (uploadSuccess) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          padding: '2rem',
        }}
      >
        <Card
          style={{
            maxWidth: '600px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: 'none',
            borderRadius: '1rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #28a745 0%, #218838 100%)',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <CheckCircle size={64} color="#fff" />
            <h4 style={{ color: '#fff', marginTop: '1rem', fontWeight: 600 }}>Upload Successful!</h4>
          </div>
          <Card.Body style={{ padding: '2rem' }}>
            <Alert variant="success" style={{ marginBottom: '1.5rem' }}>
              Your {getDocumentTypeLabel(tokenData?.document_type).toLowerCase()} has been uploaded successfully.
            </Alert>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
                Thank you for submitting the required documentation. Your fleet manager has been notified.
              </p>
              <p style={{ color: '#495057', fontSize: '0.875rem' }}>
                You can now close this window.
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '2rem 0',
      }}
    >
      <Container style={{ maxWidth: '800px' }}>
        <Card
          style={{
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: 'none',
            borderRadius: '1rem',
            overflow: 'hidden',
            marginBottom: '2rem',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgb(0, 96, 120) 0%, rgb(29, 67, 84) 100%)',
              padding: '2rem',
              color: '#fff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <FileEarmarkArrowUp size={32} style={{ marginRight: '1rem' }} />
              <div>
                <h4 style={{ margin: 0, fontWeight: 600 }}>
                  Upload {getDocumentTypeLabel(tokenData?.document_type)}
                </h4>
                {tokenData?.vehicle && (
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                    Vehicle: {tokenData.vehicle.year} {tokenData.vehicle.make} {tokenData.vehicle.model}
                    {tokenData.vehicle.unit_number && ` (Unit #${tokenData.vehicle.unit_number})`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <Card.Body style={{ padding: '2rem' }}>
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Description */}
            <div
              style={{
                backgroundColor: '#f8f9fa',
                borderLeft: '4px solid rgb(0, 96, 120)',
                padding: '1.25rem',
                marginBottom: '2rem',
                borderRadius: '0.375rem',
              }}
            >
              <p style={{ margin: 0, color: '#495057', fontSize: '0.95rem' }}>
                {getDocumentDescription(tokenData?.document_type)}
              </p>
            </div>

            {/* Driver Info */}
            {tokenData?.driver_name && (
              <div style={{ marginBottom: '2rem' }}>
                <h6 style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#495057' }}>Driver Information</h6>
                <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Name:</strong> {tokenData.driver_name}
                  </p>
                  {tokenData.driver_email && (
                    <p style={{ margin: '0.25rem 0' }}>
                      <strong>Email:</strong> {tokenData.driver_email}
                    </p>
                  )}
                  {tokenData.driver_phone && (
                    <p style={{ margin: '0.25rem 0' }}>
                      <strong>Phone:</strong> {tokenData.driver_phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* File Upload */}
            <div
              style={{
                border: '2px dashed #dee2e6',
                borderRadius: '0.5rem',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease',
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'rgb(0, 96, 120)';
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = '#dee2e6';
                e.currentTarget.style.backgroundColor = '#fff';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#dee2e6';
                e.currentTarget.style.backgroundColor = '#fff';
                if (e.dataTransfer.files) {
                  setSelectedFiles(Array.from(e.dataTransfer.files));
                }
              }}
            >
              <Upload size={48} style={{ color: 'rgb(0, 96, 120)', marginBottom: '1rem' }} />
              <Form.Group>
                <Form.Label
                  htmlFor="file-upload"
                  style={{
                    cursor: 'pointer',
                    color: 'rgb(0, 96, 120)',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    marginBottom: '0.5rem',
                    display: 'block',
                  }}
                >
                  Choose files or drag and drop here
                </Form.Label>
                <Form.Control
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                />
                <p style={{ fontSize: '0.875rem', color: '#6c757d', margin: '0.5rem 0 0 0' }}>
                  Accepted formats: PDF, JPG, PNG (Max 10MB per file)
                </p>
              </Form.Group>

              {selectedFiles.length > 0 && (
                <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                  <h6 style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#495057' }}>
                    Selected Files ({selectedFiles.length})
                  </h6>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#495057' }}>
                    {selectedFiles.map((file, idx) => (
                      <li key={idx} style={{ marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Button
                size="lg"
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                style={{
                  backgroundColor: 'rgb(0, 96, 120)',
                  border: 'none',
                  padding: '0.75rem 3rem',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
              >
                {isUploading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} className="me-2" />
                    Upload Documents
                  </>
                )}
              </Button>
            </div>

            {/* Expiration Notice */}
            {tokenData?.expires_at && (
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: '#6c757d', margin: 0 }}>
                  This upload link expires on{' '}
                  {new Date(tokenData.expires_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Help Text */}
        <div style={{ textAlign: 'center', color: '#6c757d', fontSize: '0.875rem' }}>
          <p>
            If you experience any issues uploading your documents, please contact your fleet manager.
          </p>
        </div>
      </Container>
    </div>
  );
}
