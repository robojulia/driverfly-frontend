import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../hooks/use-auth';
import DashboardLayout from '../../components/dashboard/layouts/layout/dashboard-layout';
import CompanyManager from '../../components/admin/CompanyManager';

const AdminCompanies = () => {
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
      name: 'Phone Numbers',
      pathname: '/admin/phone-numbers',
      icon: 'phone',
      text: 'Phone Numbers',
    },
    {
      name: 'Companies',
      pathname: '/admin/companies',
      icon: 'building',
      text: 'Companies',
    },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="h3 mb-1">Company Management</h1>
            <p className="text-muted">
              View and manage companies and their phone number assignments
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <CompanyManager />
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default AdminCompanies;
