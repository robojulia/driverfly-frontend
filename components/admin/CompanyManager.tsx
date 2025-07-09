import React, { useState, useEffect } from 'react';
import { Alert, Badge, Button, Card, Col, Modal, Row, Spinner, Form } from 'react-bootstrap';
import {
  Building,
  TelephoneFill,
  Plus,
  Trash,
  Gear,
  CheckCircleFill,
  XCircleFill,
} from 'react-bootstrap-icons';
import ViewDataTable, { ViewTableColumn } from '../view-details/view-data-table';
import { useTranslation } from '../../hooks/use-translation';
import CompaniesApi, {
  CompanyWithPhoneNumber,
  ProvisionPhoneNumberRequest,
  AssignPhoneNumberRequest,
} from '../../pages/api/companies';

const CompanyManager: React.FC = () => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<CompanyWithPhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Modal states
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithPhoneNumber | null>(null);

  // Form states
  const [provisionForm, setProvisionForm] = useState({
    areaCode: '',
    region: 'US',
    voiceEnabled: true,
    smsEnabled: true,
    mmsEnabled: true,
  });

  const [assignForm, setAssignForm] = useState({
    phoneNumber: '',
    twilioSid: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const api = new CompaniesApi();
      const companiesData = await api.getAllCompanies(true);

      setCompanies(companiesData);
    } catch (err: any) {
      console.error('Failed to load companies:', err);
      setError(err.response?.data?.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleProvisionPhoneNumber = async () => {
    if (!selectedCompany) return;

    try {
      setActionLoading(selectedCompany.id);
      const api = new CompaniesApi();

      const request: ProvisionPhoneNumberRequest = {
        companyId: selectedCompany.id,
        region: provisionForm.region,
        voiceEnabled: provisionForm.voiceEnabled,
        smsEnabled: provisionForm.smsEnabled,
        mmsEnabled: provisionForm.mmsEnabled,
      };

      if (provisionForm.areaCode) {
        request.areaCode = parseInt(provisionForm.areaCode);
      }

      await api.provisionPhoneNumber(request);

      // Reload data to see the new phone number
      await loadData();

      // Close modal and reset form
      setShowProvisionModal(false);
      setProvisionForm({
        areaCode: '',
        region: 'US',
        voiceEnabled: true,
        smsEnabled: true,
        mmsEnabled: true,
      });
      setSelectedCompany(null);
    } catch (err: any) {
      console.error('Failed to provision phone number:', err);
      setError(err.response?.data?.message || 'Failed to provision phone number');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssignPhoneNumber = async () => {
    if (!selectedCompany) return;

    try {
      setActionLoading(selectedCompany.id);
      const api = new CompaniesApi();

      const request: AssignPhoneNumberRequest = {
        companyId: selectedCompany.id,
        phoneNumber: assignForm.phoneNumber,
        twilioSid: assignForm.twilioSid,
      };

      await api.assignPhoneNumber(request);

      // Reload data to see the assigned phone number
      await loadData();

      // Close modal and reset form
      setShowAssignModal(false);
      setAssignForm({
        phoneNumber: '',
        twilioSid: '',
      });
      setSelectedCompany(null);
    } catch (err: any) {
      console.error('Failed to assign phone number:', err);
      setError(err.response?.data?.message || 'Failed to assign phone number');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReleasePhoneNumber = async (company: CompanyWithPhoneNumber) => {
    if (!company.managedPhoneNumber) return;

    const confirmed = window.confirm(
      `Are you sure you want to release the phone number ${company.managedPhoneNumber.phoneNumber} from ${company.name}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(company.id);
      const api = new CompaniesApi();

      await api.releasePhoneNumber(company.id, { releaseFromTwilio: true });

      // Reload data to see the changes
      await loadData();
    } catch (err: any) {
      console.error('Failed to release phone number:', err);
      setError(err.response?.data?.message || 'Failed to release phone number');
    } finally {
      setActionLoading(null);
    }
  };

  const openProvisionModal = (company: CompanyWithPhoneNumber) => {
    setSelectedCompany(company);
    setShowProvisionModal(true);
  };

  const openAssignModal = (company: CompanyWithPhoneNumber) => {
    setSelectedCompany(company);
    setShowAssignModal(true);
  };

  const formatPhoneNumber = (phoneNumber: string): string => {
    // Format +15551234567 to (555) 123-4567
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      const number = cleaned.substring(1);
      return `(${number.substring(0, 3)}) ${number.substring(3, 6)}-${number.substring(6)}`;
    }
    return phoneNumber;
  };

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderPhoneNumberStatus = (company: CompanyWithPhoneNumber) => {
    if (!company.managedPhoneNumber) {
      return (
        <div className="d-flex align-items-center">
          <XCircleFill className="text-muted me-2" />
          <span className="text-muted">No phone number</span>
        </div>
      );
    }

    return (
      <div className="d-flex align-items-center">
        <CheckCircleFill className="text-success me-2" />
        <div>
          <div className="fw-bold">{formatPhoneNumber(company.managedPhoneNumber.phoneNumber)}</div>
          <div className="text-muted small">
            Assigned {formatDate(company.managedPhoneNumber.createdAt)}
          </div>
        </div>
      </div>
    );
  };

  const renderPhoneNumberActions = (company: CompanyWithPhoneNumber) => {
    const isLoading = actionLoading === company.id;

    if (company.managedPhoneNumber) {
      return (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleReleasePhoneNumber(company)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <>
              <Trash className="me-1" />
              Release
            </>
          )}
        </Button>
      );
    }

    return (
      <div className="d-flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => openProvisionModal(company)}
          disabled={isLoading}
        >
          <Plus className="me-1" />
          Provision
        </Button>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => openAssignModal(company)}
          disabled={isLoading}
        >
          <Gear className="me-1" />
          Assign
        </Button>
      </div>
    );
  };

  const columns: ViewTableColumn<CompanyWithPhoneNumber>[] = [
    {
      id: 'company',
      name: 'Company',
      selector: (row) => row.name,
      sortable: true,
      minWidth: '200px',
      cell: (company) => (
        <div className="d-flex align-items-center">
          <Building className="text-primary me-2" />
          <div>
            <div className="fw-bold">{company.name}</div>
            {company.slug && <div className="text-muted small">{company.slug}</div>}
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      name: 'Status',
      selector: (row) => row.status || 'Unknown',
      sortable: true,
      minWidth: '100px',
      cell: (company) => {
        const statusColor = company.status === 'active' ? 'success' : 'secondary';
        return <Badge bg={statusColor}>{company.status || 'Unknown'}</Badge>;
      },
    },
    {
      id: 'phoneNumber',
      name: 'Phone Number',
      sortable: false,
      minWidth: '200px',
      cell: renderPhoneNumberStatus,
    },
    {
      id: 'actions',
      name: 'Actions',
      sortable: false,
      minWidth: '150px',
      cell: renderPhoneNumberActions,
    },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <Building className="me-2" />
              Companies ({companies.length})
            </h5>
          </div>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <ViewDataTable<CompanyWithPhoneNumber>
            columns={columns}
            items={companies}
            columnSettingKey="admin.companies.columns"
            description="Companies with phone number management status and actions"
          />
        </Card.Body>
      </Card>

      {/* Provision Phone Number Modal */}
      <Modal show={showProvisionModal} onHide={() => setShowProvisionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Provision Phone Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Provision a new phone number for <strong>{selectedCompany?.name}</strong>
          </p>

          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Area Code (Optional)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="555"
                    value={provisionForm.areaCode}
                    onChange={(e) =>
                      setProvisionForm({ ...provisionForm, areaCode: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Region</Form.Label>
                  <Form.Select
                    value={provisionForm.region}
                    onChange={(e) => setProvisionForm({ ...provisionForm, region: e.target.value })}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="mb-3">
              <Form.Label>Capabilities</Form.Label>
              <div>
                <Form.Check
                  type="checkbox"
                  label="Voice Enabled"
                  checked={provisionForm.voiceEnabled}
                  onChange={(e) =>
                    setProvisionForm({ ...provisionForm, voiceEnabled: e.target.checked })
                  }
                />
                <Form.Check
                  type="checkbox"
                  label="SMS Enabled"
                  checked={provisionForm.smsEnabled}
                  onChange={(e) =>
                    setProvisionForm({ ...provisionForm, smsEnabled: e.target.checked })
                  }
                />
                <Form.Check
                  type="checkbox"
                  label="MMS Enabled"
                  checked={provisionForm.mmsEnabled}
                  onChange={(e) =>
                    setProvisionForm({ ...provisionForm, mmsEnabled: e.target.checked })
                  }
                />
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProvisionModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleProvisionPhoneNumber}
            disabled={actionLoading === selectedCompany?.id}
          >
            {actionLoading === selectedCompany?.id ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Provision Number'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Assign Phone Number Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Existing Phone Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Assign an existing Twilio phone number to <strong>{selectedCompany?.name}</strong>
          </p>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="+15551234567"
                value={assignForm.phoneNumber}
                onChange={(e) => setAssignForm({ ...assignForm, phoneNumber: e.target.value })}
              />
              <Form.Text className="text-muted">
                Enter the phone number in E.164 format (e.g., +15551234567)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Twilio SID</Form.Label>
              <Form.Control
                type="text"
                placeholder="PN1234567890abcdef1234567890abcdef"
                value={assignForm.twilioSid}
                onChange={(e) => setAssignForm({ ...assignForm, twilioSid: e.target.value })}
              />
              <Form.Text className="text-muted">Enter the Twilio phone number SID</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssignPhoneNumber}
            disabled={
              actionLoading === selectedCompany?.id ||
              !assignForm.phoneNumber ||
              !assignForm.twilioSid
            }
          >
            {actionLoading === selectedCompany?.id ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Assign Number'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CompanyManager;
