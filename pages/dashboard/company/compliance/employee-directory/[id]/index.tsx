import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Badge, Button, Col, Container, FormControl, InputGroup, Row } from 'react-bootstrap';
import { ArrowLeft, Bell, PersonFill, Search, GearFill, ChatDots } from 'react-bootstrap-icons';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toast } from 'react-toastify';
import AdditionalFiles from '../../../../../../components/dashboard/employee-directory/additional-files';
import Background from '../../../../../../components/dashboard/employee-directory/background';
import DQF from '../../../../../../components/dashboard/employee-directory/dqf';
import HRFiles from '../../../../../../components/dashboard/employee-directory/hr-files';
import FullLayout from '../../../../../../components/dashboard/layouts/layout/full-layout';
import { EmployeeMessages } from '../../../../../../components/employees/employee-messages';
import { EmployeeStatus } from '../../../../../../enums/applicants/employee-status.enum';
import { useAuth } from '../../../../../../hooks/use-auth';
import { useTranslation } from '../../../../../../hooks/use-translation';
import { EmployeeEntity } from '../../../../../../models/employee/employee.entity';
import EmployeeApi from '../../../../../api/employee';
import { useEffectAsync } from '../../../../../../utils/react';
import { Pagination, PagingMeta } from '../../../../../../types/pagination.type';

