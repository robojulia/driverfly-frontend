import { ReactNode, useState } from 'react';
import { Alert, Badge, Button, Card, Collapse, Form, Spinner } from 'react-bootstrap';
import { BoxArrowUpRight, CheckCircleFill, ExclamationTriangleFill, Facebook, Linkedin, XCircleFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/use-auth';
import JobBoardsApi, { JobBoardConnection, JobBoardProvider, jobBoardErrorMessage } from '../../pages/api/job-boards';
import { useEffectAsync } from '../../utils/react';

const ICONS: Record<JobBoardProvider, ReactNode> = {
  facebook: <Facebook size={28} color="#1877f2" />,
  linkedin: <Linkedin size={28} color="#0a66c2" />,
  indeed: (
    <span className="fw-bold text-nowrap" style={{ color: '#003a9b', fontSize: 18, lineHeight: '28px' }}>
      indeed
    </span>
  ),
};

const WHAT_IT_DOES: Record<JobBoardProvider, string> = {
  facebook: 'Publishes the job as a post on your Facebook Page with a link to apply.',
  linkedin: 'Shares the job as a LinkedIn post, from your profile or your company Page, with a link to apply.',
  indeed: 'Lists the job on Indeed through the Indeed Job Sync API. Posting again updates the listing, and it is expired automatically when the job closes.',
};

const ext = (href: string, label: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {label} <BoxArrowUpRight size={11} />
  </a>
);

const SETUP: Record<JobBoardProvider, ReactNode> = {
  facebook: (
    <ol className="small mb-0 ps-3">
      <li>
        At {ext('https://developers.facebook.com/apps', 'Meta for Developers')}, create an app (type “Business”). Note its <b>App ID</b> and, under App settings → Basic, its <b>App Secret</b>.
      </li>
      <li>
        Open {ext('https://developers.facebook.com/tools/explorer/', 'Graph API Explorer')}, choose your app, and under “User or Page” pick <b>Get User Access Token</b>. Add the permissions{' '}
        <code>pages_show_list</code>, <code>pages_read_engagement</code> and <code>pages_manage_posts</code>, then Generate Access Token and allow your Page.
      </li>
      <li>Paste that token below together with the App ID and App Secret. DriverFly exchanges it for a Page token that does not expire.</li>
      <li>If you manage several Pages, also enter the Page ID (Page → About → Page transparency).</li>
    </ol>
  ),
  linkedin: (
    <ol className="small mb-0 ps-3">
      <li>
        At {ext('https://www.linkedin.com/developers/apps', 'LinkedIn Developers')}, create an app linked to your company Page. Under Products, add <b>Share on LinkedIn</b> and <b>Sign In with LinkedIn using OpenID Connect</b>. To post as the company Page instead of
        yourself, request the <b>Community Management API</b> too.
      </li>
      <li>
        Open the {ext('https://www.linkedin.com/developers/tools/oauth/token-generator', 'OAuth token generator')}, pick your app, tick <code>openid</code>, <code>profile</code> and <code>w_member_social</code> (or <code>w_organization_social</code> for the company Page), and create the
        token.
      </li>
      <li>
        Paste the token below. For the company Page, also enter its ID, the number in <code>linkedin.com/company/&lt;ID&gt;/admin</code>.
      </li>
      <li>LinkedIn tokens last 60 days. Add the app’s client ID and secret (Auth tab) so DriverFly can show the expiry date, and paste a fresh token before then.</li>
    </ol>
  ),
  indeed: (
    <ol className="small mb-0 ps-3">
      <li>
        Indeed only gives Job Sync API access to approved partners. Apply at {ext('https://docs.indeed.com/', 'Indeed Partner Docs')} (or ask your Indeed account rep) to get Job Sync access for your employer account.
      </li>
      <li>
        In {ext('https://secure.indeed.com/account/apikeys', 'Indeed Partner Console')}, open your app and copy its <b>client ID</b> and <b>client secret</b>.
      </li>
      <li>Enter them below with the email address Indeed should use to verify your business. If the app is linked to more than one employer account, DriverFly lists them so you can enter the right employer ID.</li>
      <li>
        No Job Sync access? Use the <b>Indeed XML Feed</b> tab instead, which Indeed can crawl for free organic listings.
      </li>
    </ol>
  ),
};

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
}

