import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../hooks/use-auth';
import DashboardLayout from '../../components/dashboard/layouts/layout/dashboard-layout';
import ApplicantSearchManager from '../../components/admin/ApplicantSearchManager';
import { getAdminSidebarItems } from '../../utils/admin-sidebar-config';

const AdminApplicantSearch = () => {
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
    <DashboardLayout sidebarItems={getAdminSidebarItems('Applicant Search')}>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="h3 mb-1">Applicant Search</h1>
            <p className="text-muted">
              Search and view all applicants across the platform with auto-recruiting eligibility
              insights
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <ApplicantSearchManager />
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default AdminApplicantSearch;
