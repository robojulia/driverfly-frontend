import Link from 'next/link';
import { useState } from 'react';
import { BoxArrowUpRight, Download, ExclamationTriangleFill, Send } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Table } from 'reactstrap';
import { useAuth } from '../../hooks/use-auth';
import ClearinghouseApi, {
  BulkFile,
  CLEARINGHOUSE_QUERY_TYPE_LABELS,
  ClearinghouseProviderSettings,
  ClearinghouseQueryType,
  downloadBulkFile,
  DriverSelection,
} from '../../pages/api/clearinghouse';
import { useEffectAsync } from '../../utils/react';
import { clearinghouseErrorMessage } from './errors';

const CLEARINGHOUSE_URL = 'https://clearinghouse.fmcsa.dot.gov/';

const QUERY_TYPE_HELP: Record<ClearinghouseQueryType, string> = {
  [ClearinghouseQueryType.LIMITED]: 'Annual check. Needs the general consent the driver signed in DriverFly.',
  [ClearinghouseQueryType.LIMITED_WITH_AUTO_CONSENT]:
    'Annual check. If a record exists, the Clearinghouse asks the driver for full-query consent automatically.',
  [ClearinghouseQueryType.FULL]: 'Shows violation details. The driver must consent inside the Clearinghouse.',
  [ClearinghouseQueryType.PRE_EMPLOYMENT]: 'Required before a new hire drives. The driver must consent inside the Clearinghouse.',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Which drivers; queryType is chosen in the modal. */
  selection: Omit<DriverSelection, 'queryType'>;
  /** e.g. "All active employees" or the driver's name. */
  description: string;
  defaultQueryType?: ClearinghouseQueryType;
  /** Called after queries were logged or ordered, so history lists can reload. */
  onDone?: () => void;
}

/**
 * Sends Clearinghouse queries for a set of drivers: as an FMCSA bulk-upload file, or, when the
 * company has connected a provider, ordered straight through it.
 */