export default function JobBoardSettings({ companyId }: { companyId: number }) {
  const { isCompanyAdministrator } = useAuth();
  const [connections, setConnections] = useState<JobBoardConnection[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffectAsync(async () => {
    if (!companyId) return;
    try {
      setConnections(await new JobBoardsApi().getConnections(companyId));
    } catch (e) {
      setLoadError(jobBoardErrorMessage(e, 'Could not load job board settings'));
    }
  }, [companyId]);

  const replace = (next: JobBoardConnection) => setConnections((list) => list?.map((c) => (c.provider === next.provider ? next : c)) ?? null);

  if (loadError) return <Alert variant="danger" className="mt-3">{loadError}</Alert>;
  if (!connections) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="pt-3">
      <p className="text-muted">
        Connect your own Facebook, LinkedIn and Indeed accounts, then use <b>Post to job boards</b> on any active job. Credentials are encrypted and only the last four characters of each secret are ever shown.
      </p>
      {!isCompanyAdministrator && (
        <Alert variant="info" className="py-2 small">
          Only company administrators can change these connections.
        </Alert>
      )}
      {connections.map((c) => (
        <ProviderCard key={c.provider} companyId={companyId} connection={c} canEdit={!!isCompanyAdministrator} onChange={replace} />
      ))}
    </div>
  );
}

