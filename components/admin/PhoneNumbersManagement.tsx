import React, { useState, useEffect } from 'react';
import { Alert, Badge, Card, Col, Row, Spinner, Button, Modal, Form } from 'react-bootstrap';
import {
  TelephoneFill,
  CheckCircleFill,
  XCircleFill,
  Building,
  Calendar,
  Gear,
  PencilSquare,
} from 'react-bootstrap-icons';
import ViewDataTable, { ViewTableColumn } from '../view-details/view-data-table';
import { useTranslation } from '../../hooks/use-translation';
import PhoneNumbersApi, {
  TwilioPhoneNumberInfo,
  PhoneNumbersSummary,
} from '../../pages/api/phone-numbers';

const PhoneNumbersManagement: React.FC = () => {
  const { t } = useTranslation();
  const [phoneNumbers, setPhoneNumbers] = useState<TwilioPhoneNumberInfo[]>([]);
  const [summary, setSummary] = useState<PhoneNumbersSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state
  const [editModalShow, setEditModalShow] = useState(false);
  const [editingNumber, setEditingNumber] = useState<TwilioPhoneNumberInfo | null>(null);
  const [newFriendlyName, setNewFriendlyName] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const api = new PhoneNumbersApi();
      const [numbersData, summaryData] = await Promise.all([
        api.getAllPhoneNumbers(),
        api.getPhoneNumbersSummary(),
      ]);

      setPhoneNumbers(numbersData);
      setSummary(summaryData);
    } catch (err: any) {
      console.error('Failed to load phone numbers:', err);
      setError(err.response?.data?.message || 'Failed to load phone numbers');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFriendlyName = (phoneNumber: TwilioPhoneNumberInfo) => {
    setEditingNumber(phoneNumber);
    setNewFriendlyName(phoneNumber.friendlyName || '');
    setEditModalShow(true);
  };

  const handleSaveFriendlyName = async () => {
    if (!editingNumber) return;

    try {
      setUpdating(true);
      const api = new PhoneNumbersApi();
      await api.updatePhoneNumberFriendlyName(editingNumber.phoneNumber, newFriendlyName);

      // Update the local state
      setPhoneNumbers((prev) =>
        prev.map((num) =>
          num.phoneNumber === editingNumber.phoneNumber
            ? { ...num, friendlyName: newFriendlyName }
            : num
        )
      );

      setEditModalShow(false);
      setEditingNumber(null);
      setNewFriendlyName('');
    } catch (err: any) {
      console.error('Failed to update friendly name:', err);
      setError(err.response?.data?.message || 'Failed to update friendly name');
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalShow(false);
    setEditingNumber(null);
    setNewFriendlyName('');
  };

  const formatPhoneNumber = (phoneNumber: string): string => {
    // Format +15551234567 to +1 (555) 123-4567
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString();
  };

  const renderCapabilities = (capabilities: TwilioPhoneNumberInfo['capabilities']) => {
    const caps = [];
    if (capabilities.voice) caps.push('Voice');
    if (capabilities.sms) caps.push('SMS');
    if (capabilities.mms) caps.push('MMS');
    if (capabilities.fax) caps.push('Fax');

    return caps.map((cap, index) => (
      <Badge key={index} bg="info" className="me-1">
        {cap}
      </Badge>
    ));
  };

  const renderManagementStatus = (phoneNumber: TwilioPhoneNumberInfo) => {
    if (phoneNumber.isManaged && phoneNumber.managedBy) {
      return (
        <div className="d-flex align-items-center">
          <CheckCircleFill className="text-success me-2" />
          <div>
            <div className="fw-bold text-success">Managed</div>
            <small className="text-muted">
              <Building className="me-1" />
              {phoneNumber.managedBy.name}
            </small>
          </div>
        </div>
      );
    }

    return (
      <div className="d-flex align-items-center">
        <XCircleFill className="text-warning me-2" />
        <div className="fw-bold text-warning">Shared/System</div>
      </div>
    );
  };

  const columns: ViewTableColumn<TwilioPhoneNumberInfo>[] = [
    {
      id: 'phoneNumber',
      name: 'Phone Number',
      selector: (row) => row.phoneNumber,
      sortable: true,
      minWidth: '160px',
      cell: (row) => (
        <div className="d-flex align-items-center">
          <TelephoneFill className="text-primary me-2" />
          <div>
            <div className="fw-bold">{formatPhoneNumber(row.phoneNumber)}</div>
            <small className="text-muted">{row.friendlyName}</small>
          </div>
        </div>
      ),
    },
    {
      id: 'managementStatus',
      name: 'Management Status',
      selector: (row) => (row.isManaged ? 'managed' : 'shared'),
      sortable: true,
      minWidth: '180px',
      cell: (row) => renderManagementStatus(row),
    },
    {
      id: 'capabilities',
      name: 'Capabilities',
      selector: (row) => Object.values(row.capabilities).filter(Boolean).length,
      sortable: true,
      minWidth: '150px',
      cell: (row) => renderCapabilities(row.capabilities),
    },
    {
      id: 'dateCreated',
      name: 'Created',
      selector: (row) => new Date(row.dateCreated).getTime(),
      sortable: true,
      minWidth: '120px',
      cell: (row) => (
        <div className="d-flex align-items-center">
          <Calendar className="text-muted me-2" />
          {formatDate(row.dateCreated)}
        </div>
      ),
    },
    {
      id: 'webhookConfig',
      name: 'Configuration',
      selector: (row) => (row.smsUrl ? 'configured' : 'incomplete'),
      sortable: true,
      minWidth: '120px',
      cell: (row) => (
        <div className="d-flex align-items-center">
          <Gear className={`me-2 ${row.smsUrl ? 'text-success' : 'text-danger'}`} />
          <span className={row.smsUrl ? 'text-success' : 'text-danger'}>
            {row.smsUrl ? 'Configured' : 'Incomplete'}
          </span>
        </div>
      ),
    },
    {
      id: 'sid',
      name: 'Twilio SID',
      selector: (row) => row.sid,
      sortable: true,
      minWidth: '120px',
      cell: (row) => <code className="small text-muted">{row.sid}</code>,
      hidable: true,
    },
    {
      id: 'actions',
      name: 'Actions',
      selector: (row) => row.sid,
      sortable: false,
      minWidth: '100px',
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleEditFriendlyName(row)}
            title="Edit friendly name"
          >
            <PencilSquare size={14} />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '400px' }}
      >
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <div>Loading phone numbers...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error Loading Phone Numbers</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <div className="phone-numbers-management">
      {/* Summary Cards */}
      {summary && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="h-100">
              <Card.Body className="text-center">
                <div className="h3 text-primary mb-1">{summary.total}</div>
                <div className="text-muted">Total Numbers</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100">
              <Card.Body className="text-center">
                <div className="h3 text-success mb-1">{summary.managed}</div>
                <div className="text-muted">Managed Numbers</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100">
              <Card.Body className="text-center">
                <div className="h3 text-warning mb-1">{summary.unmanaged}</div>
                <div className="text-muted">Shared Numbers</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100">
              <Card.Body className="text-center">
                <div className="h3 text-info mb-1">{summary.companies.length}</div>
                <div className="text-muted">Companies</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Phone Numbers Table */}
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Phone Numbers</h5>
          <div className="text-muted small">
            {phoneNumbers.length} number{phoneNumbers.length !== 1 ? 's' : ''} found
          </div>
        </Card.Header>
        <Card.Body className="p-10">
          <ViewDataTable<TwilioPhoneNumberInfo>
            columns={columns}
            items={phoneNumbers}
            columnSettingKey="admin.phone-numbers.columns"
            description="Twilio phone numbers with management status and configuration details"
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: '#f8f9fa',
                },
              },
            }}
          />
        </Card.Body>
      </Card>

      {/* Capabilities Summary */}
      {summary && (
        <Card className="mt-4">
          <Card.Header>
            <h6 className="mb-0">Capabilities Summary</h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <div className="text-center">
                  <div className="h4 text-primary">{summary.byCapabilities.voice}</div>
                  <div className="text-muted">Voice Enabled</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="h4 text-success">{summary.byCapabilities.sms}</div>
                  <div className="text-muted">SMS Enabled</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="h4 text-info">{summary.byCapabilities.mms}</div>
                  <div className="text-muted">MMS Enabled</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="h4 text-secondary">{summary.byCapabilities.fax}</div>
                  <div className="text-muted">Fax Enabled</div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Companies with Managed Numbers */}
      {summary && summary.companies.length > 0 && (
        <Card className="mt-4">
          <Card.Header>
            <h6 className="mb-0">Companies with Managed Numbers</h6>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-wrap gap-2">
              {summary.companies.map((company, index) => (
                <Badge key={index} bg="outline-primary" className="p-2">
                  <Building className="me-1" />
                  {company}
                </Badge>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Edit Friendly Name Modal */}
      <Modal show={editModalShow} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Friendly Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingNumber && (
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <TelephoneFill className="text-primary me-2" />
                <strong>{formatPhoneNumber(editingNumber.phoneNumber)}</strong>
              </div>
              <div className="text-muted small">
                SID: <code>{editingNumber.sid}</code>
              </div>
            </div>
          )}
          <Form.Group>
            <Form.Label>Friendly Name</Form.Label>
            <Form.Control
              type="text"
              value={newFriendlyName}
              onChange={(e) => setNewFriendlyName(e.target.value)}
              placeholder="Enter a friendly name for this number"
              disabled={updating}
            />
            <Form.Text className="text-muted">
              This name helps you identify the purpose or owner of this phone number.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal} disabled={updating}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveFriendlyName}
            disabled={updating || !newFriendlyName.trim()}
          >
            {updating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PhoneNumbersManagement;
