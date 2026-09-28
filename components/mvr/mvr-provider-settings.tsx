import { useState } from 'react';
import { CheckCircleFill, Clipboard, XCircleFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { Button, Spinner } from 'reactstrap';
import { useAuth } from '../../hooks/use-auth';
import MvrApi, { MvrCredentialField, MvrProviderSettings } from '../../pages/api/mvr';
import { useEffectAsync } from '../../utils/react';
import { mvrErrorMessage } from './errors';

type Form = { provider: string; apiKey: string; apiSecret: string; accountId: string; baseUrl: string };

/**
 * Settings → Integrations → Motor Vehicle Records. The carrier connects the screening vendor it
 * already has an MVR account with; DriverFly then orders records through it and files them.
 */
export default function MvrProviderSettingsTab({ companyId }: { companyId: number }) {
  const { isCompanyAdministrator } = useAuth();
  const api = new MvrApi();

  const [settings, setSettings] = useState<MvrProviderSettings | null>(null);
  const [form, setForm] = useState<Form>({ provider: '', apiKey: '', apiSecret: '', accountId: '', baseUrl: '' });
  const [saving, setSaving] = useState(false);

  const load = (s: MvrProviderSettings) => {
    setSettings(s);
    setForm({ provider: s.provider ?? s.providers[0]?.key ?? '', apiKey: '', apiSecret: '', accountId: s.accountId ?? '', baseUrl: s.baseUrl ?? '' });
  };

  useEffectAsync(async () => {
    if (!companyId) return;
    try {
      load(await api.getProvider(companyId));
    } catch (e) {
      toast.error(mvrErrorMessage(e));
    }
  }, [companyId]);

  const option = settings?.providers.find((p) => p.key === form.provider);
  const sameProvider = settings?.configured && settings.provider === form.provider;
  const masked = (field: MvrCredentialField) => (field.key === 'apiKey' ? settings?.apiKeyMasked : field.key === 'apiSecret' ? settings?.apiSecretMasked : null);
  const missing = (option?.fields ?? []).some((f) => f.required && !form[f.key] && !(f.secret && sameProvider && masked(f)));

  async function handleSave() {
    setSaving(true);
    try {
      load(
        await api.saveProvider(companyId, {
          provider: form.provider,
          apiKey: form.apiKey || undefined,
          apiSecret: form.apiSecret || undefined,
          accountId: form.accountId || undefined,
          baseUrl: form.baseUrl || undefined,
        }),
      );
      toast.success(`${option?.label} connected`);
    } catch (e) {
      toast.error(mvrErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect() {
    if (!confirm('Disconnect the MVR provider? Records already pulled stay in each driver file.')) return;
    setSaving(true);
    try {
      load(await api.removeProvider(companyId));
      toast.success('Provider disconnected');
    } catch (e) {
      toast.error(mvrErrorMessage(e));
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

  const connectedLabel = settings.providers.find((p) => p.key === settings.provider)?.label ?? settings.provider;

  return (
    <div className="pt-3">
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-1">Motor Vehicle Records (MVR)</h5>
          <p className="text-muted small mb-3">
            Connect the screening company you already use for MVRs. DriverFly then pulls each driver&apos;s state record for you,
            files the report in their driver qualification file, and sets the next annual review date.
          </p>

          <div className="d-flex align-items-center gap-2 mb-3">
            {settings.configured ? (
              <small className="text-success d-flex align-items-center gap-1">
                <CheckCircleFill /> Connected to <strong>{connectedLabel}</strong> (key {settings.apiKeyMasked})
              </small>
            ) : (
              <small className="text-muted d-flex align-items-center gap-1">
                <XCircleFill /> No provider connected.
              </small>
            )}
          </div>

          {settings.configured && settings.webhookUrl && (
            <div className="mb-3">
              <label className="form-label fw-semibold small mb-1">Webhook URL</label>
              <div className="input-group input-group-sm">
                <input className="form-control" readOnly value={settings.webhookUrl} />
                <Button
                  color="outline-secondary"
                  onClick={() => navigator.clipboard?.writeText(settings.webhookUrl).then(() => toast.success('Copied'))}
                  title="Copy"
                >
                  <Clipboard />
                </Button>
              </div>
              <div className="form-text">
                Add this in your {connectedLabel} account&apos;s webhook settings so results arrive as soon as the state returns them.
                Without it, DriverFly checks for results every 15 minutes.
              </div>
            </div>
          )}

          {!isCompanyAdministrator ? (
            <div className="text-muted small">Only company administrators can change this.</div>
          ) : settings.providers.length === 0 ? (
            <div className="text-muted small">No providers are available yet.</div>
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label fw-semibold">Provider</label>
                <select
                  className="form-select"
                  value={form.provider}
                  onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value, apiKey: '', apiSecret: '', accountId: '' }))}
                >
                  {settings.providers.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
                {option?.setupNote && <div className="form-text">{option.setupNote}</div>}
              </div>

              {option?.fields
                .filter((f) => f.key !== 'baseUrl')
                .map((field) => (
                  <div className="mb-3" key={field.key}>
                    <label className="form-label fw-semibold">
                      {field.label}
                      {!field.required && <span className="text-muted fw-normal"> (optional)</span>}
                    </label>
                    <input
                      type={field.secret ? 'password' : 'text'}
                      autoComplete="off"
                      className="form-control"
                      placeholder={field.secret && sameProvider && masked(field) ? `Leave blank to keep ${masked(field)}` : ''}
                      value={form[field.key]}
                      onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    />
                    {(field.help || field.secret) && (
                      <div className="form-text">
                        {field.help}
                        {field.secret && ' Stored encrypted. DriverFly never shows it again.'}
                      </div>
                    )}
                  </div>
                ))}

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
                <Button color="primary" onClick={handleSave} disabled={saving || missing}>
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
          <strong>Before ordering:</strong> each driver must have signed a stand-alone FCRA disclosure and written authorization
          for their MVR. DriverFly asks you to confirm this on every order and records who confirmed it.
        </div>
      </div>
    </div>
  );
}
