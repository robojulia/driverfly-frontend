import React, { useState, useEffect } from 'react';
import { Alert, Badge, Button, Card, Modal, Spinner, Dropdown, Form } from 'react-bootstrap';
import {
  PersonFill,
  Building,
  Shield,
  ShieldFill,
  CheckCircleFill,
  XCircleFill,
  ThreeDotsVertical,
  TrashFill,
  ExclamationTriangleFill,
} from 'react-bootstrap-icons';
import ViewDataTable, { ViewTableColumn } from '../view-details/view-data-table';
import AdminUsersApi, { GdprDeleteUserResponse } from '../../pages/api/admin-users';
import { UserWithCompany } from '../../models/user/user-with-company.entity';
import { Status } from '../../enums/status.enum';

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<UserWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithCompany | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    type: 'grant' | 'revoke';
    user: UserWithCompany;
  } | null>(null);

  // GDPR deletion states
  const [showGdprModal, setShowGdprModal] = useState(false);
  const [gdprSelectedUser, setGdprSelectedUser] = useState<UserWithCompany | null>(null);
  const [gdprConfirmed, setGdprConfirmed] = useState(false);
  const [gdprLoading, setGdprLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const api = new AdminUsersApi();
      const userData = await api.getAllUsers();
      setUsers(userData);
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSuperAdminAction = (user: UserWithCompany, action: 'grant' | 'revoke') => {
    setPendingAction({ type: action, user });
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const handleGdprDelete = (user: UserWithCompany) => {
    setGdprSelectedUser(user);
    setGdprConfirmed(false);
    setShowGdprModal(true);
  };

  const confirmSuperAdminAction = async () => {
    if (!pendingAction) return;

    try {
      setActionLoading(pendingAction.user.id);
      const api = new AdminUsersApi();

      const newSuperAdminStatus = pendingAction.type === 'grant';
      await api.updateSuperAdminStatus(pendingAction.user.id, newSuperAdminStatus);

      // Update the user in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === pendingAction.user.id ? { ...user, super_admin: newSuperAdminStatus } : user
        )
      );

      // Close modal and reset state
      setShowConfirmModal(false);
      setPendingAction(null);
      setSelectedUser(null);
    } catch (err: any) {
      console.error('Failed to update super admin status:', err);
      setError(err.response?.data?.message || 'Failed to update super admin status');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmGdprDelete = async () => {
    if (!gdprSelectedUser || !gdprConfirmed) return;

    try {
      setGdprLoading(true);
      const api = new AdminUsersApi();

      const result: GdprDeleteUserResponse = await api.gdprDeleteUser(gdprSelectedUser.id);

      if (result.success) {
        // Show success message
        setError(null);

        // Close modal and reset state
        setShowGdprModal(false);
        setGdprSelectedUser(null);
        setGdprConfirmed(false);

        // Refresh the user list
        await loadData();
      } else {
        throw new Error(result.message || 'GDPR deletion failed');
      }
    } catch (err: any) {
      console.error('Failed to perform GDPR deletion:', err);
      setError(err.response?.data?.message || 'Failed to perform GDPR deletion');
    } finally {
      setGdprLoading(false);
    }
  };

  const renderUserInfo = (user: UserWithCompany) => (
    <div className="d-flex align-items-center">
      <PersonFill className="text-primary me-2" />
      <div>
        <div className="fw-bold">
          {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email}
        </div>
        <div className="text-muted small">{user.email}</div>
      </div>
    </div>
  );

  const renderCompanyInfo = (user: UserWithCompany) => {
    if (!user.company) {
      return <span className="text-muted">No company</span>;
    }

    return (
      <div className="d-flex align-items-center">
        <Building className="text-secondary me-2" size={14} />
        <div>
          <div className="fw-medium">{user.company.name}</div>
          {user.company.slug && <div className="text-muted small">{user.company.slug}</div>}
        </div>
      </div>
    );
  };

  const renderAdminStatus = (user: UserWithCompany) => (
    <div>
      {user.super_admin && (
        <Badge bg="danger" className="me-1">
          <ShieldFill size={12} className="me-1" />
          Super Admin
        </Badge>
      )}
      {user.company_admin && (
        <Badge bg="warning" className="me-1">
          <Shield size={12} className="me-1" />
          Company Admin
        </Badge>
      )}
      {!user.super_admin && !user.company_admin && <Badge bg="secondary">User</Badge>}
    </div>
  );

  const renderStatus = (user: UserWithCompany) => {
    let statusColor = 'secondary';
    let StatusIcon = XCircleFill;

    switch (user.status) {
      case Status.ACTIVE:
        statusColor = 'success';
        StatusIcon = CheckCircleFill;
        break;
      case Status.DEACTIVE:
        statusColor = 'warning';
        StatusIcon = XCircleFill;
        break;
      case Status.DISABLED:
        statusColor = 'danger';
        StatusIcon = XCircleFill;
        break;
      case Status.DELETED:
        statusColor = 'dark';
        StatusIcon = XCircleFill;
        break;
      default:
        statusColor = 'secondary';
        StatusIcon = XCircleFill;
    }

    return (
      <Badge bg={statusColor}>
        <StatusIcon size={12} className="me-1" />
        {user.status}
      </Badge>
    );
  };

  const isUserDeprecated = (user: UserWithCompany) => {
    return (
      user.status === Status.DELETED &&
      user.email.startsWith('deleted_user_') &&
      user.email.endsWith('@deleted.local')
    );
  };

  const renderActions = (user: UserWithCompany) => {
    const isLoading = actionLoading === user.id;

    // Don't show any actions for deprecated/GDPR deleted users
    if (isUserDeprecated(user)) {
      return (
        <div className="text-muted small">
          <em>No actions available</em>
        </div>
      );
    }

    return (
      <div className="d-flex gap-1 align-items-center">
        {user.super_admin ? (
          <Button
            variant="outline-danger"
            size="sm"
            disabled={isLoading}
            onClick={() => handleSuperAdminAction(user, 'revoke')}
          >
            {isLoading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <>
                <XCircleFill size={14} className="me-1" />
                Revoke Super Admin
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="outline-success"
            size="sm"
            disabled={isLoading}
            onClick={() => handleSuperAdminAction(user, 'grant')}
          >
            {isLoading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <>
                <CheckCircleFill size={14} className="me-1" />
                Grant Super Admin
              </>
            )}
          </Button>
        )}

        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" size="sm" id={`dropdown-${user.id}`}>
            <ThreeDotsVertical size={14} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => handleGdprDelete(user)}
              className="text-danger"
              disabled={user.status === Status.DELETED}
            >
              <TrashFill size={14} className="me-2" />
              GDPR Delete User
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const columns: ViewTableColumn<UserWithCompany>[] = [
    {
      id: 'user',
      name: 'User',
      selector: (row) => row.email,
      sortable: true,
      minWidth: '250px',
      cell: renderUserInfo,
    },
    {
      id: 'company',
      name: 'Company',
      selector: (row) => row.company?.name || '',
      sortable: true,
      minWidth: '200px',
      cell: renderCompanyInfo,
    },
    {
      id: 'adminStatus',
      name: 'Admin Status',
      sortable: false,
      minWidth: '150px',
      cell: renderAdminStatus,
    },
    {
      id: 'status',
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      minWidth: '100px',
      cell: renderStatus,
    },
    {
      id: 'createdAt',
      name: 'Created',
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
      minWidth: '120px',
      cell: (user) => new Date(user.created_at).toLocaleDateString(),
    },
    {
      id: 'actions',
      name: 'Actions',
      sortable: false,
      minWidth: '200px',
      cell: renderActions,
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
            <div>
              <h5 className="mb-0">
                <PersonFill className="me-2" />
                User Management
              </h5>
              <small className="text-muted">
                Manage all users in the system and their administrative privileges
              </small>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <ViewDataTable<UserWithCompany>
            columns={columns}
            items={users}
            columnSettingKey="admin.users.columns"
            description="Users in the system with their company affiliations and administrative privileges"
          />
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {pendingAction?.type === 'grant' ? 'Grant' : 'Revoke'} Super Admin Access
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pendingAction && selectedUser && (
            <div>
              <p>
                Are you sure you want to{' '}
                <strong>
                  {pendingAction.type === 'grant' ? 'grant' : 'revoke'} super admin access
                </strong>{' '}
                {pendingAction.type === 'grant' ? 'to' : 'from'}{' '}
                <strong>
                  {selectedUser.first_name && selectedUser.last_name
                    ? `${selectedUser.first_name} ${selectedUser.last_name}`
                    : selectedUser.email}
                </strong>
                ?
              </p>

              {pendingAction.type === 'grant' && (
                <Alert variant="warning" className="mb-0">
                  <small>
                    This will give the user full administrative privileges including the ability to
                    manage other users and system settings.
                  </small>
                </Alert>
              )}

              {pendingAction.type === 'revoke' && (
                <Alert variant="info" className="mb-0">
                  <small>
                    This will remove super admin privileges from the user. They will retain any
                    company admin privileges.
                  </small>
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button
            variant={pendingAction?.type === 'grant' ? 'success' : 'danger'}
            onClick={confirmSuperAdminAction}
            disabled={actionLoading !== null}
          >
            {actionLoading !== null ? (
              <Spinner size="sm" animation="border" className="me-2" />
            ) : null}
            {pendingAction?.type === 'grant' ? 'Grant Access' : 'Revoke Access'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* GDPR Deletion Modal */}
      <Modal
        show={showGdprModal}
        onHide={() => setShowGdprModal(false)}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <ExclamationTriangleFill className="me-2" />
            GDPR User Account Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {gdprSelectedUser && (
            <div>
              <Alert variant="danger" className="mb-4">
                <Alert.Heading className="h6">
                  <ExclamationTriangleFill className="me-2" />
                  WARNING: This action is IRREVERSIBLE
                </Alert.Heading>
                <p className="mb-0">
                  You are about to permanently delete all personal data for user{' '}
                  <strong>
                    {gdprSelectedUser.first_name && gdprSelectedUser.last_name
                      ? `${gdprSelectedUser.first_name} ${gdprSelectedUser.last_name}`
                      : gdprSelectedUser.email}
                  </strong>
                  . This operation cannot be undone.
                </p>
              </Alert>

              <div className="mb-4">
                <h6 className="text-danger mb-3">The following actions will be performed:</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <span className="badge bg-warning text-dark me-2">USER</span>
                    All personal information will be scrubbed (name, email, phone numbers)
                  </li>
                  <li className="mb-2">
                    <span className="badge bg-warning text-dark me-2">USER</span>
                    Account will be marked as DELETED and cannot be used for login
                  </li>
                  {gdprSelectedUser.company && (
                    <>
                      <li className="mb-2">
                        <span className="badge bg-danger me-2">COMPANY</span>
                        Company &quot;{gdprSelectedUser.company.name}&quot; will be deprecated and
                        disabled
                      </li>
                      <li className="mb-2">
                        <span className="badge bg-danger me-2">APPLICANTS</span>
                        All applicant records linked to this user will be permanently deleted
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <Alert variant="info" className="mb-4">
                <Alert.Heading className="h6">Data Retention Policy</Alert.Heading>
                <p className="mb-0">
                  This action complies with GDPR &quot;Right to Erasure&quot; requirements. Some
                  audit logs may be retained for legal compliance purposes but will not contain
                  personally identifiable information.
                </p>
              </Alert>

              <div className="border p-3 bg-light rounded">
                <Form.Check
                  type="checkbox"
                  id="gdpr-confirm-checkbox"
                  checked={gdprConfirmed}
                  onChange={(e) => setGdprConfirmed(e.target.checked)}
                  label={
                    <span>
                      I understand that this action is <strong>irreversible</strong> and will
                      permanently delete all user data, deprecate their company, and remove all
                      associated applicant records. I confirm that I have the authority to perform
                      this GDPR deletion.
                    </span>
                  }
                  className="user-select-none"
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowGdprModal(false)}
            disabled={gdprLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmGdprDelete}
            disabled={!gdprConfirmed || gdprLoading}
          >
            {gdprLoading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <TrashFill className="me-2" />
                Permanently Delete User Data
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserManager;
