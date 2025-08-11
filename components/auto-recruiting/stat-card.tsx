import React from 'react';
import { Card, CardBody } from 'reactstrap';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, iconColor = 'text-primary' }) => {
  return (
    <div className="col-md-4 mb-3">
      <Card className="text-center border-0 bg-light">
        <CardBody>
          <div className={`mb-2 ${iconColor}`}>{icon}</div>
          <h5 className="mb-1">{value}</h5>
          <small className="text-muted">{label}</small>
        </CardBody>
      </Card>
    </div>
  );
};

export default StatCard;
