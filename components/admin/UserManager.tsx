import React, { useState, useEffect } from 'react';
import { Alert, Badge, Button, Card, Modal, Spinner } from 'react-bootstrap';
import {
  PersonFill,
  Building,
  Shield,
  ShieldFill,
  CheckCircleFill,
  XCircleFill,
} from 'react-bootstrap-icons';
import ViewDataTable, { ViewTableColumn } from '../view-details/view-data-table';
import AdminUsersApi from '../../pages/api/admin-users';
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

  const renderActions = (user: UserWithCompany) => {
    const isLoading = actionLoading === user.id;

    return (
      <div className="d-flex gap-1">
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
    </>
  );
};

export default UserManager;
