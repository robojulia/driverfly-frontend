import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useAuth } from '../../hooks/use-auth';
import DashboardLayout from '../../components/dashboard/layouts/layout/dashboard-layout';
import {
  Grid3x3Gap,
  BoxArrowUpRight,
  Gear,
  Telephone,
  Robot,
  BarChart,
  Envelope,
  FileText,
  Cloud,
} from 'react-bootstrap-icons';
import styles from './admin.module.css';
import { getAdminSidebarItems } from '../../utils/admin-sidebar-config';

const microservices = [
  {
    id: 'driverfly-caller',
    name: 'Driverfly Caller',
    description:
      'Conversational AI and agent flow management system for voice and SMS interactions',
    url: 'https://thankful-sky-09414210f.2.azurestaticapps.net',
    icon: <Robot size={20} />,
    environment: 'Production',
  },
];

const AdminMicroservices = () => {
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

  const getEnvironmentVariant = (env: string) => {
    switch (env) {
      case 'Production':
        return 'success';
      case 'Development':
        return 'warning';
      case 'Planning':
        return 'secondary';
      default:
        return 'light';
    }
  };

  const handleOpenService = (service: (typeof microservices)[0]) => {
    window.open(service.url, '_blank', 'noopener,noreferrer');
  };

  // Group services by category
  return (
    <DashboardLayout sidebarItems={getAdminSidebarItems('Microservices')}>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center mb-3">
              <Grid3x3Gap size={32} className="text-primary me-3" />
              <div>
                <h1 className="h3 mb-1">Microservices Dashboard</h1>
                <p className="text-muted mb-0">
                  Access and manage distributed microservice tools and administrative interfaces
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Services by Category */}
        {microservices.map((service) => (
          <div key={service.id} className="mb-5">
            <Row>
              <Col key={service.id} xl={6} lg={6} md={12} sm={12} className="mb-4">
                <Card className={`h-100 ${styles.adminCard}`}>
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className={`${styles.iconWrapper} me-3`}>{service.icon}</div>
                        <div>
                          <h5 className="card-title mb-1">{service.name}</h5>
                          <div className="d-flex gap-2">
                            <Badge
                              bg={getEnvironmentVariant(service.environment)}
                              className="bg-opacity-75"
                            >
                              {service.environment}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="card-text text-muted mb-3">{service.description}</p>

                    <div className="mt-auto">
                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => handleOpenService(service)}
                      >
                        <BoxArrowUpRight className="me-2" size={16} />
                        Open Service
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        ))}
      </Container>
    </DashboardLayout>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default AdminMicroservices;
