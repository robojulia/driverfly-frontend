import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import {
  PersonFill,
  TrophyFill,
  ShieldFillCheck,
  ShieldFillX,
  StarFill,
  ExclamationTriangleFill,
  CheckCircleFill,
  ClockFill,
} from 'react-bootstrap-icons';
import { ApplicantStats } from '../../pages/api/job-analytics';

interface ApplicantStatsPanelProps {
  stats: ApplicantStats | null;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  iconBg: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subtext, iconBg, iconColor }) => (
  <Col xs={6} lg={3} className="mb-3">
    <div
      className="d-flex align-items-center gap-3 p-3 rounded"
      style={{ backgroundColor: '#f8fafc', border: '1px solid #e9ecef' }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          backgroundColor: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ color: iconColor, fontSize: '1.1rem' }}>{icon}</span>
      </div>
      <div>
        <div className="fw-bold fs-5 lh-1 mb-1">{value}</div>
        <div className="text-muted" style={{ fontSize: '0.78rem' }}>
          {label}
        </div>
        {subtext && (
          <div className="text-muted" style={{ fontSize: '0.7rem' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  </Col>
);

function fmtPct(val: number | null): string {
  if (val === null || val === undefined) return 'N/A';
  return `${val.toFixed(1)}%`;
}

function fmtNum(val: number | null, decimals = 1): string {
  if (val === null || val === undefined) return 'N/A';
  return val.toFixed(decimals);
}

export const ApplicantStatsPanel: React.FC<ApplicantStatsPanelProps> = ({ stats }) => {
  const s = stats ?? {
    totalApplicants: 0,
    averageAge: null,
    averageYearsCdlExperience: null,
    percentageWithCorrectCdlType: null,
    percentageCanPassDrugTest: null,
    percentageNoDui: null,
    percentageCleanAccidentRecord: null,
    percentageNoViolations: null,
  };

  return (
    <Row>
      <StatCard
        icon={<PersonFill />}
        label="Total Applicants"
        value={s.totalApplicants.toLocaleString()}
        subtext="for this job listing"
        iconBg="#e8f4fd"
        iconColor="#1d4355"
      />
      <StatCard
        icon={<ClockFill />}
        label="Average Age"
        value={s.averageAge !== null ? `${fmtNum(s.averageAge, 0)} yrs` : 'N/A'}
        subtext="across all applicants"
        iconBg="#e8f8f7"
        iconColor="#2ec8c4"
      />
      <StatCard
        icon={<StarFill />}
        label="Avg CDL Experience"
        value={
          s.averageYearsCdlExperience !== null
            ? `${fmtNum(s.averageYearsCdlExperience, 1)} yrs`
            : 'N/A'
        }
        subtext="years with CDL"
        iconBg="#f0fdf4"
        iconColor="#6bcb77"
      />
      <StatCard
        icon={<TrophyFill />}
        label="Correct CDL Type"
        value={fmtPct(s.percentageWithCorrectCdlType)}
        subtext="match job requirements"
        iconBg={
          s.percentageWithCorrectCdlType !== null && s.percentageWithCorrectCdlType >= 70
            ? '#f0fdf4'
            : '#fff8e6'
        }
        iconColor={
          s.percentageWithCorrectCdlType !== null && s.percentageWithCorrectCdlType >= 70
            ? '#6bcb77'
            : '#ff9f43'
        }
      />
      <StatCard
        icon={<ShieldFillCheck />}
        label="Pass Drug Test"
        value={fmtPct(s.percentageCanPassDrugTest)}
        subtext="self-reported"
        iconBg={
          s.percentageCanPassDrugTest !== null && s.percentageCanPassDrugTest >= 90
            ? '#f0fdf4'
            : '#fff3f3'
        }
        iconColor={
          s.percentageCanPassDrugTest !== null && s.percentageCanPassDrugTest >= 90
            ? '#6bcb77'
            : '#ff6b6b'
        }
      />
      <StatCard
        icon={<ShieldFillX />}
        label="No DUI History"
        value={fmtPct(s.percentageNoDui)}
        subtext="of applicants"
        iconBg={
          s.percentageNoDui !== null && s.percentageNoDui >= 90
            ? '#f0fdf4'
            : '#fff3f3'
        }
        iconColor={
          s.percentageNoDui !== null && s.percentageNoDui >= 90
            ? '#6bcb77'
            : '#ff6b6b'
        }
      />
      <StatCard
        icon={<CheckCircleFill />}
        label="Clean Accident Record"
        value={fmtPct(s.percentageCleanAccidentRecord)}
        subtext="no reported accidents"
        iconBg={
          s.percentageCleanAccidentRecord !== null &&
          s.percentageCleanAccidentRecord >= 80
            ? '#f0fdf4'
            : '#fff8e6'
        }
        iconColor={
          s.percentageCleanAccidentRecord !== null &&
          s.percentageCleanAccidentRecord >= 80
            ? '#6bcb77'
            : '#ff9f43'
        }
      />
      <StatCard
        icon={<ExclamationTriangleFill />}
        label="No Violations"
        value={fmtPct(s.percentageNoViolations)}
        subtext="no moving violations"
        iconBg={
          s.percentageNoViolations !== null && s.percentageNoViolations >= 80
            ? '#f0fdf4'
            : '#fff8e6'
        }
        iconColor={
          s.percentageNoViolations !== null && s.percentageNoViolations >= 80
            ? '#6bcb77'
            : '#ff9f43'
        }
      />
    </Row>
  );
};