export default function ClearinghouseQueryModal({ isOpen, onClose, selection, description, defaultQueryType, onDone }: Props) {
  const { company, isCompanyAdministrator } = useAuth();
  const companyId = company?.id;
  const api = new ClearinghouseApi();

  const [queryType, setQueryType] = useState<ClearinghouseQueryType>(defaultQueryType ?? ClearinghouseQueryType.LIMITED_WITH_AUTO_CONSENT);
  const [preview, setPreview] = useState<BulkFile | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ClearinghouseProviderSettings | null>(null);
  const [busy, setBusy] = useState<'download' | 'order' | null>(null);

  useEffectAsync(async () => {
    if (!isOpen || !companyId) return;
    setPreview(null);
    setPreviewError(null);
    try {
      setPreview(await api.bulkFile(companyId, { ...selection, queryType, record: false }));
    } catch (e) {
      setPreviewError(clearinghouseErrorMessage(e));
    }
  }, [isOpen, companyId, queryType, JSON.stringify(selection)]);

  useEffectAsync(async () => {
    if (!isOpen || !companyId) return;
    try {
      setProvider(await api.getProvider(companyId));
    } catch {
      setProvider(null);
    }
  }, [isOpen, companyId]);

  const providerLabel = provider?.providers.find((p) => p.key === provider.provider)?.label ?? provider?.provider;
  const canOrder = !!provider?.configured && isCompanyAdministrator;
  const ready = preview?.included ?? 0;

  async function handleDownload() {
    setBusy('download');
    try {
      const file = await api.bulkFile(companyId, { ...selection, queryType });
      downloadBulkFile(file);
      toast.success(`Bulk file downloaded with ${file.included} driver${file.included === 1 ? '' : 's'}. Upload it in the Clearinghouse.`);
      onDone?.();
      onClose();
    } catch (e) {
      toast.error(clearinghouseErrorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  async function handleOrder() {
    if (!confirm(`Order ${ready} ${CLEARINGHOUSE_QUERY_TYPE_LABELS[queryType].toLowerCase()}${ready === 1 ? '' : 's'} through ${providerLabel}? Each query is billed by ${providerLabel} and FMCSA.`)) return;
    setBusy('order');
    try {
      const { orders } = await api.order(companyId, { ...selection, queryType });
      const failed = orders.filter((o) => o.status === 'FAILED').length;
      if (failed) toast.warning(`${orders.length - failed} ordered, ${failed} failed. See the query history for details.`);
      else toast.success(`${orders.length} ${orders.length === 1 ? 'query' : 'queries'} ordered through ${providerLabel}.`);
      onDone?.();
      onClose();
    } catch (e) {
      toast.error(clearinghouseErrorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="lg">
      <ModalHeader toggle={onClose}>FMCSA Clearinghouse query</ModalHeader>
      <ModalBody>
        <p className="text-muted mb-3">{description}</p>

        <div className="mb-3">
          <label className="form-label fw-semibold">Query type</label>
          <select className="form-select" value={queryType} onChange={(e) => setQueryType(Number(e.target.value))}>
            {[
              ClearinghouseQueryType.LIMITED_WITH_AUTO_CONSENT,
              ClearinghouseQueryType.LIMITED,
              ClearinghouseQueryType.PRE_EMPLOYMENT,
              ClearinghouseQueryType.FULL,
            ].map((type) => (
              <option key={type} value={type}>
                {CLEARINGHOUSE_QUERY_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          <div className="form-text">{QUERY_TYPE_HELP[queryType]}</div>
        </div>

        {previewError ? (
          <div className="alert alert-danger py-2 small">{previewError}</div>
        ) : !preview ? (
          <div className="d-flex align-items-center gap-2 text-muted">
            <Spinner size="sm" /> Checking driver data…
          </div>
        ) : (
          <>
            <p className="mb-2">
              <strong>{preview.included}</strong> driver{preview.included === 1 ? '' : 's'} ready to query.
            </p>
            {preview.skipped.length > 0 && (
              <div className="border rounded mb-3">
                <div className="px-3 py-2 text-warning small d-flex align-items-center gap-1">
                  <ExclamationTriangleFill /> {preview.skipped.length} left out. Fix their profiles to include them.
                </div>
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  <Table size="sm" className="mb-0 small">
                    <tbody>
                      {preview.skipped.map((s) => (
                        <tr key={`${s.subjectType}-${s.id}`}>
                          <td>{s.name}</td>
                          <td className="text-muted">{s.reasons.join('; ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </>
        )}

        <div className="alert alert-info py-2 small mb-0">
          <strong>Bulk file:</strong> download it, sign in to the{' '}
          <a href={CLEARINGHOUSE_URL} target="_blank" rel="noopener noreferrer">
            FMCSA Clearinghouse <BoxArrowUpRight size={11} />
          </a>
          , and go to <strong>My Dashboard → Queries → Submit a bulk upload</strong>. FMCSA processes uploads overnight
          (8 PM – 8 AM ET) and charges each query to your query plan. Log each result in the driver&apos;s Clearinghouse
          history when it comes back.
          {!provider?.configured && isCompanyAdministrator && (
            <>
              {' '}
              To order queries without the upload step, connect your C/TPA under{' '}
              <Link href="/dashboard/company/settings/integrations/facebook">
                <a>Settings → Integrations</a>
              </Link>.
            </>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose} disabled={!!busy}>
          Cancel
        </Button>
        {canOrder && (
          <Button color="outline-primary" onClick={handleOrder} disabled={!!busy || !ready}>
            {busy === 'order' ? <Spinner size="sm" className="me-1" /> : <Send className="me-1" />} Order through {providerLabel}
          </Button>
        )}
        <Button color="primary" onClick={handleDownload} disabled={!!busy || !ready}>
          {busy === 'download' ? <Spinner size="sm" className="me-1" /> : <Download className="me-1" />} Download bulk file
        </Button>
      </ModalFooter>
    </Modal>
  );
}
