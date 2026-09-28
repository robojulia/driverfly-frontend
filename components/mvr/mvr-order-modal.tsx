import Link from 'next/link';
import { useState } from 'react';
import { ExclamationTriangleFill, Send } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Table } from 'reactstrap';
import { useAuth } from '../../hooks/use-auth';
import MvrApi, { MVR_PURPOSE_LABELS, MvrDriverSelection, MvrPreview, MvrProviderSettings, MvrPurpose } from '../../pages/api/mvr';
import { useEffectAsync } from '../../utils/react';
import { mvrErrorMessage } from './errors';

const PURPOSE_HELP: Record<MvrPurpose, string> = {
  PRE_EMPLOYMENT: 'Required within 30 days before a new driver starts (49 CFR 391.23).',
  ANNUAL_REVIEW: 'Required at least once every 12 months for every driver (49 CFR 391.25).',
  OTHER: 'Any other permissible purpose, e.g. after an incident.',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selection: MvrDriverSelection;
  /** e.g. "All active employees" or the driver's name. */
  description: string;
  defaultPurpose?: MvrPurpose;
  /** Called after orders were placed, so history lists can reload. */
  onDone?: () => void;
}

/** Orders MVRs for a set of drivers through the company's connected screening provider. */
export default function MvrOrderModal({ isOpen, onClose, selection, description, defaultPurpose, onDone }: Props) {
  const { company, isCompanyAdministrator } = useAuth();
  const companyId = company?.id;
  const api = new MvrApi();

  const [purpose, setPurpose] = useState<MvrPurpose>(defaultPurpose ?? 'ANNUAL_REVIEW');
  const [consent, setConsent] = useState(false);
  const [preview, setPreview] = useState<MvrPreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [provider, setProvider] = useState<MvrProviderSettings | null>(null);
  const [busy, setBusy] = useState(false);

  useEffectAsync(async () => {
    if (!isOpen || !companyId) return;
    setConsent(false);
    setPreview(null);
    setPreviewError(null);
    const [previewResult, providerResult] = await Promise.allSettled([api.preview(companyId, selection), api.getProvider(companyId)]);
    if (previewResult.status === 'fulfilled') setPreview(previewResult.value);
    else setPreviewError(mvrErrorMessage(previewResult.reason));
    setProvider(providerResult.status === 'fulfilled' ? providerResult.value : null);
  }, [isOpen, companyId, JSON.stringify(selection)]);

  const providerLabel = provider?.providers.find((p) => p.key === provider.provider)?.label ?? provider?.provider;
  const ready = preview?.ready.length ?? 0;
  const canOrder = !!provider?.configured && isCompanyAdministrator && ready > 0 && consent && !busy;

  async function handleOrder() {
    setBusy(true);
    try {
      const { orders } = await api.order(companyId, { ...selection, purpose, consentCertified: true });
      const failed = orders.filter((o) => o.status === 'FAILED').length;
      if (failed) toast.warning(`${orders.length - failed} ordered, ${failed} failed. See the MVR history for details.`);
      else toast.success(`${orders.length} MVR${orders.length === 1 ? '' : 's'} ordered through ${providerLabel}. Results usually arrive within minutes to a day.`);
      onDone?.();
      onClose();
    } catch (e) {
      toast.error(mvrErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="lg">
      <ModalHeader toggle={onClose}>Pull Motor Vehicle Record</ModalHeader>
      <ModalBody>
        <p className="text-muted mb-3">{description}</p>

        {provider && !provider.configured ? (
          <div className="alert alert-warning py-2 small">
            No MVR provider is connected.{' '}
            {isCompanyAdministrator ? (
              <>
                Connect Checkr or SambaSafety under{' '}
                <Link href="/dashboard/company/settings/integrations/facebook">
                  <a>Settings → Integrations</a>
                </Link>
                .
              </>
            ) : (
              'Ask a company administrator to connect one under Settings → Integrations.'
            )}
          </div>
        ) : null}

        <div className="mb-3">
          <label className="form-label fw-semibold">Reason</label>
          <select className="form-select" value={purpose} onChange={(e) => setPurpose(e.target.value as MvrPurpose)}>
            {(Object.keys(MVR_PURPOSE_LABELS) as MvrPurpose[]).map((p) => (
              <option key={p} value={p}>
                {MVR_PURPOSE_LABELS[p]}
              </option>
            ))}
          </select>
          <div className="form-text">{PURPOSE_HELP[purpose]}</div>
        </div>

        {previewError ? (
          <div className="alert alert-danger py-2 small">{previewError}</div>
        ) : !preview ? (
          <div className="d-flex align-items-center gap-2 text-muted mb-3">
            <Spinner size="sm" /> Checking driver data…
          </div>
        ) : (
          <>
            <p className="mb-2">
              <strong>{ready}</strong> driver{ready === 1 ? '' : 's'} ready.
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

        {isCompanyAdministrator ? (
          <div className="form-check border rounded p-3 ps-5 bg-light">
            <input className="form-check-input" type="checkbox" id="mvr-consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <label className="form-check-label small" htmlFor="mvr-consent">
              I certify that {ready === 1 ? 'this driver has' : 'each driver has'} signed a stand-alone disclosure and written authorization
              for this Motor Vehicle Record, that it is kept on file, and that it will be used only for employment purposes as permitted by
              the Fair Credit Reporting Act and the Driver&apos;s Privacy Protection Act.
            </label>
          </div>
        ) : (
          <div className="text-muted small">Only company administrators can order MVRs.</div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        {isCompanyAdministrator && (
          <Button color="primary" onClick={handleOrder} disabled={!canOrder}>
            {busy ? <Spinner size="sm" className="me-1" /> : <Send className="me-1" />} Order {ready > 1 ? `${ready} MVRs` : 'MVR'}
            {providerLabel && provider?.configured ? ` through ${providerLabel}` : ''}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
