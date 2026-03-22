import React, { useEffect, useState } from 'react';
import {
  Modal,
  Spinner,
  Alert,
  ProgressBar,
  Badge,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
} from 'react-bootstrap';
import {
  InfoCircle,
  ArrowUpCircleFill,
  ArrowDownCircleFill,
  DashCircleFill,
  TrophyFill,
  PeopleFill,
  ClockFill,
  PersonCheckFill,
  GraphUpArrow,
  ExclamationTriangleFill,
  FileEarmarkPersonFill,
  ShareFill,
} from 'react-bootstrap-icons';
import UserApi, { RecruiterScore, ScoreMetric } from '../../pages/api/user';
import { UserEntity } from '../../models/user/user.entity';

interface Props {
  user: UserEntity | null;
  show: boolean;
  onHide: () => void;
}

const METRIC_ICONS: Record<string, React.ComponentType<any>> = {
  lead_response_time: ClockFill,
  lead_progression: GraphUpArrow,
  qualification_reversal: ExclamationTriangleFill,
  hires_placed: PersonCheckFill,
  profile_thoroughness: FileEarmarkPersonFill,
  referred_leads: ShareFill,
  digital_app_conversion: PeopleFill,
};

function scoreColor(score: number): string {
  if (score >= 75) return '#198754'; // green
  if (score >= 50) return '#ffc107'; // yellow
  return '#dc3545'; // red
}

function scoreVariant(score: number): 'success' | 'warning' | 'danger' {
  if (score >= 75) return 'success';
  if (score >= 50) return 'warning';
  return 'danger';
}

function percentileLabel(p: number): string {
  if (p >= 90) return 'Top 10%';
  if (p >= 75) return 'Top 25%';
  if (p >= 50) return 'Above Average';
  if (p >= 25) return 'Below Average';
  return 'Bottom 25%';
}

function OverallScoreRing({ score, percentile }: { score: number; percentile: number }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const filled = circumference * (score / 100);
  const color = scoreColor(score);

  return (
    <div className="text-center mb-3">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#e9ecef" strokeWidth="12" />
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text x="65" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill={color}>
          {Math.round(score)}
        </text>
        <text x="65" y="78" textAnchor="middle" fontSize="11" fill="#6c757d">
          / 100
        </text>
      </svg>
      <div className="mt-1">
        <Badge
          style={{ backgroundColor: color, fontSize: '0.75rem' }}
          className="px-2 py-1"
        >
          <TrophyFill size={11} className="me-1" />
          {percentileLabel(percentile)} — {Math.round(percentile)}th percentile
        </Badge>
      </div>
    </div>
  );
}

function MetricRow({ metric }: { metric: ScoreMetric }) {
  const Icon = METRIC_ICONS[metric.key] || InfoCircle;
  const variant = scoreVariant(metric.score);

  const TrendIcon =
    metric.score >= 75
      ? ArrowUpCircleFill
      : metric.score >= 50
      ? DashCircleFill
      : ArrowDownCircleFill;

  const trendColor = scoreColor(metric.score);

  return (
    <div className="mb-3 p-3 border rounded bg-light">
      <div className="d-flex align-items-start justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          <Icon size={16} style={{ color: trendColor, flexShrink: 0 }} />
          <div>
            <div className="fw-semibold small">{metric.label}</div>
            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
              {metric.description}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-2">
          <TrendIcon size={14} style={{ color: trendColor }} />
          <span className="fw-bold small" style={{ color: trendColor }}>
            {Math.round(metric.score)}
          </span>

          <OverlayTrigger
            placement="left"
            overlay={
              <Tooltip id={`tooltip-${metric.key}`}>
                <div className="text-start" style={{ fontSize: '0.78rem' }}>
                  <strong>How it&apos;s calculated:</strong>
                  <br />
                  {metric.howCalculated}
                </div>
              </Tooltip>
            }
          >
            <InfoCircle size={13} className="text-muted" style={{ cursor: 'help' }} />
          </OverlayTrigger>
        </div>
      </div>

      <ProgressBar
        now={metric.score}
        variant={variant}
        style={{ height: '6px' }}
        className="mb-2"
      />

      <div className="d-flex justify-content-between" style={{ fontSize: '0.72rem' }}>
        <span className="text-muted">
          You:{' '}
          <span className="fw-semibold text-dark">
            {metric.rawValue !== null ? metric.rawValueLabel : '—'}
          </span>
        </span>
        <span className="text-muted">
          Team avg:{' '}
          <span className="fw-semibold text-dark">
            {metric.companyAvgValue !== null ? metric.companyAvgLabel : '—'}
          </span>
        </span>
        <span className="text-muted" style={{ opacity: 0.6 }}>
          Weight: {Math.round(metric.weight * 100)}%
        </span>
      </div>
    </div>
  );
}

export function RecruiterScoreModal({ user, show, onHide }: Props) {
  const [score, setScore] = useState<RecruiterScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!show || !user?.id) return;

    setLoading(true);
    setError(null);
    setScore(null);

    const api = new UserApi();
    api
      .getScore(user.id)
      .then((data) => setScore(data))
      .catch((err) => {
        console.error('Failed to load recruiter score', err);
        setError(err?.response?.data?.message || 'Unable to load score data.');
      })
      .finally(() => setLoading(false));
  }, [show, user?.id]);

  const userName = user?.name || user?.email || 'User';

  return (
    <Modal show={show} onHide={onHide} centered size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: '1rem' }}>
          <TrophyFill className="me-2 text-warning" />
          Performance Score — {userName}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading && (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" />
          </div>
        )}

        {error && (
          <Alert variant="danger">
            <ExclamationTriangleFill className="me-2" />
            {error}
          </Alert>
        )}

        {score && (
          <>
            <Row className="align-items-center mb-3">
              <Col xs={12} sm={4} className="text-center">
                <OverallScoreRing score={score.overallScore} percentile={score.percentile} />
                <div className="text-muted small mt-1">Period: {score.period}</div>
              </Col>
              <Col xs={12} sm={8}>
                <p className="text-muted small mb-3">
                  This score is calculated from{' '}
                  <strong>{score.metrics.length} performance metrics</strong> and compared against
                  all active recruiters in your company. Scores update daily. Hover the{' '}
                  <InfoCircle size={12} /> icon on each metric to learn how it is calculated.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  {score.metrics.map((m) => (
                    <div key={m.key} className="d-flex align-items-center gap-1">
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: scoreColor(m.score),
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '0.72rem' }} className="text-muted">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>

            <hr />

            <div className="mb-1 text-muted fw-semibold small text-uppercase letter-spacing-1">
              Metric Breakdown
            </div>

            {score.metrics.map((metric) => (
              <MetricRow key={metric.key} metric={metric} />
            ))}

            <Alert variant="info" className="mt-3 mb-0 small">
              <InfoCircle className="me-2" />
              All metrics use <strong>comparative scoring</strong> — your raw values are compared
              against your team&apos;s distribution to produce a 0–100 score for each metric. A
              score of 50 is exactly average for your team.
            </Alert>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
