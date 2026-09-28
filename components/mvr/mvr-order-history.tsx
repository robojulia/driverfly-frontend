import { useState } from 'react';
import { ArrowClockwise, CarFront } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { Badge, Button, Spinner, Table } from 'reactstrap';
import { useAuth } from '../../hooks/use-auth';
import MvrApi, { MVR_PURPOSE_LABELS, MVR_STATUS_LABELS, MvrOrder, MvrOrderStatus, MvrPurpose, MvrSubjectType } from '../../pages/api/mvr';
import { useEffectAsync } from '../../utils/react';
import { mvrErrorMessage } from './errors';
import MvrOrderModal from './mvr-order-modal';
import MvrReportModal from './mvr-report-modal';

const STATUS_COLOR: Record<MvrOrderStatus, string> = {
  PENDING: 'info',
  ON_HOLD: 'warning',
  COMPLETED: 'success',
  FAILED: 'danger',
  CANCELLED: 'secondary',
};

interface Props {
  subjectType: MvrSubjectType;
  subjectId: number;
  driverName: string;
  defaultPurpose?: MvrPurpose;
}

function summary(order: MvrOrder) {
  if (order.status !== 'COMPLETED') return null;
  const parts = [
    `${order.violationCount ?? 0} violation${order.violationCount === 1 ? '' : 's'}`,
    `${order.accidentCount ?? 0} accident${order.accidentCount === 1 ? '' : 's'}`,
  ];
  if (order.suspensionCount) parts.push(`${order.suspensionCount} suspension${order.suspensionCount === 1 ? '' : 's'}`);
  return parts.join(' · ');
}

/** One driver's pulled MVRs, with a button to pull a new one. */
export default function MvrOrderHistory({ subjectType, subjectId, driverName, defaultPurpose }: Props) {
  const { company } = useAuth();
  const companyId = company?.id;
  const api = new MvrApi();

  const [rows, setRows] = useState<MvrOrder[] | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [viewing, setViewing] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState<number | null>(null);
  const [reload, setReload] = useState(0);

  useEffectAsync(async () => {
    if (!companyId || !subjectId) return;
    try {
      setRows(await api.list(companyId, { subjectType, subjectId, limit: 50 }));
    } catch {
      setRows([]);
    }
  }, [companyId, subjectType, subjectId, reload]);

  const replace = (row: MvrOrder) => setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...row, report: undefined } : r)));

  async function handleRefresh(row: MvrOrder) {
    setRefreshing(row.id);
    try {
      const next = await api.refresh(companyId, row.id);
      replace(next);
      if (next.status === 'COMPLETED') toast.success('The MVR is back.');
      else toast.info('Still waiting on the state.');
    } catch (e) {
      toast.error(mvrErrorMessage(e));
    } finally {
      setRefreshing(null);
    }
  }

  const selection = subjectType === 'employee' ? { employeeIds: [subjectId] } : { applicantIds: [subjectId] };

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span className="fw-semibold d-flex align-items-center gap-2">
          <CarFront /> Motor Vehicle Records
        </span>
        <Button color="primary" size="sm" onClick={() => setOrderOpen(true)}>
          Pull MVR
        </Button>
      </div>
      <div className="card-body p-0">
        {rows === null ? (
          <div className="text-center p-3">
            <Spinner size="sm" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-muted small p-3">No MVRs pulled through DriverFly yet.</div>
        ) : (
          <Table size="sm" responsive hover className="mb-0 small">
            <thead>
              <tr>
                <th>Ordered</th>
                <th>Reason</th>
                <th>License</th>
                <th>Status</th>
                <th>Result</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{new Date(row.created_at).toLocaleDateString()}</td>
                  <td>{MVR_PURPOSE_LABELS[row.purpose]}</td>
                  <td>
                    {row.licenseState} ••••{row.licenseLast4}
                  </td>
                  <td>
                    <Badge color={STATUS_COLOR[row.status]} pill>
                      {MVR_STATUS_LABELS[row.status]}
                    </Badge>
                    {row.note && row.status !== 'COMPLETED' && <div className="text-muted mt-1">{row.note}</div>}
                  </td>
                  <td>
                    {row.status === 'COMPLETED' ? (
                      <>
                        <Badge color={row.assessment === 'CLEAR' ? 'success' : 'warning'} pill className="me-1">
                          {row.assessment === 'CLEAR' ? 'Clear' : 'Needs review'}
                        </Badge>
                        <span className="text-muted">
                          {row.licenseStatus ?? ''} {row.licenseStatus ? '·' : ''} {summary(row)}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="text-end text-nowrap">
                    {['PENDING', 'ON_HOLD'].includes(row.status) && row.externalId && (
                      <Button color="link" size="sm" className="p-0 me-2" title="Check status" onClick={() => handleRefresh(row)} disabled={refreshing === row.id}>
                        {refreshing === row.id ? <Spinner size="sm" /> : <ArrowClockwise />}
                      </Button>
                    )}
                    {row.status === 'COMPLETED' && (
                      <Button color="link" size="sm" className="p-0" onClick={() => setViewing(row.id)}>
                        View
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
      <div className="card-footer text-muted small">
        Completed MVRs are filed in the Motor Vehicle Record (MVR) document slot automatically
        {subjectType === 'employee' ? ', and the MVR expiration date moves to a year after the pull.' : '.'}
      </div>

      <MvrOrderModal
        isOpen={orderOpen}
        onClose={() => setOrderOpen(false)}
        selection={selection}
        description={driverName}
        defaultPurpose={defaultPurpose}
        onDone={() => setReload((n) => n + 1)}
      />
      <MvrReportModal orderId={viewing} onClose={() => setViewing(null)} onSaved={replace} />
    </div>
  );
}
