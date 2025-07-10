import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../hooks/use-auth';
import DashboardLayout from '../../components/dashboard/layouts/layout/dashboard-layout';
import UserManager from '../../components/admin/UserManager';
import { getAdminSidebarItems } from '../../utils/admin-sidebar-config';

const AdminUsers = () => {
  const { user, isSuperAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSuperAdmin) {
      router.push('/dashboard');
    }
  }, [isSuperAdmin, router]);

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <DashboardLayout sidebarItems={getAdminSidebarItems('Users')}>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="h3 mb-1">User Management</h1>
            <p className="text-muted">
              View and manage all users in the system and their administrative privileges
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <UserManager />
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default AdminUsers;
