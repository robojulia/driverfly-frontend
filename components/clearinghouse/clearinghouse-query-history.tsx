import { useState } from 'react';
import { ArrowClockwise, ShieldCheck } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { Badge, Button, Spinner, Table } from 'reactstrap';
import { useAuth } from '../../hooks/use-auth';
import ClearinghouseApi, {
  CLEARINGHOUSE_QUERY_TYPE_LABELS,
  CLEARINGHOUSE_RESULT_LABELS,
  CLEARINGHOUSE_STATUS_LABELS,
  ClearinghouseQuery,
  ClearinghouseQueryResult,
  ClearinghouseQueryType,
  ClearinghouseSubjectType,
} from '../../pages/api/clearinghouse';
import { useEffectAsync } from '../../utils/react';
import ClearinghouseQueryModal from './clearinghouse-query-modal';
import { clearinghouseErrorMessage } from './errors';

const STATUS_COLOR: Record<ClearinghouseQuery['status'], string> = {
  EXPORTED: 'secondary',
  SUBMITTED: 'info',
  PENDING_CONSENT: 'warning',
  COMPLETED: 'success',
  FAILED: 'danger',
  CANCELLED: 'secondary',
};

const RESULT_COLOR: Record<ClearinghouseQueryResult, string> = {
  NO_RECORD: 'success',
  NOT_PROHIBITED: 'success',
  RECORD_EXISTS: 'warning',
  PROHIBITED: 'danger',
};

/** Which results make sense for which query: limited queries only say whether a record exists. */
function resultsFor(queryType: ClearinghouseQueryType): ClearinghouseQueryResult[] {
  return queryType === ClearinghouseQueryType.LIMITED || queryType === ClearinghouseQueryType.LIMITED_WITH_AUTO_CONSENT
    ? ['NO_RECORD', 'RECORD_EXISTS']
    : ['NOT_PROHIBITED', 'PROHIBITED'];
}

interface Props {
  subjectType: ClearinghouseSubjectType;
  subjectId: number;
  driverName: string;
  defaultQueryType?: ClearinghouseQueryType;
}

/** One driver's Clearinghouse queries, with a button to send a new one and a place to log results. */
export default function ClearinghouseQueryHistory({ subjectType, subjectId, driverName, defaultQueryType }: Props) {
  const { company } = useAuth();
  const companyId = company?.id;
  const api = new ClearinghouseApi();

  const [rows, setRows] = useState<ClearinghouseQuery[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [reload, setReload] = useState(0);

  useEffectAsync(async () => {
    if (!companyId || !subjectId) return;
    try {
      setRows(await api.list(companyId, { subjectType, subjectId, limit: 50 }));
    } catch {
      setRows([]);
    }
  }, [companyId, subjectType, subjectId, reload]);

  const replace = (row: ClearinghouseQuery) => setRows((prev) => prev.map((r) => (r.id === row.id ? row : r)));

  async function handleResult(row: ClearinghouseQuery, value: string) {
    setSavingId(row.id);
    try {
      replace(
        await api.recordResult(companyId, row.id, value ? { result: value as ClearinghouseQueryResult } : { result: null, status: row.channel === 'PROVIDER' ? 'SUBMITTED' : 'EXPORTED' }),
      );
    } catch (e) {
      toast.error(clearinghouseErrorMessage(e));
    } finally {
      setSavingId(null);
    }
  }

  async function handleRefresh(row: ClearinghouseQuery) {
    setSavingId(row.id);
    try {
      replace(await api.refresh(companyId, row.id));
    } catch (e) {
      toast.error(clearinghouseErrorMessage(e));
    } finally {
      setSavingId(null);
    }
  }

  const selection = subjectType === 'employee' ? { employeeIds: [subjectId] } : { applicantIds: [subjectId] };

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span className="fw-semibold d-flex align-items-center gap-2">
          <ShieldCheck /> FMCSA Clearinghouse queries
        </span>
        <Button color="primary" size="sm" onClick={() => setModalOpen(true)}>
          Run query
        </Button>
      </div>
      <div className="card-body p-0">
        {rows === null ? (
          <div className="text-center p-3">
            <Spinner size="sm" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-muted small p-3">No Clearinghouse queries sent from DriverFly yet.</div>
        ) : (
          <Table size="sm" responsive className="mb-0 small">
            <thead>
              <tr>
                <th>Sent</th>
                <th>Type</th>
                <th>How</th>
                <th>Status</th>
                <th>Result</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{new Date(row.created_at).toLocaleDateString()}</td>
                  <td>{CLEARINGHOUSE_QUERY_TYPE_LABELS[row.queryType]}</td>
                  <td>{row.channel === 'PROVIDER' ? row.provider : 'Bulk file'}</td>
                  <td>
                    <Badge color={STATUS_COLOR[row.status]} pill>
                      {CLEARINGHOUSE_STATUS_LABELS[row.status]}
                    </Badge>
                    {row.note && <div className="text-muted mt-1">{row.note}</div>}
                  </td>
                  <td style={{ minWidth: 200 }}>
                    <select
                      className={`form-select form-select-sm${row.result ? ` border-${RESULT_COLOR[row.result]}` : ''}`}
                      value={row.result ?? ''}
                      disabled={savingId === row.id || row.status === 'CANCELLED'}
                      onChange={(e) => handleResult(row, e.target.value)}
                    >
                      <option value="">— Not recorded —</option>
                      {resultsFor(row.queryType).map((r) => (
                        <option key={r} value={r}>
                          {CLEARINGHOUSE_RESULT_LABELS[r]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="text-end">
                    {row.channel === 'PROVIDER' && row.externalId && ['SUBMITTED', 'PENDING_CONSENT'].includes(row.status) && (
                      <Button color="link" size="sm" className="p-0" title="Check status" onClick={() => handleRefresh(row)} disabled={savingId === row.id}>
                        {savingId === row.id ? <Spinner size="sm" /> : <ArrowClockwise />}
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
        Keep the query PDF from the Clearinghouse in the Drug &amp; Alcohol Clearinghouse Query document slot.
      </div>

      <ClearinghouseQueryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selection={selection}
        description={driverName}
        defaultQueryType={defaultQueryType}
        onDone={() => setReload((n) => n + 1)}
      />
    </div>
  );
}
