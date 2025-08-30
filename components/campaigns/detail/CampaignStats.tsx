import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import {
  PeopleFill,
  CheckCircleFill,
  ExclamationTriangleFill,
  SendFill,
} from 'react-bootstrap-icons';
import styles from './CampaignStats.module.css';

interface CampaignStatsProps {
  stats: {
    totalTargets: number;
    sentCount: number;
    deliveredCount: number;
    failedCount: number;
  };
}

const CampaignStats: React.FC<CampaignStatsProps> = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Targets',
      value: stats.totalTargets,
      icon: <PeopleFill />,
      color: 'primary',
      bgColor: '#e3f2fd',
    },
    {
      label: 'Sent',
      value: stats.sentCount,
      icon: <SendFill />,
      color: 'info',
      bgColor: '#e0f7fa',
    },
    {
      label: 'Delivered',
      value: stats.deliveredCount,
      icon: <CheckCircleFill />,
      color: 'success',
      bgColor: '#e8f5e8',
    },
    {
      label: 'Failed',
      value: stats.failedCount,
      icon: <ExclamationTriangleFill />,
      color: 'danger',
      bgColor: '#ffebee',
    },
  ];

  return (
    <Row className={`mb-4 ${styles.statsRow}`}>
      {statCards.map((stat, index) => (
        <Col key={index} md={3} sm={6} className="mb-3">
          <Card className={`${styles.statCard} border-0 shadow-sm h-100`}>
            <CardBody className={`${styles.statCardBody} text-center py-4`}>
              <div
                className={styles.statIcon}
                style={{ backgroundColor: stat.bgColor, color: `var(--bs-${stat.color})` }}
              >
                {stat.icon}
              </div>
              <h2
                className={`${styles.statValue} mb-2 fw-bold`}
                style={{ color: `var(--bs-${stat.color})` }}
              >
                {stat.value.toLocaleString()}
              </h2>
              <small className={`${styles.statLabel} text-muted fw-semibold`}>{stat.label}</small>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CampaignStats;
