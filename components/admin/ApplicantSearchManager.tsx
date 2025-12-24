import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Spinner,
  Pagination,
} from 'react-bootstrap';
import {
  PersonFill,
  Building,
  Search,
  InfoCircle,
  CheckCircleFill,
  XCircleFill,
  TelephoneFill,
  EnvelopeFill,
  CalendarFill,
  BriefcaseFill,
  ExclamationTriangleFill,
} from 'react-bootstrap-icons';
import { debounce } from 'lodash';
import ViewDataTable, { ViewTableColumn } from '../view-details/view-data-table';
import AdminApplicantSearchApi from '../../pages/api/admin-applicant-search';
import CompaniesApi, { CompanyWithPhoneNumber } from '../../pages/api/companies';
import {
  ApplicantWithAutoRecruitingData,
  ApplicantSearchResponse,
  ApplicantSearchParams,
} from '../../models/admin/admin-applicant-search.entity';

interface ApplicantSearchManagerState {
  data: ApplicantWithAutoRecruitingData[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: {
    search: string;
    companyId: string;
    eligibleOnly: boolean;
  };
}

const ApplicantSearchManager: React.FC = () => {
  const [state, setState] = useState<ApplicantSearchManagerState>({
    data: [],
    loading: true,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 50,
    },
    filters: {
      search: '',
      companyId: '',
      eligibleOnly: false,
    },
  });

