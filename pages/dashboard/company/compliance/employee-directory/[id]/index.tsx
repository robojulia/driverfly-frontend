import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Badge, Button, Col, Container, FormControl, InputGroup, Row } from 'react-bootstrap';
import { ArrowLeft, Bell, PersonFill, Search, GearFill } from 'react-bootstrap-icons';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toast } from 'react-toastify';
import AdditionalFiles from '../../../../../../components/dashboard/employee-directory/additional-files';
import Background from '../../../../../../components/dashboard/employee-directory/background';
import DQF from '../../../../../../components/dashboard/employee-directory/dqf';
import HRFiles from '../../../../../../components/dashboard/employee-directory/hr-files';
import FullLayout from '../../../../../../components/dashboard/layouts/layout/full-layout';
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
        const data = await employeeApi.getById(Number(id));
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
    const complete = emp.documents?.length || 0;
    const pending = 5; // Mock - calculate based on required vs uploaded
    const overdue = 2; // Mock
    return { complete, pending, overdue };
  };

  const totalPending = getDocumentStats(employee).pending + getDocumentStats(employee).overdue;

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
            <Button variant="link" className="p-2 mr-3">
              <Bell size={18} />
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
                <div className="bg-white p-4 rounded">
                  <h4>
                    <Bell size={20} className="mr-2" />
                    {t('NOTIFICATIONS')}
                  </h4>
                  <p className="text-muted">{t('NOTIFICATIONS_DESCRIPTION')}</p>
                  {/* Notification settings will be added here */}
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
