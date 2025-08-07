import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useAuth } from '../../hooks/use-auth';
import DashboardLayout from '../../components/dashboard/layouts/layout/dashboard-layout';
import {
  Flag,
  Gear,
  Database,
  People,
  GraphUp,
  Shield,
  Phone,
  Grid3x3Gap,
  Search,
} from 'react-bootstrap-icons';
import Link from 'next/link';
import styles from './admin.module.css';
import { getAdminSidebarItems } from '../../utils/admin-sidebar-config';

const AdminDashboard = () => {
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

  const adminTools = [
    {
      title: 'Microservices',
      description: 'Access and manage microservice tools and administrative interfaces',
      icon: <Grid3x3Gap size={24} />,
      href: '/admin/microservices',
      status: 'Active',
      statusColor: 'primary',
    },
    {
      title: 'Feature Flags',
      description: 'Manage application feature flags and rollouts',
      icon: <Flag size={24} />,
      href: '/admin/feature-flags',
      status: 'Active',
      statusColor: 'success',
    },
    {
      title: 'Phone Numbers',
      description: 'View and manage Twilio phone numbers and their assignments',
      icon: <Phone size={24} />,
      href: '/admin/phone-numbers',
      status: 'Active',
      statusColor: 'success',
    },
    {
      title: 'Company Management',
      description: 'Manage companies and their phone number assignments',
      icon: <People size={24} />,
      href: '/admin/companies',
      status: 'Active',
      statusColor: 'success',
    },
    {
      title: 'User Management',
      description: 'Manage all users in the system and their administrative privileges',
      icon: <People size={24} />,
      href: '/admin/users',
      status: 'Active',
      statusColor: 'success',
    },
    {
      title: 'Applicant Search',
      description:
        'Search and view all applicants across the platform with auto-recruiting eligibility insights',
      icon: <Search size={24} />,
      href: '/admin/applicant-search',
      status: 'Active',
      statusColor: 'success',
    },
  ];

  return (
    <DashboardLayout sidebarItems={getAdminSidebarItems('Admin Tools')}>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="h3 mb-1">Admin Dashboard</h1>
            <p className="text-muted">Manage system-wide settings and configurations</p>
          </Col>
        </Row>

        <Row>
          {adminTools.map((tool, index) => (
            <Col key={index} xl={4} lg={6} md={6} sm={12} className="mb-4">
              <Card className={`h-100 ${styles.adminCard}`}>
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <div className={`${styles.iconWrapper} me-3`}>{tool.icon}</div>
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1">{tool.title}</h5>
                    </div>
                  </div>

                  <p className="card-text text-muted flex-grow-1">{tool.description}</p>

                  {tool.status === 'Active' ? (
                    <Link href={tool.href}>
                      <a className={`btn btn-primary ${styles.actionButton}`}>Access Tool</a>
                    </Link>
                  ) : (
                    <button className={`btn btn-outline-secondary ${styles.actionButton}`} disabled>
                      Coming Soon
                    </button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="mt-5">
          <Col>
            <Card className={styles.infoCard}>
              <Card.Body>
                <h6 className="card-title">
                  <Shield className="me-2" size={16} />
                  Security Notice
                </h6>
                <p className="card-text small text-muted mb-0">
                  This admin dashboard is restricted to super administrators only. All actions are
                  logged and monitored for security purposes.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default AdminDashboard;
