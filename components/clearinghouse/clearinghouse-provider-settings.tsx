import { useState } from 'react';
import { BoxArrowUpRight, CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { Button, Spinner } from 'reactstrap';
import { useAuth } from '../../hooks/use-auth';
import ClearinghouseApi, { ClearinghouseProviderSettings } from '../../pages/api/clearinghouse';
import { useEffectAsync } from '../../utils/react';
import { clearinghouseErrorMessage } from './errors';

/**
 * Settings → Integrations → FMCSA Clearinghouse. FMCSA itself has no API, so the carrier connects
 * the C/TPA vendor that runs queries for it; without one, queries go out as bulk-upload files.
 */
export default function ClearinghouseProviderSettingsTab({ companyId }: { companyId: number }) {
  const { isCompanyAdministrator } = useAuth();
  const api = new ClearinghouseApi();

  const [settings, setSettings] = useState<ClearinghouseProviderSettings | null>(null);
  const [form, setForm] = useState({ provider: '', apiKey: '', accountId: '', baseUrl: '' });
  const [saving, setSaving] = useState(false);

  const load = (s: ClearinghouseProviderSettings) => {
    setSettings(s);
    setForm({
      provider: s.provider ?? s.providers[0]?.key ?? '',
      apiKey: '',
      accountId: s.accountId ?? '',
      baseUrl: s.baseUrl ?? '',
    });
  };

  useEffectAsync(async () => {
    if (!companyId) return;
    try {
      load(await api.getProvider(companyId));
    } catch (e) {
      toast.error(clearinghouseErrorMessage(e));
    }
  }, [companyId]);

  const option = settings?.providers.find((p) => p.key === form.provider);
  const keepingKey = settings?.configured && settings.provider === form.provider;

  async function handleSave() {
    setSaving(true);
    try {
      load(
        await api.saveProvider(companyId, {
          provider: form.provider,
          apiKey: form.apiKey || undefined,
          accountId: form.accountId || undefined,
          baseUrl: form.baseUrl || undefined,
        }),
      );
      toast.success(`${option?.label} connected`);
    } catch (e) {
      toast.error(clearinghouseErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect() {
    if (!confirm('Disconnect the Clearinghouse provider? Queries already ordered keep their history.')) return;
    setSaving(true);
    try {
      load(await api.removeProvider(companyId));
      toast.success('Provider disconnected');
    } catch (e) {
      toast.error(clearinghouseErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return (
      <div className="pt-3 text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="pt-3">
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-1">FMCSA Drug &amp; Alcohol Clearinghouse</h5>
          <p className="text-muted small mb-3">
            FMCSA doesn&apos;t offer an API. Without a provider, DriverFly builds the Clearinghouse bulk-upload file for you.
            Upload it at{' '}
            <a href="https://clearinghouse.fmcsa.dot.gov/" target="_blank" rel="noopener noreferrer">
              clearinghouse.fmcsa.dot.gov <BoxArrowUpRight size={11} />
            </a>
            . To order queries directly from DriverFly, connect the C/TPA that runs your queries.
          </p>

          <div className="d-flex align-items-center gap-2 mb-3">
            {settings.configured ? (
              <small className="text-success d-flex align-items-center gap-1">
                <CheckCircleFill /> Connected to{' '}
                <strong>{settings.providers.find((p) => p.key === settings.provider)?.label ?? settings.provider}</strong> (key{' '}
                {settings.apiKeyMasked})
              </small>
            ) : (
              <small className="text-muted d-flex align-items-center gap-1">
                <XCircleFill /> No provider connected. Queries use the bulk-upload file.
              </small>
            )}
          </div>

          {!isCompanyAdministrator ? (
            <div className="text-muted small">Only company administrators can change this.</div>
          ) : settings.providers.length === 0 ? (
            <div className="text-muted small">No providers are available yet.</div>
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label fw-semibold">Provider</label>
                <select className="form-select" value={form.provider} onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value, apiKey: '' }))}>
                  {settings.providers.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
                {option?.setupNote && <div className="form-text">{option.setupNote}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">API key</label>
                <input
                  type="password"
                  autoComplete="off"
                  className="form-control"
                  placeholder={keepingKey ? `Leave blank to keep ${settings.apiKeyMasked}` : 'Paste the API key from your provider'}
                  value={form.apiKey}
                  onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
                />
                <div className="form-text">Stored encrypted. DriverFly never shows it again.</div>
              </div>
              {option?.requiresAccountId && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">{option.accountIdLabel ?? 'Account ID'}</label>
                  <input className="form-control" value={form.accountId} onChange={(e) => setForm((f) => ({ ...f, accountId: e.target.value }))} />
                </div>
              )}
              <details className="mb-3">
                <summary className="small text-muted">Advanced</summary>
                <label className="form-label small mt-2">API base URL (e.g. the provider&apos;s sandbox)</label>
                <input
                  className="form-control form-control-sm"
                  placeholder="Default"
                  value={form.baseUrl}
                  onChange={(e) => setForm((f) => ({ ...f, baseUrl: e.target.value }))}
                />
              </details>
              <div className="d-flex gap-2">
                <Button color="primary" onClick={handleSave} disabled={saving || (!form.apiKey && !keepingKey)}>
                  {saving ? <Spinner size="sm" className="me-1" /> : null} {settings.configured ? 'Save' : 'Connect'}
                </Button>
                {settings.configured && (
                  <Button color="outline-danger" onClick={handleDisconnect} disabled={saving}>
                    Disconnect
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
        <div className="card-footer text-muted small">
          <strong>Before connecting:</strong> in the Clearinghouse, buy a query plan and designate your provider as your C/TPA.
          Full and pre-employment queries still need each driver to consent inside the Clearinghouse.
        </div>
      </div>
    </div>
  );
}