export default function EmployeeDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const { user, hasPermission } = useAuth();
  const employeeApi = new EmployeeApi();

  const [employee, setEmployee] = useState<EmployeeEntity | null>(null);
  const [employees, setEmployees] = useState<EmployeeEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffectAsync(async () => {
    if (id && user) {
      try {
        const data = await employeeApi.getById(Number(id), ['notes', 'notes.user']);
        setEmployee(data);

        // Fetch employee list for sidebar
        const employeeList = await employeeApi.list({
          status: [EmployeeStatus.ACTIVE],
          is_paginated: true,
          limit: 100,
          page: 1,
        });
        setEmployees((employeeList as Pagination<EmployeeEntity>)?.items || []);
      } catch (error) {
        toast.error(t('ERROR_LOADING_EMPLOYEE'));
        router.push('/dashboard/company/compliance/employee-directory');
      } finally {
        setLoading(false);
      }
    }
  }, [id, user]);

  const onBackClick = () => {
    router.push('/dashboard/company/compliance/employee-directory');
  };

  const onEditClick = () => {
    router.push(`/dashboard/company/compliance/employee-directory/${id}/edit`);
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!employee) {
    return null;
  }

  const filteredEmployees = employees.filter(emp =>
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDocumentStats = (emp: EmployeeEntity) => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    let pending = 0;
    let overdue = 0;

    // Check license expiration
    if (emp.license_expiry) {
      const expiryDate = new Date(emp.license_expiry);
      if (expiryDate <= now) {
        overdue++; // Already expired
      } else if (expiryDate <= thirtyDaysFromNow) {
        pending++; // Expiring within 30 days
      }
    } else {
      overdue++; // Missing license expiry is critical
    }

    // Check for required documents
    const hasDriverLicense = emp.documents?.some(doc => doc.type === 'DRIVER_LICENSE');
    const hasMedicalCard = emp.documents?.some(doc => doc.type === 'MEDICAL_CARD');
    const hasMVR = emp.documents?.some(doc => doc.type === 'MVR');

    if (!hasDriverLicense) overdue++;
    if (!hasMedicalCard) overdue++;
    if (!hasMVR) overdue++;

    const complete = emp.documents?.length || 0;

    return { complete, pending, overdue };
  };

  // Calculate compliance notifications (recent uploads + outstanding items)
  const getComplianceNotifications = (emp: EmployeeEntity) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Count recent uploads (last 7 days)
    const recentUploads = emp.documents?.filter(doc => {
      const uploadDate = new Date(doc.created_at);
      return uploadDate >= sevenDaysAgo;
    }).length || 0;

    // Use the same stats from getDocumentStats
    const stats = getDocumentStats(emp);
    const outstandingCount = stats.pending + stats.overdue;

    return {
      total: recentUploads + outstandingCount,
      recentUploads,
      outstanding: outstandingCount,
      pending: stats.pending,
      overdue: stats.overdue
    };
  };

  const totalPending = getDocumentStats(employee).pending + getDocumentStats(employee).overdue;
  const complianceNotifications = getComplianceNotifications(employee);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #dee2e6', backgroundColor: '#fff', padding: '1rem 1.5rem' }}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <PersonFill size={20} className="mr-2" />
            <h4 className="mb-0 font-weight-bold">Driver Management</h4>
            {totalPending > 0 && (
              <Badge bg="danger" className="ml-3" style={{ fontSize: '0.75rem' }}>
                {totalPending} Pending
              </Badge>
            )}
          </div>
          <div className="d-flex align-items-center">
            <Button variant="link" className="p-2 mr-2">
              <GearFill size={18} />
            </Button>
            <Button
              variant="link"
              className="p-2 mr-3"
              onClick={() => setSelectedTabIndex(6)}
              style={{ position: 'relative' }}
            >
              <Bell size={18} />
              {complianceNotifications.total > 0 && (
                <Badge
                  bg="danger"
                  pill
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    fontSize: '0.65rem',
                    padding: '0.25rem 0.4rem',
                    minWidth: '18px'
                  }}
                >
                  {complianceNotifications.total}
                </Badge>
              )}
            </Button>
            <Button variant="primary" size="sm">
              + Add Employee
            </Button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar - Employee List */}
        <div style={{
          width: '280px',
          backgroundColor: '#fff',
          borderRight: '1px solid #dee2e6',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1rem' }}>
            <h6 className="font-weight-bold mb-3">Employees</h6>
            <InputGroup size="sm">
              <InputGroup.Text style={{ backgroundColor: '#fff', border: '1px solid #ced4da' }}>
                <Search size={14} />
              </InputGroup.Text>
              <FormControl
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              />
            </InputGroup>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem 1rem' }}>
            {filteredEmployees.map((emp) => {
              const stats = getDocumentStats(emp);
              const isSelected = emp.id === employee.id;

              return (
                <div
                  key={emp.id}
                  onClick={() => router.push(`/dashboard/company/compliance/employee-directory/${emp.id}`)}
                  style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#e7f3ff' : 'transparent',
                    border: isSelected ? '1px solid #0d6efd' : '1px solid transparent',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div className="font-weight-bold" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {emp.first_name} {emp.last_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                    {emp.job?.title || 'No Position'}
                  </div>
                  <div className="d-flex flex-wrap" style={{ gap: '0.25rem' }}>
                    <Badge bg="success" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                      {stats.complete} Done
                    </Badge>
                    {stats.pending > 0 && (
                      <Badge bg="warning" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                        {stats.pending} Pending
                      </Badge>
                    )}
                    {stats.overdue > 0 && (
                      <Badge bg="danger" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                        {stats.overdue} Overdue
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Container fluid className="p-0">
            <Tabs
              selectedIndex={selectedTabIndex}
              onSelect={(index) => setSelectedTabIndex(index)}
              className="employee-detail-tabs"
            >
              <TabList className="employee-tab-list">
                <Tab>
                  <div className="d-flex align-items-center justify-content-center">
                    <PersonFill size={16} className="mr-2" />
                    Background
                  </div>
                </Tab>
                <Tab>DQF</Tab>
                <Tab>HR Files</Tab>
                <Tab>Additional</Tab>
                <Tab>All Files</Tab>
                <Tab>
                  <div className="d-flex align-items-center justify-content-center">
                    <ChatDots size={16} className="mr-2" />
                    Messages
                  </div>
                </Tab>
                <Tab><Bell size={16} /></Tab>
              </TabList>

              <TabPanel>
                <Background employee={employee} />
              </TabPanel>

              <TabPanel>
                <DQF
                  employee={employee}
                  canEdit={employee.status === EmployeeStatus.ACTIVE}
                  canEditSafetyPerformance
                  showHistory={true}
                />
              </TabPanel>

              <TabPanel>
                <HRFiles
                  employee={employee}
                  canEdit={employee.status === EmployeeStatus.ACTIVE}
                />
              </TabPanel>

              <TabPanel>
                <AdditionalFiles
                  employee={employee}
                  canEdit={employee.status === EmployeeStatus.ACTIVE}
                />
              </TabPanel>

              <TabPanel>
                <div className="bg-white p-4 rounded">
                  <h4>{t('ALL_FILES')}</h4>
                  <p className="text-muted">{t('ALL_FILES_DESCRIPTION')}</p>
                  {/* All Files content showing DQF + HR + Additional Files combined */}
                  <DQF
                    employee={employee}
                    canEdit={employee.status === EmployeeStatus.ACTIVE}
                    canEditSafetyPerformance
                    showHistory={true}
                    title="DQF_DOCUMENTS"
                  />
                  <div className="mt-4">
                    <HRFiles
                      employee={employee}
                      canEdit={employee.status === EmployeeStatus.ACTIVE}
                    />
                  </div>
                  <div className="mt-4">
                    <AdditionalFiles
                      employee={employee}
                      canEdit={employee.status === EmployeeStatus.ACTIVE}
                    />
                  </div>
                </div>
              </TabPanel>

              <TabPanel>
                <EmployeeMessages employee={employee} />
              </TabPanel>

              <TabPanel>
                <div className="bg-white rounded" style={{ padding: '1.5rem' }}>
                  <h4 className="mb-3">
                    <Bell size={20} className="mr-2" />
                    Compliance Updates
                  </h4>

                  {/* Recent Document Uploads */}
                  {complianceNotifications.recentUploads > 0 && (
                    <div className="mb-4">
                      <h6 className="font-weight-bold mb-3" style={{ color: '#198754' }}>
                        Recent Uploads ({complianceNotifications.recentUploads})
                      </h6>
                      <div className="list-group">
                        {employee.documents
                          ?.filter(doc => {
                            const uploadDate = new Date(doc.created_at);
                            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                            return uploadDate >= sevenDaysAgo;
                          })
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .map(doc => (
                            <div
                              key={doc.id}
                              className="list-group-item d-flex justify-content-between align-items-start"
                            >
                              <div>
                                <div className="font-weight-bold">{doc.name}</div>
                                <small className="text-muted">
                                  Uploaded {new Date(doc.created_at).toLocaleDateString()} at{' '}
                                  {new Date(doc.created_at).toLocaleTimeString()}
                                </small>
                              </div>
                              <Badge bg="success">New</Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Outstanding Items */}
                  {complianceNotifications.outstanding > 0 && (
                    <div className="mb-4">
                      <h6 className="font-weight-bold mb-3" style={{ color: '#dc3545' }}>
                        Outstanding Items ({complianceNotifications.outstanding})
                        {complianceNotifications.pending > 0 && (
                          <Badge bg="warning" className="ml-2" style={{ fontSize: '0.75rem' }}>
                            {complianceNotifications.pending} Pending
                          </Badge>
                        )}
                        {complianceNotifications.overdue > 0 && (
                          <Badge bg="danger" className="ml-2" style={{ fontSize: '0.75rem' }}>
                            {complianceNotifications.overdue} Overdue
                          </Badge>
                        )}
                      </h6>
                      <div className="list-group">
                        {/* License Expiration - Check if expired or expiring */}
                        {employee.license_expiry && (() => {
                          const expiryDate = new Date(employee.license_expiry);
                          const now = new Date();
                          const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

                          if (expiryDate <= now) {
                            return (
                              <div className="list-group-item d-flex justify-content-between align-items-start">
                                <div>
                                  <div className="font-weight-bold">Driver License Expired</div>
                                  <small className="text-muted">
                                    Expired: {expiryDate.toLocaleDateString()}
                                  </small>
                                </div>
                                <Badge bg="danger">Overdue</Badge>
                              </div>
                            );
                          } else if (expiryDate <= thirtyDaysFromNow) {
                            return (
                              <div className="list-group-item d-flex justify-content-between align-items-start">
                                <div>
                                  <div className="font-weight-bold">Driver License Expiring Soon</div>
                                  <small className="text-muted">
                                    Expires: {expiryDate.toLocaleDateString()}
                                  </small>
                                </div>
                                <Badge bg="warning">Pending</Badge>
                              </div>
                            );
                          }
                          return null;
                        })()}
                        {!employee.license_expiry && (
                          <div className="list-group-item d-flex justify-content-between align-items-start">
                            <div>
                              <div className="font-weight-bold">Driver License Expiry Date Missing</div>
                              <small className="text-muted">Please update license expiry information</small>
                            </div>
                            <Badge bg="danger">Overdue</Badge>
                          </div>
                        )}

                        {/* Missing Documents */}
                        {!employee.documents?.some(doc => doc.type === 'DRIVER_LICENSE') && (
                          <div className="list-group-item d-flex justify-content-between align-items-start">
                            <div>
                              <div className="font-weight-bold">Driver License Document</div>
                              <small className="text-muted">Upload required driver license document</small>
                            </div>
                            <Badge bg="danger">Overdue</Badge>
                          </div>
                        )}
                        {!employee.documents?.some(doc => doc.type === 'MEDICAL_CARD') && (
                          <div className="list-group-item d-flex justify-content-between align-items-start">
                            <div>
                              <div className="font-weight-bold">Medical Card</div>
                              <small className="text-muted">Upload required medical card document</small>
                            </div>
                            <Badge bg="danger">Overdue</Badge>
                          </div>
                        )}
                        {!employee.documents?.some(doc => doc.type === 'MVR') && (
                          <div className="list-group-item d-flex justify-content-between align-items-start">
                            <div>
                              <div className="font-weight-bold">Motor Vehicle Record (MVR)</div>
                              <small className="text-muted">Upload required MVR document</small>
                            </div>
                            <Badge bg="danger">Overdue</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* No Updates */}
                  {complianceNotifications.total === 0 && (
                    <div className="text-center py-5">
                      <Bell size={48} className="text-muted mb-3" />
                      <h5 className="text-muted">All Caught Up!</h5>
                      <p className="text-muted">
                        No recent document uploads or outstanding compliance items for {employee.first_name} {employee.last_name}.
                      </p>
                    </div>
                  )}
                </div>
              </TabPanel>
            </Tabs>
          </Container>
        </div>
      </div>

      <style>{`
        .employee-detail-tabs {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .employee-detail-tabs .employee-tab-list {
          display: flex;
          gap: 0;
          margin: 0;
          border-bottom: 1px solid #dee2e6;
          background-color: #fff;
          padding: 0 1.5rem;
          list-style: none;
          flex-shrink: 0;
        }

        .employee-detail-tabs .react-tabs__tab {
          padding: 1rem 1.5rem;
          cursor: pointer;
          border: none;
          outline: none;
          text-align: center;
          transition: all 0.2s ease;
          color: #6c757d;
          font-size: 0.9rem;
          background: transparent;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .employee-detail-tabs .react-tabs__tab:hover {
          color: #495057;
          border-bottom-color: #dee2e6;
        }

        .employee-detail-tabs .react-tabs__tab--selected {
          color: #0d6efd;
          border-bottom-color: #0d6efd;
          font-weight: 500;
        }

        .employee-detail-tabs .react-tabs__tab:focus:after {
          display: none !important;
        }

        .employee-detail-tabs .react-tabs__tab-panel {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          background-color: #f8f9fa;
        }

        .employee-detail-tabs .react-tabs__tab-panel--selected {
          display: block;
        }

        /* Remove all gray backgrounds from tables */
        .employee_directory_tabs table {
          background-color: #fff !important;
        }

        .employee_directory_tabs table thead {
          background-color: #fff !important;
        }

        .employee_directory_tabs table tbody {
          background-color: #fff !important;
        }

        .employee_directory_tabs table tr {
          background-color: #fff !important;
        }

        .employee_directory_tabs table td,
        .employee_directory_tabs table th {
          background-color: #fff !important;
        }

        /* Remove Bootstrap striped table styling */
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: #fff !important;
        }

        .table-striped tbody tr:nth-of-type(even) {
          background-color: #fff !important;
        }
      `}</style>
    </div>
  );
}

EmployeeDetailPage.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