  // Companies state
  const [companies, setCompanies] = useState<CompanyWithPhoneNumber[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  // Modal for auto-recruiting details
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<ApplicantWithAutoRecruitingData | null>(null);

  const api = useMemo(() => new AdminApplicantSearchApi(), []);
  const companiesApi = useMemo(() => new CompaniesApi(), []);

  const loadCompanies = useCallback(async () => {
    try {
      setCompaniesLoading(true);
      const companiesData = await companiesApi.getAllCompanies(false, false);
      setCompanies(companiesData);
    } catch (err: any) {
      console.error('Failed to load companies:', err);
    } finally {
      setCompaniesLoading(false);
    }
  }, [companiesApi]);

  const loadData = useCallback(
    async (params: Partial<ApplicantSearchParams> = {}) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const searchParams: ApplicantSearchParams = {
          page: state.pagination.currentPage,
          limit: state.pagination.itemsPerPage,
          search: state.filters.search || undefined,
          companyId: state.filters.companyId ? Number(state.filters.companyId) : undefined,
          eligibleOnly: state.filters.eligibleOnly,
          ...params,
        };

        const response: ApplicantSearchResponse = await api.searchApplicants(searchParams);

        setState((prev) => ({
          ...prev,
          data: response.data,
          pagination: {
            currentPage: response.meta.currentPage,
            totalPages: response.meta.totalPages,
            totalItems: response.meta.totalItems,
            itemsPerPage: response.meta.itemsPerPage,
          },
          loading: false,
        }));
      } catch (err: any) {
        console.error('Failed to load applicants:', err);
        setState((prev) => ({
          ...prev,
          error: err.response?.data?.message || 'Failed to load applicants',
          loading: false,
        }));
      }
    },
    [state.pagination.currentPage, state.pagination.itemsPerPage, state.filters, api]
  );

  // Debounced search to avoid excessive API calls
  const debouncedLoadData = useCallback(
    debounce((params: Partial<ApplicantSearchParams> = {}) => {
      loadData({ page: 1, ...params });
    }, 500),
    [loadData]
  );

  useEffect(() => {
    loadData();
    loadCompanies();
  }, [loadData, loadCompanies]);

  const handleSearchChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, search: value },
      pagination: { ...prev.pagination, currentPage: 1 },
    }));
    debouncedLoadData({ search: value });
  };

  const handleCompanyFilterChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, companyId: value },
      pagination: { ...prev.pagination, currentPage: 1 },
    }));
    loadData({ page: 1, companyId: value ? Number(value) : undefined });
  };

  const handleEligibleOnlyChange = (checked: boolean) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, eligibleOnly: checked },
      pagination: { ...prev.pagination, currentPage: 1 },
    }));
    loadData({ page: 1, eligibleOnly: checked });
  };

  const handlePageChange = (page: number) => {
    setState((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, currentPage: page },
    }));
    loadData({ page });
  };

  const handleShowDetails = (applicant: ApplicantWithAutoRecruitingData) => {
    setSelectedApplicant(applicant);
    setShowDetailsModal(true);
  };

  const renderApplicantInfo = (applicant: ApplicantWithAutoRecruitingData) => (
    <div className="d-flex align-items-center">
      <PersonFill className="text-primary me-2" />
      <div>
        <div className="fw-bold">
          {applicant.firstName && applicant.lastName
            ? `${applicant.firstName} ${applicant.lastName}`
            : applicant.email || 'Unknown'}
        </div>
        <div className="text-muted small d-flex align-items-center gap-2">
          {applicant.email && (
            <span>
              <EnvelopeFill size={12} className="me-1" />
              {applicant.email}
            </span>
          )}
          {applicant.phone && (
            <span>
              <TelephoneFill size={12} className="me-1" />
              {applicant.phone}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const renderCompanyInfo = (applicant: ApplicantWithAutoRecruitingData) => (
    <div className="d-flex align-items-center">
      <Building className="text-secondary me-2" size={14} />
      <div>
        <div className="fw-medium">{applicant.companyName}</div>
        <div className="text-muted small">ID: {applicant.companyId}</div>
      </div>
    </div>
  );

  const renderJobInfo = (applicant: ApplicantWithAutoRecruitingData) => {
    if (!applicant.jobTitle) {
      return <span className="text-muted">No job specified</span>;
    }

    let statusColor = 'secondary';
    if (applicant.jobStatus === 'ACTIVE') statusColor = 'success';
    else if (applicant.jobStatus === 'INACTIVE') statusColor = 'warning';

    return (
      <div>
        <div className="fw-medium">{applicant.jobTitle}</div>
        <Badge bg={statusColor} className="mt-1">
          {applicant.jobStatus}
        </Badge>
      </div>
    );
  };

  const renderApplicationDate = (applicant: ApplicantWithAutoRecruitingData) => (
    <div>
      <div className="fw-medium">
        <CalendarFill size={12} className="me-1" />
        {new Date(applicant.appliedAt).toLocaleDateString()}
      </div>
      {applicant.hiredAt && (
        <div className="text-success small">
          <CheckCircleFill size={12} className="me-1" />
          Hired: {new Date(applicant.hiredAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );

  const renderAutoRecruitingStatus = (applicant: ApplicantWithAutoRecruitingData) => (
    <div className="d-flex align-items-center gap-2">
      {applicant.isEligibleForAutoRecruiting ? (
        <Badge bg="success">
          <CheckCircleFill size={12} className="me-1" />
          Eligible
        </Badge>
      ) : (
        <Badge bg="secondary">
          <XCircleFill size={12} className="me-1" />
          Not Eligible
        </Badge>
      )}
      <Button
        variant="outline-info"
        size="sm"
        onClick={() => handleShowDetails(applicant)}
        title="View auto-recruiting details"
      >
        <InfoCircle size={14} />
      </Button>
    </div>
  );

  const renderEngagementInfo = (applicant: ApplicantWithAutoRecruitingData) => (
    <div>
      <div className="fw-medium">{applicant.numberEngagements} engagements</div>
      {applicant.lastEngaged && (
        <div className="text-muted small">
          Last: {new Date(applicant.lastEngaged).toLocaleDateString()}
        </div>
      )}
    </div>
  );

  const columns: ViewTableColumn<ApplicantWithAutoRecruitingData>[] = [
    {
      id: 'applicant',
      name: 'Applicant',
      selector: (row) => row.email || '',
      sortable: false,
      minWidth: '250px',
      cell: renderApplicantInfo,
    },
    {
      id: 'company',
      name: 'Company',
      selector: (row) => row.companyName,
      sortable: false,
      minWidth: '200px',
      cell: renderCompanyInfo,
    },
    {
      id: 'job',
      name: 'Job Applied For',
      selector: (row) => row.jobTitle || '',
      sortable: false,
      minWidth: '180px',
      cell: renderJobInfo,
    },
    {
      id: 'applicationDate',
      name: 'Application Date',
      selector: (row) => new Date(row.appliedAt).toISOString(),
      sortable: false,
      minWidth: '150px',
      cell: renderApplicationDate,
    },
    {
      id: 'engagement',
      name: 'Engagement',
      selector: (row) => row.numberEngagements,
      sortable: false,
      minWidth: '120px',
      cell: renderEngagementInfo,
    },
    {
      id: 'autoRecruiting',
      name: 'Auto-Recruiting',
      sortable: false,
      minWidth: '150px',
      cell: renderAutoRecruitingStatus,
    },
  ];

  const renderPagination = () => {
    if (state.pagination.totalPages <= 1) return null;

    const items = [];
    const currentPage = state.pagination.currentPage;
    const totalPages = state.pagination.totalPages;

    // Previous button
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      />
    );

    // Page numbers
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis1" />);
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    );

    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">
          Showing{' '}
          {Math.min(
            (currentPage - 1) * state.pagination.itemsPerPage + 1,
            state.pagination.totalItems
          )}{' '}
          to {Math.min(currentPage * state.pagination.itemsPerPage, state.pagination.totalItems)} of{' '}
          {state.pagination.totalItems} applicants
        </div>
        <Pagination className="mb-0">{items}</Pagination>
      </div>
    );
  };

  if (state.loading && state.data.length === 0) {
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
            <div>
              <h5 className="mb-0">
                <PersonFill className="me-2" />
                Applicant Search
              </h5>
              <small className="text-muted">
                Search and view all applicants with auto-recruiting eligibility insights
              </small>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {state.error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setState((prev) => ({ ...prev, error: null }))}
            >
              {state.error}
            </Alert>
          )}

          {/* Filters */}
          <Row className="mb-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={14} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={state.filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Control
                as="select"
                value={state.filters.companyId}
                onChange={(e) => handleCompanyFilterChange(e.target.value)}
                disabled={companiesLoading}
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Form.Control>
              {companiesLoading && <small className="text-muted">Loading companies...</small>}
            </Col>
            <Col md={3}>
              <Form.Check
                type="checkbox"
                label="Show only eligible for auto-recruiting"
                checked={state.filters.eligibleOnly}
                onChange={(e) => handleEligibleOnlyChange(e.target.checked)}
              />
            </Col>
            <Col md={2} className="text-end">
              {state.loading && <Spinner size="sm" animation="border" />}
            </Col>
          </Row>

          <ViewDataTable<ApplicantWithAutoRecruitingData>
            columns={columns}
            items={state.data}
            columnSettingKey="admin.applicant-search.columns"
            hideSearch={true}
            description="Applicants with auto-recruiting eligibility information"
          />

          {renderPagination()}
        </Card.Body>
      </Card>

      {/* Auto-Recruiting Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Auto-Recruiting Eligibility Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApplicant && (
            <div>
              <Row className="mb-3">
                <Col>
                  <h6>
                    <PersonFill className="me-2" />
                    {selectedApplicant.firstName && selectedApplicant.lastName
                      ? `${selectedApplicant.firstName} ${selectedApplicant.lastName}`
                      : selectedApplicant.email}
                  </h6>
                  <div className="text-muted">
                    <Building size={14} className="me-1" />
                    {selectedApplicant.companyName}
                  </div>
                </Col>
              </Row>

              <Card className="mb-3">
                <Card.Body>
                  <h6 className="mb-3">
                    <BriefcaseFill className="me-2" />
                    Eligibility Status
                  </h6>
                  <div className="mb-3">
                    {selectedApplicant.isEligibleForAutoRecruiting ? (
                      <Badge bg="success" className="fs-6">
                        <CheckCircleFill className="me-1" />
                        Eligible for Auto-Recruiting
                      </Badge>
                    ) : (
                      <Badge bg="secondary" className="fs-6">
                        <XCircleFill className="me-1" />
                        Not Eligible for Auto-Recruiting
                      </Badge>
                    )}
                  </div>
                  {selectedApplicant.autoRecruitingReason && (
                    <div className="alert alert-info">
                      <ExclamationTriangleFill className="me-2" />
                      <strong>Reason:</strong> {selectedApplicant.autoRecruitingReason}
                    </div>
                  )}
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <h6 className="mb-3">Eligibility Criteria Breakdown</h6>
                  <Row>
                    <Col md={4}>
                      <div className="text-center p-3 border rounded">
                        {selectedApplicant.isFormerEmployee ? (
                          <CheckCircleFill className="text-success mb-2" size={24} />
                        ) : (
                          <XCircleFill className="text-muted mb-2" size={24} />
                        )}
                        <div className="fw-bold">Former Employee</div>
                        <small className="text-muted">1+ year since hire</small>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center p-3 border rounded">
                        {selectedApplicant.isStaleApplication ? (
                          <CheckCircleFill className="text-success mb-2" size={24} />
                        ) : (
                          <XCircleFill className="text-muted mb-2" size={24} />
                        )}
                        <div className="fw-bold">Stale Application</div>
                        <small className="text-muted">Most recent app 1+ month old</small>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center p-3 border rounded">
                        {selectedApplicant.isInactiveJob ? (
                          <CheckCircleFill className="text-success mb-2" size={24} />
                        ) : (
                          <XCircleFill className="text-muted mb-2" size={24} />
                        )}
                        <div className="fw-bold">Inactive Job</div>
                        <small className="text-muted">Applied to inactive job</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <div className="mt-3">
                <Row>
                  <Col md={6}>
                    <strong>Application Date:</strong>{' '}
                    {new Date(selectedApplicant.appliedAt).toLocaleDateString()}
                  </Col>
                  <Col md={6}>
                    <strong>Engagements:</strong> {selectedApplicant.numberEngagements}
                  </Col>
                  {selectedApplicant.hiredAt && (
                    <Col md={6}>
                      <strong>Hired Date:</strong>{' '}
                      {new Date(selectedApplicant.hiredAt).toLocaleDateString()}
                    </Col>
                  )}
                  {selectedApplicant.lastEngaged && (
                    <Col md={6}>
                      <strong>Last Engaged:</strong>{' '}
                      {new Date(selectedApplicant.lastEngaged).toLocaleDateString()}
                    </Col>
                  )}
                </Row>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApplicantSearchManager;
