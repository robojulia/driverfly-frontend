import React from 'react';
import { Alert, Badge, Card, Row, Col, Button } from 'react-bootstrap';
import { ExclamationTriangleFill, CheckCircleFill, ArrowRight } from 'react-bootstrap-icons';
import Link from 'next/link';
import { VehicleWithDueInspectionsDto } from '../../models/company/vehicle-with-due-inspections.dto';
import { useTranslation } from '../../hooks/use-translation';

interface DueInspectionsAlertProps {
  dueInspections: VehicleWithDueInspectionsDto[];
  isLoading: boolean;
}

export default function DueInspectionsAlert({
  dueInspections,
  isLoading,
}: DueInspectionsAlertProps) {
  const { t } = useTranslation();

  const formatDate = (date: Date | string): string => {
    if (!date) return 'N/A';

    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'Invalid Date';

      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <Alert variant="info" className="mb-4">
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          {t('Loading inspection status...')}
        </div>
      </Alert>
    );
  }

  if (!dueInspections || dueInspections.length === 0) {
    return (
      <Alert variant="success" className="mb-4">
        <div className="d-flex align-items-center">
          <CheckCircleFill className="me-2" size={20} />
          {t('All vehicles are up to date with their inspections')}
        </div>
      </Alert>
    );
  }

  const count = dueInspections.length;
  return (
    <div className="mb-4">
      <Alert variant="warning" className="mb-3">
        <div className="d-flex align-items-center">
          <ExclamationTriangleFill className="me-2" size={20} />
          <h5 className="mb-0">
            {count} vehicle{count > 1 ? 's' : ''} require attention
          </h5>
        </div>
      </Alert>

      <Row xs={1} md={2} lg={3} className="g-3">
        {dueInspections.map((item) => (
          <Col key={item.vehicle.id}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-start">
                  <span>
                    {item.vehicle.year} {item.vehicle.make} {item.vehicle.model}
                    {item.vehicle.unit_number && (
                      <div className="text-muted fs-6">Unit #{item.vehicle.unit_number}</div>
                    )}
                  </span>
                </Card.Title>
                <Card.Text>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {item.due_inspections.map((inspection) => (
                      <Badge key={inspection.id} bg="warning" text="dark">
                        {t(
                          `${inspection.inspection_type} inspection due ${formatDate(
                            inspection.due_date
                          )}`
                        )}
                      </Badge>
                    ))}
                  </div>
                </Card.Text>
                <Link
                  href={`/dashboard/company/settings/vehicles/${item.vehicle.id}`}
                  className="text-decoration-none"
                >
                  <Button variant="primary" className="w-100">
                    <div className="d-flex align-items-center justify-content-center">
                      <span>View Vehicle Details</span>
                      <ArrowRight className="ms-2" />
                    </div>
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
