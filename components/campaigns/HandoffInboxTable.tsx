import React from 'react';
import { useRouter } from 'next/router';
import { Table, Badge, Button } from 'reactstrap';
import { InboxFill, CheckLg, XLg, PlayFill } from 'react-bootstrap-icons';
import { CampaignHandoffEntity } from '../../models/campaigns/campaign-handoff.entity';
import { CampaignHandoffStatus } from '../../enums/campaigns/campaign-handoff-status.enum';
import { CampaignTargetType } from '../../enums/campaigns/campaign-target-type.enum';

interface HandoffInboxTableProps {
  handoffs: CampaignHandoffEntity[];
  loading?: boolean;
  onAccept: (id: number) => void;
  onComplete: (id: number) => void;
  onDismiss: (id: number) => void;
  actioningIds?: Set<number>;
}

const statusColor = (status: CampaignHandoffStatus) => {
  switch (status) {
    case CampaignHandoffStatus.PENDING:
      return 'warning';
    case CampaignHandoffStatus.ACCEPTED:
      return 'info';
    case CampaignHandoffStatus.COMPLETED:
      return 'success';
    case CampaignHandoffStatus.DISMISSED:
      return 'secondary';
    default:
      return 'light';
  }
};

const outcomeColor = (outcome?: string) => {
  switch (outcome) {
    case 'positive':
      return 'success';
    case 'negative':
      return 'danger';
    case 'neutral':
      return 'secondary';
    default:
      return 'warning';
  }
};

const assigneeName = (h: CampaignHandoffEntity) => {
  const u = h.assignedUser;
  if (!u) return '-';
  return [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email || `User #${u.id}`;
};

const formatAge = (date: Date | string) => {
  const then = new Date(date).getTime();
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const HandoffInboxTable: React.FC<HandoffInboxTableProps> = ({
  handoffs,
  loading = false,
  onAccept,
  onComplete,
  onDismiss,
  actioningIds,
}) => {
  const router = useRouter();

  const goToProfile = (h: CampaignHandoffEntity) => {
    if (h.targetType === CampaignTargetType.APPLICANT && h.targetId) {
      router.push(`/dashboard/company/applicants/${h.targetId}`);
    } else if (h.targetType === CampaignTargetType.EMPLOYEE && h.targetId) {
      router.push(`/dashboard/company/compliance/employee-directory/${h.targetId}`);
    }
  };

  if (!loading && handoffs.length === 0) {
    return (
      <div className="text-center py-5">
        <InboxFill size={48} className="text-muted mb-3" />
        <h6 className="text-muted mb-2">No handoffs</h6>
        <p className="text-muted small mb-0">
          Drivers handed off from AI campaigns will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <Table className="align-middle">
        <thead className="table-light">
          <tr>
            <th className="fw-semibold">Driver</th>
            <th className="fw-semibold">Campaign</th>
            <th className="fw-semibold">AI Outcome</th>
            <th className="fw-semibold">Assignee</th>
            <th className="fw-semibold">Status</th>
            <th className="fw-semibold">Age</th>
            <th className="fw-semibold" style={{ width: '220px' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {handoffs.map((h) => {
            const busy = actioningIds?.has(h.id);
            const active =
              h.status === CampaignHandoffStatus.PENDING ||
              h.status === CampaignHandoffStatus.ACCEPTED;
            return (
              <tr key={h.id}>
                <td>
                  <span
                    onClick={() => goToProfile(h)}
                    style={{
                      cursor: h.targetId ? 'pointer' : 'default',
                      color: '#1d4355',
                      textDecoration: h.targetId ? 'underline' : 'none',
                    }}
                    className="fw-semibold"
                  >
                    {h.targetName || '-'}
                  </span>
                  {h.targetPhone && (
                    <div className="small text-muted">{h.targetPhone}</div>
                  )}
                </td>
                <td>{h.campaignName || `#${h.campaignId}`}</td>
                <td>
                  {h.callSummary?.outcome ? (
                    <Badge color={outcomeColor(h.callSummary.outcome)}>
                      {h.callSummary.outcome.toUpperCase()}
                    </Badge>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>{assigneeName(h)}</td>
                <td>
                  <Badge color={statusColor(h.status)}>{h.status.toUpperCase()}</Badge>
                </td>
                <td className="small text-muted">{formatAge(h.createdAt)}</td>
                <td>
                  <div className="d-flex gap-2">
                    {h.status === CampaignHandoffStatus.PENDING && (
                      <Button
                        color="info"
                        size="sm"
                        outline
                        disabled={busy}
                        onClick={() => onAccept(h.id)}
                      >
                        <PlayFill className="me-1" />
                        Accept
                      </Button>
                    )}
                    {active && (
                      <Button
                        color="success"
                        size="sm"
                        outline
                        disabled={busy}
                        onClick={() => onComplete(h.id)}
                      >
                        <CheckLg className="me-1" />
                        Complete
                      </Button>
                    )}
                    {active && (
                      <Button
                        color="secondary"
                        size="sm"
                        outline
                        disabled={busy}
                        onClick={() => onDismiss(h.id)}
                      >
                        <XLg className="me-1" />
                        Dismiss
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default HandoffInboxTable;
