import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Card,
  Alert,
  Spinner,
  Button,
  Row,
  Col,
  Badge,
  Modal,
  Form,
  Table,
  Tabs,
  Tab,
} from 'react-bootstrap';
import {
  FileEarmarkArrowUp,
  CheckCircle,
  XCircle,
  Upload,
  Download,
  Eye,
  Truck,
} from 'react-bootstrap-icons';
import VehicleApi from '../../api/vehicle';
import DocumentApi from '../../api/document';
import { VehicleEntity } from '../../../models/company/vehicle.entity';
import { VehicleType } from '../../../enums/vehicles/vehicle-type.enum';
import { VehicleAccessory } from '../../../enums/vehicles/vehicle-accessory.enum';

export default function PublicVehicle() {
  const router = useRouter();
  const { token } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [vehicle, setVehicle] = useState<VehicleEntity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('inspections');

  useEffect(() => {
    if (token && typeof token === 'string') {
      fetchVehicle(token);
    }
  }, [token]);

  const fetchVehicle = async (tokenString: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const api = new VehicleApi();
      const data = await api.getPublicVehicle(tokenString);
      setVehicle(data);
    } catch (err: any) {
      console.error('Error fetching vehicle:', err);
      if (err.response?.status === 404) {
        setError('Vehicle not found or is no longer public');
      } else {
        setError('Unable to load vehicle. Please try again later.');
      }
      setVehicle(null);
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
    if (!selectedFiles.length || !documentType || !token || typeof token !== 'string') return;

    setIsUploading(true);
    setError(null);

    try {
      const api = new VehicleApi();
      await api.uploadDocumentToPublicVehicle(token, documentType, selectedFiles);

      setUploadSuccess(true);
      setSelectedFiles([]);
      setDocumentType('');
      setShowUploadModal(false);

      // Refresh vehicle data
      await fetchVehicle(token);

      // Show success message for 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error uploading files:', err);
      setError(
        err.response?.data?.message || 'Unable to upload files. Please try again or contact support.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const getVehicleType = () => {
    if (!vehicle?.type) return '';
    return vehicle.type === VehicleType.OTHER && vehicle.type_other
      ? vehicle.type_other
      : vehicle.type.replace(/_/g, ' ');
  };

  const handleViewDocument = async (documentId: number) => {
    try {
      const documentApi = new DocumentApi();
      const doc = await documentApi.getSignedUrl(documentId);
      window.open(doc.path, '_blank');
    } catch (error) {
      console.error('Error viewing document:', error);
      setError('Unable to view document');
    }
  };

  const renderDocumentRow = (label: string, document: any, documentTypeKey: string) => (
    <tr>
      <td>{label}</td>
      <td>
        {document ? (
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleViewDocument(document.id)}
            >
              <Eye className="me-1" /> View
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => handleViewDocument(document.id)}
            >
              <Download className="me-1" /> Download
            </Button>
          </div>
        ) : (
          <span className="text-muted">No document uploaded</span>
        )}
      </td>
    </tr>
  );

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
          <h5 style={{ color: '#495057', fontWeight: 500 }}>Loading vehicle information...</h5>
        </Card>
      </div>
    );
  }

  if (error && !vehicle) {
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
            <h4 style={{ color: '#fff', marginTop: '1rem', fontWeight: 600 }}>
              Vehicle Not Found
            </h4>
          </div>
          <Card.Body style={{ padding: '2rem' }}>
            <Alert variant="danger" style={{ marginBottom: '1.5rem' }}>
              {error}
            </Alert>
            <p style={{ color: '#6c757d', textAlign: 'center' }}>
              If you believe this is an error, please contact the vehicle owner or administrator.
            </p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '2rem 0',
      }}
    >
      <Container style={{ maxWidth: '1200px' }}>
        {uploadSuccess && (
          <Alert variant="success" dismissible onClose={() => setUploadSuccess(false)}>
            <CheckCircle className="me-2" />
            Upload successful! Documents have been added to the vehicle.
          </Alert>
        )}

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Header Card with Vehicle Photo */}
        <Card
          style={{
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: 'none',
            borderRadius: '1rem',
            overflow: 'hidden',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgb(0, 96, 120) 0%, rgb(29, 67, 84) 100%)',
              padding: '2rem',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            {vehicle.photo ? (
              <img
                src={vehicle.photo.path}
                alt="Vehicle"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  marginBottom: '1rem',
                  borderRadius: '0.5rem',
                }}
              />
            ) : (
              <Truck size={80} style={{ marginBottom: '1rem', opacity: 0.8 }} />
            )}
            <h2 style={{ margin: 0, fontWeight: 600 }}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem', opacity: 0.9 }}>
              {vehicle.unit_number && `Unit #${vehicle.unit_number}`}
              {vehicle.unit_number && vehicle.vin && ' | '}
              {vehicle.vin && `VIN: ${vehicle.vin}`}
            </p>
          </div>
        </Card>

        <Row>
          {/* Left Column - Vehicle Information */}
          <Col lg={8}>
            {/* Vehicle Information Card */}
            <Card
              style={{
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: 'none',
                borderRadius: '1rem',
                marginBottom: '2rem',
              }}
            >
              <Card.Body style={{ padding: '2rem' }}>
                <h5 style={{ fontWeight: 600, marginBottom: '1.5rem', color: '#495057' }}>
                  Vehicle Information
                </h5>
                <Row>
                  <Col md={6}>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: '#6c757d', fontSize: '0.875rem' }}>Type:</strong>
                      <div style={{ color: '#495057' }}>{getVehicleType()}</div>
                    </div>
                  </Col>
                  {vehicle.trailer_type && (
                    <Col md={6}>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                          Trailer Type:
                        </strong>
                        <div style={{ color: '#495057' }}>{vehicle.trailer_type}</div>
                      </div>
                    </Col>
                  )}
                  {vehicle.transmission_type && (
                    <Col md={6}>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                          Transmission:
                        </strong>
                        <div style={{ color: '#495057' }}>{vehicle.transmission_type}</div>
                      </div>
                    </Col>
                  )}
                  {vehicle.tire_size && (
                    <Col md={6}>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                          Tire Size:
                        </strong>
                        <div style={{ color: '#495057' }}>{vehicle.tire_size}</div>
                      </div>
                    </Col>
                  )}
                  {vehicle.odometer && (
                    <Col md={6}>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                          Odometer:
                        </strong>
                        <div style={{ color: '#495057' }}>{vehicle.odometer} miles</div>
                      </div>
                    </Col>
                  )}
                  <Col md={6}>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: '#6c757d', fontSize: '0.875rem' }}>Governed:</strong>
                      <div style={{ color: '#495057' }}>{vehicle.is_governed ? 'Yes' : 'No'}</div>
                    </div>
                  </Col>
                  {vehicle.is_governed && vehicle.max_speed && (
                    <Col md={6}>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                          Max Speed:
                        </strong>
                        <div style={{ color: '#495057' }}>{vehicle.max_speed} mph</div>
                      </div>
                    </Col>
                  )}
                </Row>

                {vehicle.accessories && vehicle.accessories.length > 0 && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <strong
                      style={{
                        color: '#6c757d',
                        fontSize: '0.875rem',
                        display: 'block',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Accessories:
                    </strong>
                    <div className="d-flex flex-wrap gap-2">
                      {vehicle.accessories.map((accessory, index) => (
                        <Badge
                          key={index}
                          bg="secondary"
                          style={{
                            fontSize: '0.875rem',
                            padding: '0.5rem 1rem',
                            fontWeight: 'normal',
                          }}
                        >
                          {accessory === VehicleAccessory.OTHER && vehicle.accessory_other
                            ? vehicle.accessory_other
                            : accessory.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {vehicle.other_details && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <strong
                      style={{
                        color: '#6c757d',
                        fontSize: '0.875rem',
                        display: 'block',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Other Details:
                    </strong>
                    <p style={{ color: '#495057', margin: 0 }}>{vehicle.other_details}</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Vehicle History Card */}
            <Card
              style={{
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: 'none',
                borderRadius: '1rem',
                marginBottom: '2rem',
              }}
            >
              <Card.Body style={{ padding: '2rem' }}>
                <h5 style={{ fontWeight: 600, marginBottom: '1.5rem', color: '#495057' }}>
                  Vehicle History
                </h5>
                <Tabs activeKey={activeTab} onSelect={(k) => k && setActiveTab(k)} className="mb-3">
                  <Tab eventKey="inspections" title="Inspections">
                    <div style={{ padding: '1rem 0' }}>
                      {vehicle.inspections && vehicle.inspections.length > 0 ? (
                        <Table hover responsive>
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Status</th>
                              <th>Date</th>
                              <th>Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vehicle.inspections.map((inspection: any) => (
                              <tr key={inspection.id}>
                                <td>{inspection.inspection_type}</td>
                                <td>
                                  <Badge
                                    bg={
                                      inspection.status === 'PASSED'
                                        ? 'success'
                                        : inspection.status === 'FAILED'
                                        ? 'danger'
                                        : 'warning'
                                    }
                                  >
                                    {inspection.status}
                                  </Badge>
                                </td>
                                <td>
                                  {inspection.inspection_date
                                    ? new Date(inspection.inspection_date).toLocaleDateString()
                                    : '-'}
                                </td>
                                <td>{inspection.notes || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p style={{ color: '#6c757d', textAlign: 'center', padding: '2rem' }}>
                          No inspections recorded
                        </p>
                      )}
                    </div>
                  </Tab>
                  <Tab eventKey="maintenance" title="Maintenance Reports">
                    <div style={{ padding: '1rem 0' }}>
                      {vehicle.maintenance_reports && vehicle.maintenance_reports.length > 0 ? (
                        <Table hover responsive>
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Date</th>
                              <th>Description</th>
                              <th>Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vehicle.maintenance_reports.map((report: any) => (
                              <tr key={report.id}>
                                <td>{report.maintenance_type}</td>
                                <td>
                                  {report.maintenance_date
                                    ? new Date(report.maintenance_date).toLocaleDateString()
                                    : '-'}
                                </td>
                                <td>{report.description || '-'}</td>
                                <td>{report.cost ? `$${report.cost}` : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p style={{ color: '#6c757d', textAlign: 'center', padding: '2rem' }}>
                          No maintenance reports available
                        </p>
                      )}
                    </div>
                  </Tab>
                  <Tab eventKey="repairs" title="Repair Records">
                    <div style={{ padding: '1rem 0' }}>
                      {vehicle.repairs && vehicle.repairs.length > 0 ? (
                        <Table hover responsive>
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Date</th>
                              <th>Description</th>
                              <th>Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vehicle.repairs.map((repair: any) => (
                              <tr key={repair.id}>
                                <td>{repair.repair_type}</td>
                                <td>
                                  {repair.repair_date
                                    ? new Date(repair.repair_date).toLocaleDateString()
                                    : '-'}
                                </td>
                                <td>{repair.description || '-'}</td>
                                <td>{repair.cost ? `$${repair.cost}` : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p style={{ color: '#6c757d', textAlign: 'center', padding: '2rem' }}>
                          No repair records available
                        </p>
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Documents */}
          <Col lg={4}>
            <Card
              style={{
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: 'none',
                borderRadius: '1rem',
                marginBottom: '2rem',
              }}
            >
              <Card.Body style={{ padding: '2rem' }}>
                <h5 style={{ fontWeight: 600, marginBottom: '1.5rem', color: '#495057' }}>
                  Vehicle Documents
                </h5>

                <Table hover size="sm">
                  <tbody>
                    {renderDocumentRow('Vehicle Photo', vehicle.photo, 'photo')}
                    {renderDocumentRow(
                      'Registration',
                      vehicle.registration_document,
                      'registration_document'
                    )}
                    {renderDocumentRow('Insurance', vehicle.insurance_document, 'insurance_document')}
                    {renderDocumentRow('Title', vehicle.title_document, 'title_document')}
                    {renderDocumentRow(
                      'Lease Agreement',
                      vehicle.lease_agreement_document,
                      'lease_agreement_document'
                    )}
                  </tbody>
                </Table>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <Button
                    variant="primary"
                    onClick={() => setShowUploadModal(true)}
                    style={{
                      backgroundColor: 'rgb(0, 96, 120)',
                      border: 'none',
                      padding: '0.75rem 2rem',
                      fontWeight: 600,
                    }}
                  >
                    <Upload className="me-2" />
                    Upload Documents
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Upload Modal */}
        <Modal
          show={showUploadModal}
          onHide={() => !isUploading && setShowUploadModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton={!isUploading}>
            <Modal.Title>
              <FileEarmarkArrowUp className="me-2" />
              Upload Vehicle Document
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select Document Type</Form.Label>
                <Form.Select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  required
                >
                  <option value="">-- Select Type --</option>
                  <option value="photo">Vehicle Photo</option>
                  <option value="registration_document">Registration Document</option>
                  <option value="insurance_document">Insurance Document</option>
                  <option value="title_document">Title Document</option>
                  <option value="lease_agreement_document">Lease Agreement</option>
                </Form.Select>
              </Form.Group>

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
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || !documentType || isUploading}
              style={{
                backgroundColor: 'rgb(0, 96, 120)',
                border: 'none',
              }}
            >
              {isUploading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} className="me-2" />
                  Upload
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}
