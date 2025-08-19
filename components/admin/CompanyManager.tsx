import React, { useState, useEffect } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Modal,
  Row,
  Spinner,
  Form,
  Dropdown,
} from 'react-bootstrap';
import {
  Building,
  TelephoneFill,
  Plus,
  PlusCircle,
  Link45deg,
  Trash,
  Gear,
  CheckCircleFill,
  XCircleFill,
  Diagram3,
  ThreeDotsVertical,
  ShieldFillCheck,
  ShieldFillExclamation,
  BarChart,
} from 'react-bootstrap-icons';
import ViewDataTable, { ViewTableColumn } from '../view-details/view-data-table';
import { useTranslation } from '../../hooks/use-translation';
import { CompanyForm } from '../forms/company/company-form';
import { CompanyEntity } from '../../models/company/company.entity';
import CompanyUsageModal from './CompanyUsageModal';
import { createDefaultOnboardingChecklistPreferences } from '../../utils/company-preferences-utils';
import CompaniesApi, {
  CompanyWithPhoneNumber,
  ProvisionPhoneNumberRequest,
  AssignPhoneNumberRequest,
  ParentCompanyRequest,
  UnparentCompanyRequest,
  PotentialParent,
  CreateSubCompanyRequest,
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
  const [showParentModal, setShowParentModal] = useState(false);
  const [showUnparentModal, setShowUnparentModal] = useState(false);
  const [showCreateSubCompanyModal, setShowCreateSubCompanyModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithPhoneNumber | null>(null);
  const [potentialParents, setPotentialParents] = useState<PotentialParent[]>([]);
  const [parentSearchTerm, setParentSearchTerm] = useState('');

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

  const [parentForm, setParentForm] = useState({
    parentId: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const api = new CompaniesApi();
      const companiesData = await api.getAllCompanies(true, true); // Include usage data

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

  const handleToggleCompanyDisabled = async (company: CompanyWithPhoneNumber) => {
    const action = company.disabled ? 'enable' : 'disable';
    const confirmed = window.confirm(
      `Are you sure you want to ${action} the company "${company.name}"? This will ${
        company.disabled ? 'restore access to' : 'block access for'
      } all company users.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(company.id);
      const api = new CompaniesApi();

      // Update company with disabled toggle
      await api.updateCompany(company.id, {
        ...company,
        disabled: !company.disabled,
      });

      // Reload data to see the changes
      await loadData();
    } catch (err: any) {
      console.error(`Failed to ${action} company:`, err);
      setError(err.response?.data?.message || `Failed to ${action} company`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleParentCompany = async () => {
    if (!selectedCompany || !parentForm.parentId) return;

    try {
      setActionLoading(selectedCompany.id);
      const api = new CompaniesApi();

      const request: ParentCompanyRequest = {
        parentId: parentForm.parentId,
      };

      await api.setParentCompany(selectedCompany.id, request);

      // Reload data to see the changes
      await loadData();

      // Close modal and reset form
      setShowParentModal(false);
      setParentForm({ parentId: 0 });
      setSelectedCompany(null);
    } catch (err: any) {
      console.error('Failed to parent company:', err);
      setError(err.response?.data?.message || 'Failed to parent company');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSetParentCompany = async () => {
    if (!selectedCompany || !parentForm.parentId) return;

    try {
      setActionLoading(selectedCompany.id);
      const api = new CompaniesApi();

      const request: ParentCompanyRequest = {
        parentId: parentForm.parentId,
      };

      await api.setParentCompany(selectedCompany.id, request);

      // Reload data to see the changes
      await loadData();

      // Close modal and reset form
      setShowParentModal(false);
      setParentForm({ parentId: 0 });
      setSelectedCompany(null);
      setPotentialParents([]);
    } catch (err: any) {
      console.error('Failed to set parent company:', err);
      setError(err.response?.data?.message || 'Failed to set parent company');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnparentCompany = async () => {
    if (!selectedCompany) return;

    try {
      setActionLoading(selectedCompany.id);
      const api = new CompaniesApi();

      const request: UnparentCompanyRequest = {
        confirm: true,
      };

      await api.unparentCompany(selectedCompany.id, request);

      // Reload data to see the changes
      await loadData();

      // Close modal and reset state
      setShowUnparentModal(false);
      setSelectedCompany(null);
    } catch (err: any) {
      console.error('Failed to unparent company:', err);
      setError(err.response?.data?.message || 'Failed to unparent company');
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

  const openParentModal = async (company: CompanyWithPhoneNumber) => {
    setSelectedCompany(company);
    try {
      const api = new CompaniesApi();
      const parents = await api.getPotentialParents(company.id);
      setPotentialParents(parents);
      setParentForm({ parentId: 0 });
      setParentSearchTerm('');
      setShowParentModal(true);
    } catch (err: any) {
      console.error('Failed to load potential parents:', err);
      setError(err.response?.data?.message || 'Failed to load potential parents');
    }
  };

  const openUnparentModal = (company: CompanyWithPhoneNumber) => {
    setSelectedCompany(company);
    setShowUnparentModal(true);
  };

  const openCreateSubCompanyModal = (company: CompanyWithPhoneNumber) => {
    setSelectedCompany(company);
    setShowCreateSubCompanyModal(true);
  };

  const handleCreateSubCompany = async (companyData: CompanyEntity) => {
    if (!selectedCompany) return;

    try {
      setActionLoading(selectedCompany.id);
      const api = new CompaniesApi();

      const request: CreateSubCompanyRequest = {
        name: companyData.name!,
        parentId: selectedCompany.id,
        about: companyData.about,
        website: companyData.website,
        location: companyData.location,
        phone: companyData.phone,
        facebook: companyData.facebook,
        instagram: companyData.instagram,
        linkedin: companyData.linkedin,
        twitter: companyData.twitter,
        fleet_size: companyData.fleet_size,
        founded_year: companyData.founded_year,
        safety_rating: companyData.safety_rating,
        company_culture: companyData.company_culture,
        company_benefits: companyData.company_benefits,
        specialties: companyData.specialties,
      };

      const subCompany = await api.createSubCompany(request);

      // Set up default onboarding checklist preferences for the new sub-company
      if (subCompany?.id) {
        await createDefaultOnboardingChecklistPreferences(subCompany.id);
      }

      // Reload data to see the new sub-company
      await loadData();

      // Close modal and reset state
      setShowCreateSubCompanyModal(false);
      setSelectedCompany(null);
    } catch (err: any) {
      console.error('Failed to create sub-company:', err);
      setError(err.response?.data?.message || 'Failed to create sub-company');
    } finally {
      setActionLoading(null);
    }
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

  const renderParentCompany = (company: CompanyWithPhoneNumber) => {
    // Count sub-companies
    const subCompaniesCount = companies.filter((c) => c.parent?.id === company.id).length;

    if (!company.parent) {
      return (
        <div className="d-flex align-items-center justify-content-between p-2">
          <div className="d-flex align-items-center">
            <XCircleFill className="text-muted me-2" />
            <span className="text-muted">No parent</span>
          </div>
          {subCompaniesCount > 0 && (
            <Badge bg="info" pill className="ms-2">
              {subCompaniesCount} sub-{subCompaniesCount === 1 ? 'company' : 'companies'}
            </Badge>
          )}
        </div>
      );
    }

    return (
      <div className="d-flex align-items-center justify-content-between p-2">
        <div className="d-flex align-items-center">
          <Building className="text-primary me-2" />
          <div className="ms-1">
            <div className="fw-bold mb-1">{company.parent.name}</div>
            {company.parent.slug && <div className="text-muted small">{company.parent.slug}</div>}
          </div>
        </div>
        {subCompaniesCount > 0 && (
          <Badge bg="info" pill className="ms-2 flex-shrink-0">
            {subCompaniesCount} sub-{subCompaniesCount === 1 ? 'company' : 'companies'}
          </Badge>
        )}
      </div>
    );
  };

  const renderCompanyActions = (company: CompanyWithPhoneNumber) => {
    const isLoading = actionLoading === company.id;

    return (
      <div className="d-flex gap-2">
        <Button
          variant="outline-info"
          size="sm"
          onClick={() => {
            setSelectedCompany(company);
            setShowUsageModal(true);
          }}
          disabled={isLoading}
          title="View usage metrics for this company"
        >
          {isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <>
              <BarChart className="me-1" />
              View Usage
            </>
          )}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setSelectedCompany(company);
            setShowActionsModal(true);
          }}
          disabled={isLoading}
          title="View all actions for this company"
        >
          {isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <>
              <Gear className="me-1" />
              View Actions
            </>
          )}
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
      selector: (row) => (row.disabled ? 'Disabled' : row.status || 'Unknown'),
      sortable: true,
      minWidth: '100px',
      cell: (company) => {
        // If company is disabled, show disabled status regardless of other status
        if (company.disabled) {
          return <Badge bg="danger">Disabled</Badge>;
        }

        // Otherwise show the normal status
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
      id: 'parent',
      name: 'Parent Company',
      sortable: false,
      minWidth: '200px',
      cell: renderParentCompany,
    },
    {
      id: 'actions',
      name: 'Actions',
      sortable: false,
      minWidth: '300px',
      cell: (company) => (
        <div className="d-flex gap-2 flex-wrap">{renderCompanyActions(company)}</div>
      ),
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
        <Card.Body style={{ paddingBottom: '120px', overflow: 'visible' }}>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <div style={{ overflow: 'visible' }}>
            <ViewDataTable<CompanyWithPhoneNumber>
              columns={columns}
              items={companies}
              columnSettingKey="admin.companies.columns"
              description="Companies with phone number management status and actions"
            />
          </div>
        </Card.Body>
      </Card>

      {/* Company Actions Modal */}
      <Modal show={showActionsModal} onHide={() => setShowActionsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Building className="me-2" />
            Company Actions - {selectedCompany?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-3">
            {/* Phone Number Actions */}
            <div>
              <h6 className="mb-3">
                <TelephoneFill className="me-2" />
                Phone Number Management
              </h6>
              <div className="d-grid gap-2">
                {!selectedCompany?.managedPhoneNumber ? (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setShowActionsModal(false);
                        openProvisionModal(selectedCompany!);
                      }}
                    >
                      <TelephoneFill className="me-2" />
                      Provision New Phone Number
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        setShowActionsModal(false);
                        openAssignModal(selectedCompany!);
                      }}
                    >
                      <Link45deg className="me-2" />
                      Assign Existing Number
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      setShowActionsModal(false);
                      handleReleasePhoneNumber(selectedCompany!);
                    }}
                  >
                    <Trash className="me-2" />
                    Release Phone Number
                  </Button>
                )}
              </div>
            </div>

            {/* Company Structure Actions */}
            <div>
              <h6 className="mb-3">
                <Diagram3 className="me-2" />
                Company Structure
              </h6>
              <div className="d-grid gap-2">
                {selectedCompany?.parent ? (
                  <>
                    <Button
                      variant="outline-primary"
                      onClick={() => {
                        setShowActionsModal(false);
                        openParentModal(selectedCompany!);
                      }}
                    >
                      <Diagram3 className="me-2" />
                      Change Parent Company
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        setShowActionsModal(false);
                        openUnparentModal(selectedCompany!);
                      }}
                    >
                      <XCircleFill className="me-2" />
                      Remove Parent Company
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      setShowActionsModal(false);
                      openParentModal(selectedCompany!);
                    }}
                  >
                    <Diagram3 className="me-2" />
                    Set Parent Company
                  </Button>
                )}

                <Button
                  variant="success"
                  onClick={() => {
                    setShowActionsModal(false);
                    openCreateSubCompanyModal(selectedCompany!);
                  }}
                >
                  <PlusCircle className="me-2" />
                  Create Sub-Company
                </Button>
              </div>
            </div>

            {/* Company Status Actions */}
            <div>
              <h6 className="mb-3">
                <ShieldFillCheck className="me-2" />
                Company Status
              </h6>
              <div className="d-grid">
                <Button
                  variant={selectedCompany?.disabled ? 'success' : 'warning'}
                  onClick={() => {
                    setShowActionsModal(false);
                    if (selectedCompany) {
                      handleToggleCompanyDisabled(selectedCompany);
                    }
                  }}
                >
                  {selectedCompany?.disabled ? (
                    <>
                      <ShieldFillCheck className="me-2" />
                      Enable Company
                    </>
                  ) : (
                    <>
                      <ShieldFillExclamation className="me-2" />
                      Disable Company
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowActionsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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

      {/* Parent Company Modal */}
      <Modal show={showParentModal} onHide={() => setShowParentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Parent Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Parent <strong>{selectedCompany?.name}</strong> under another company
          </p>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Search Parent Company</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter company name"
                value={parentSearchTerm}
                onChange={(e) => setParentSearchTerm(e.target.value)}
              />
            </Form.Group>

            <div>
              {potentialParents
                .filter(
                  (parent) =>
                    parent.name.toLowerCase().includes(parentSearchTerm.toLowerCase()) ||
                    (parent.slug &&
                      parent.slug.toLowerCase().includes(parentSearchTerm.toLowerCase()))
                )
                .map((parent) => (
                  <div
                    key={parent.id}
                    className={`d-flex justify-content-between align-items-center p-2 border-bottom ${
                      parentForm.parentId === parent.id ? 'bg-light' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setParentForm({ parentId: parent.id })}
                  >
                    <div>
                      <div className="fw-bold">{parent.name}</div>
                      {parent.slug && <div className="text-muted small">{parent.slug}</div>}
                    </div>
                    {parentForm.parentId === parent.id && (
                      <CheckCircleFill className="text-success" />
                    )}
                  </div>
                ))}

              {potentialParents.filter(
                (parent) =>
                  parent.name.toLowerCase().includes(parentSearchTerm.toLowerCase()) ||
                  (parent.slug &&
                    parent.slug.toLowerCase().includes(parentSearchTerm.toLowerCase()))
              ).length === 0 &&
                parentSearchTerm && (
                  <div className="text-muted small">No companies match your search</div>
                )}

              {potentialParents.length === 0 && !parentSearchTerm && (
                <div className="text-muted small">No potential parents found</div>
              )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowParentModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleParentCompany}
            disabled={actionLoading === selectedCompany?.id || !parentForm.parentId}
          >
            {actionLoading === selectedCompany?.id ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Parent Company'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Unparent Company Modal */}
      <Modal show={showUnparentModal} onHide={() => setShowUnparentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Unparent Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Unparent <strong>{selectedCompany?.name}</strong> from its parent company
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUnparentModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleUnparentCompany}
            disabled={actionLoading === selectedCompany?.id}
          >
            {actionLoading === selectedCompany?.id ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Unparent Company'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create Sub-Company Modal */}
      <Modal
        show={showCreateSubCompanyModal}
        onHide={() => setShowCreateSubCompanyModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Sub-Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            Create a new sub-company under <strong>{selectedCompany?.name}</strong>
          </p>

          <CompanyForm
            entity={new CompanyEntity()}
            onSaveComplete={handleCreateSubCompany}
            onSaveError={() => setShowCreateSubCompanyModal(false)}
            showClickToCopy={false}
            skipApiCall={true}
          />
        </Modal.Body>
      </Modal>

      {/* Company Usage Modal */}
      <CompanyUsageModal
        show={showUsageModal}
        onHide={() => setShowUsageModal(false)}
        company={selectedCompany}
      />
    </>
  );
};

export default CompanyManager;
