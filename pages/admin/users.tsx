import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../hooks/use-auth';
import DashboardLayout from '../../components/dashboard/layouts/layout/dashboard-layout';
import UserManager from '../../components/admin/UserManager';

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

  // Simple sidebar items for admin
  const sidebarItems = [
    {
      name: 'Dashboard',
      pathname: '/dashboard/company',
      icon: 'home',
      text: 'Dashboard',
    },
    {
      name: 'Admin Tools',
      pathname: '/admin',
      icon: 'shield',
      text: 'Admin Tools',
    },
    {
      name: 'Companies',
      pathname: '/admin/companies',
      icon: 'building',
      text: 'Companies',
    },
    {
      name: 'Users',
      pathname: '/admin/users',
      icon: 'person',
      text: 'Users',
    },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
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