function ProviderCard({
  companyId,
  connection,
  canEdit,
  onChange,
}: {
  companyId: number;
  connection: JobBoardConnection;
  canEdit: boolean;
  onChange: (c: JobBoardConnection) => void;
}) {
  const initialValues = () => Object.fromEntries(connection.fields.map((f) => [f.key, f.secret ? '' : connection.values[f.key] ?? '']));
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [editing, setEditing] = useState(!connection.connected);
  const [showSetup, setShowSetup] = useState(!connection.connected);
  const [busy, setBusy] = useState<'save' | 'test' | 'remove' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const api = new JobBoardsApi();

  const expiresSoon = connection.expiresAt && new Date(connection.expiresAt).getTime() - Date.now() < 7 * 24 * 3600 * 1000;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy('save');
    setError(null);
    setWarning(null);
    try {
      const saved = await api.saveConnection(companyId, connection.provider, values);
      onChange(saved);
      setWarning(saved.warning ?? null);
      setValues(Object.fromEntries(saved.fields.map((f) => [f.key, f.secret ? '' : saved.values[f.key] ?? ''])));
      setEditing(false);
      setShowSetup(false);
      toast.success(`${connection.label} connected${saved.accountName ? ` as ${saved.accountName}` : ''}`);
    } catch (err) {
      setError(jobBoardErrorMessage(err, `Could not connect ${connection.label}`));
    } finally {
      setBusy(null);
    }
  }

  async function test() {
    setBusy('test');
    setError(null);
    setWarning(null);
    try {
      const result = await api.testConnection(companyId, connection.provider);
      onChange(result);
      setWarning(result.warning ?? null);
      if (result.lastError) toast.error(`${connection.label} check failed`);
      else toast.success(`${connection.label} connection works`);
    } catch (err) {
      setError(jobBoardErrorMessage(err));
    } finally {
      setBusy(null);
    }
  }

  async function disconnect() {
    if (!confirm(`Disconnect ${connection.label}? Posts already published stay up; you can still remove them on ${connection.label} itself.`)) return;
    setBusy('remove');
    setError(null);
    try {
      await api.removeConnection(companyId, connection.provider);
      onChange({ ...connection, connected: false, values: {}, accountId: null, accountName: null, expiresAt: null, lastError: null, lastVerifiedAt: null });
      setValues(Object.fromEntries(connection.fields.map((f) => [f.key, ''])));
      setEditing(true);
      toast.success(`${connection.label} disconnected`);
    } catch (err) {
      setError(jobBoardErrorMessage(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex align-items-start flex-wrap" style={{ gap: '1rem' }}>
          <div style={{ width: 72 }} className="text-center">
            {ICONS[connection.provider]}
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <h5 className="mb-1">{connection.label}</h5>
            <div className="small text-muted mb-2">{WHAT_IT_DOES[connection.provider]}</div>
            {connection.connected ? (
              <div className="small">
                <span className={connection.lastError ? 'text-danger' : 'text-success'}>
                  {connection.lastError ? <XCircleFill className="me-1" /> : <CheckCircleFill className="me-1" />}
                  {connection.lastError ? 'Connection problem' : 'Connected'}
                </span>
                {connection.accountName && (
                  <>
                    {' '}
                    — posting as <b>{connection.accountName}</b>
                  </>
                )}
                {connection.lastVerifiedAt && <span className="text-muted"> · checked {formatDate(connection.lastVerifiedAt)}</span>}
                {connection.expiresAt && (
                  <Badge bg={expiresSoon ? 'warning' : 'light'} text="dark" className="ms-2">
                    Token expires {formatDate(connection.expiresAt)}
                  </Badge>
                )}
              </div>
            ) : (
              <Badge bg="secondary">Not connected</Badge>
            )}
          </div>
          {connection.connected && (
            <div className="d-flex flex-wrap" style={{ gap: '0.5rem' }}>
              <Button size="sm" variant="outline-secondary" onClick={test} disabled={!!busy}>
                {busy === 'test' ? <Spinner size="sm" animation="border" /> : 'Test connection'}
              </Button>
              {canEdit && !editing && (
                <Button size="sm" variant="outline-primary" onClick={() => setEditing(true)} disabled={!!busy}>
                  Update credentials
                </Button>
              )}
              {canEdit && (
                <Button size="sm" variant="outline-danger" onClick={disconnect} disabled={!!busy}>
                  {busy === 'remove' ? <Spinner size="sm" animation="border" /> : 'Disconnect'}
                </Button>
              )}
            </div>
          )}
        </div>

        {connection.lastError && (
          <Alert variant="danger" className="mt-3 mb-0 py-2 small">
            {connection.lastError}
          </Alert>
        )}
        {warning && (
          <Alert variant="warning" className="mt-3 mb-0 py-2 small">
            <ExclamationTriangleFill className="me-1" />
            {warning}
          </Alert>
        )}

        {canEdit && editing && (
          <Form onSubmit={save} className="mt-3 border-top pt-3">
            <Button variant="link" size="sm" className="p-0 mb-2" onClick={() => setShowSetup((s) => !s)}>
              {showSetup ? 'Hide' : 'Show'} how to get these credentials
            </Button>
            <Collapse in={showSetup}>
              <div>
                <div className="bg-light border rounded p-3 mb-3">{SETUP[connection.provider]}</div>
              </div>
            </Collapse>
            <div className="row">
              {connection.fields.map((field) => (
                <Form.Group key={field.key} className="col-md-6 mb-3" controlId={`${connection.provider}-${field.key}`}>
                  <Form.Label className="fw-semibold small mb-1">
                    {field.label}
                    {field.required ? <span className="text-danger"> *</span> : <span className="text-muted fw-normal"> (optional)</span>}
                  </Form.Label>
                  <Form.Control
                    type={field.secret ? 'password' : 'text'}
                    autoComplete="off"
                    value={values[field.key] ?? ''}
                    placeholder={field.secret && connection.values[field.key] ? `Saved (${connection.values[field.key]}); leave blank to keep` : ''}
                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  />
                  {field.help && <Form.Text className="text-muted">{field.help}</Form.Text>}
                </Form.Group>
              ))}
            </div>
            {error && (
              <Alert variant="danger" className="py-2 small">
                {error}
              </Alert>
            )}
            <div className="d-flex" style={{ gap: '0.5rem' }}>
              <Button type="submit" disabled={!!busy}>
                {busy === 'save' ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-1" /> Checking with {connection.label}…
                  </>
                ) : connection.connected ? (
                  'Save and verify'
                ) : (
                  'Connect'
                )}
              </Button>
              {connection.connected && (
                <Button
                  variant="outline-secondary"
                  disabled={!!busy}
                  onClick={() => {
                    setEditing(false);
                    setError(null);
                    setValues(initialValues());
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        )}
        {!editing && error && (
          <Alert variant="danger" className="mt-3 mb-0 py-2 small">
            {error}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}
