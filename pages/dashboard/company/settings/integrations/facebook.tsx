import { useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Badge,
  Spinner,
} from 'reactstrap';
import {
  PlusCircle,
  Trash,
  Facebook,
  CheckCircleFill,
  XCircleFill,
  ExclamationTriangleFill,
  ClipboardCheck,
  Download,
  BoxArrowUpRight,
} from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../../components/layouts/page/page-layout';
import { TabbedLayout } from '../../../../../components/layouts/page/tabbed-layout';
import { useAuth } from '../../../../../hooks/use-auth';
import { useEffectAsync } from '../../../../../utils/react';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';
import { useTranslation } from '../../../../../hooks/use-translation';
import FbLeadsApi from '../../../../api/fb-leads';
import JobApi from '../../../../api/job';
import BaseApi from '../../../../api/_baseApi';
import { FacebookFormJobMapping } from '../../../../../models/integrations/providers/facebook/facebook-lead-types';
import { JobEntity } from '../../../../../models/job/job.entity';
import { JobIndeedExporter } from '../../../../../utils/job-indeed-exporter';

// ─── Indeed token API helper ───────────────────────────────────────────────────
class IndeedApi extends BaseApi {
  async getToken(companyId: number): Promise<{ token: string; feedUrl: string }> {
    const { data } = await this.get(`/api/indeed/token?companyId=${companyId}`, {
      baseURL: typeof window !== 'undefined' ? window.location.origin : '',
    });
    return data;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const { company } = useAuth();
  const { t } = useTranslation();
  const companyId = company?.id;

  // Shared jobs list (used by both tabs)
  const [jobs, setJobs] = useState<JobEntity[]>([]);

  useEffectAsync(async () => {
    if (!companyId) return;
    try {
      const result = await new JobApi().list({ limit: 200 } as any);
      const list = Array.isArray(result) ? result : (result as any).items ?? (result as any).data ?? [];
      setJobs(list);
    } catch {
      // non-fatal
    }
  }, [companyId]);

  return (
    <PageLayout title="Integrations">
      <TabbedLayout
        items={{
          'Facebook Lead Ads': { item: <FacebookTab companyId={companyId} jobs={jobs} t={t} /> },
          'Indeed Job Posting': { item: <IndeedTab companyId={companyId} jobs={jobs} company={company} /> },
        }}
      />
    </PageLayout>
  );
}

IntegrationsPage.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

// ─── Facebook tab ─────────────────────────────────────────────────────────────

function FacebookTab({ companyId, jobs, t }: { companyId: number; jobs: JobEntity[]; t: any }) {
  const [status, setStatus] = useState<{ connected: boolean; pageId?: string; pageName?: string } | null>(null);
  const [mappings, setMappings] = useState<FacebookFormJobMapping[]>([]);
  const [pageForms, setPageForms] = useState<{ id: string; name: string }[]>([]);

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingMappings, setLoadingMappings] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newMapping, setNewMapping] = useState({ form_id: '', job_id: '', ad_id: '' });

  const api = new FbLeadsApi();

  useEffectAsync(async () => {
    if (!companyId) return;
    try {
      const s = await api.getConnectionStatus(companyId);
      setStatus(s);
      if (s.connected) await loadMappingsAndForms();
    } catch {
      setStatus({ connected: false });
    } finally {
      setLoadingStatus(false);
    }
  }, [companyId]);

  async function loadMappingsAndForms() {
    setLoadingMappings(true);
    try {
      const [m, f] = await Promise.all([
        api.getFormJobMappings(companyId),
        api.getPageForms(companyId),
      ]);
      setMappings(m);
      setPageForms(f);
    } catch {
      toast.error('Failed to load Facebook data');
    } finally {
      setLoadingMappings(false);
    }
  }

  async function handleConnect() {
    try {
      const { redirectUrl } = await api.fbLogin(companyId);
      window.location.href = redirectUrl;
    } catch (e) {
      globalAjaxExceptionHandler(e, { toast, t });
    }
  }

  async function handleDisconnect() {
    if (!confirm('Disconnect Facebook? Existing mappings will be removed.')) return;
    setDisconnecting(true);
    try {
      await api.disconnect(companyId);
      setStatus({ connected: false });
      setMappings([]);
      setPageForms([]);
      toast.success('Facebook disconnected');
    } catch (e) {
      globalAjaxExceptionHandler(e, { toast, t });
    } finally {
      setDisconnecting(false);
    }
  }

  async function handleAddMapping() {
    if (!newMapping.form_id || !newMapping.job_id) {
      toast.error('Please select a form and a job');
      return;
    }
    setSaving(true);
    try {
      const form = pageForms.find((f) => f.id === newMapping.form_id);
      await api.createFormJobMapping({
        form_id: newMapping.form_id,
        job_id: Number(newMapping.job_id),
        ad_id: newMapping.ad_id || undefined,
        form_name: form?.name,
        company_id: companyId,
      });
      toast.success('Mapping saved');
      setModalOpen(false);
      setNewMapping({ form_id: '', job_id: '', ad_id: '' });
      await loadMappingsAndForms();
    } catch (e) {
      globalAjaxExceptionHandler(e, { toast, t });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMapping(id: number) {
    if (!confirm('Remove this mapping?')) return;
    setDeletingId(id);
    try {
      await api.deleteFormJobMapping(id);
      setMappings((prev) => prev.filter((m) => m.id !== id));
      toast.success('Mapping removed');
    } catch (e) {
      globalAjaxExceptionHandler(e, { toast, t });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="pt-3">
      {/* Connection card */}
      <div className="card mb-4">
        <div className="card-body d-flex align-items-center" style={{ gap: '1rem' }}>
          <Facebook size={36} color="#1877f2" />
          <div style={{ flex: 1 }}>
            <h5 className="mb-0">Facebook Page Connection</h5>
            {loadingStatus ? (
              <small className="text-muted">Checking status…</small>
            ) : status?.connected ? (
              <small className="text-success d-flex align-items-center gap-1">
                <CheckCircleFill /> Connected to <strong>{status.pageName ?? status.pageId}</strong>
              </small>
            ) : (
              <small className="text-muted d-flex align-items-center gap-1">
                <XCircleFill /> Not connected
              </small>
            )}
          </div>
          {!loadingStatus && (
            status?.connected ? (
              <Button color="outline-danger" size="sm" onClick={handleDisconnect} disabled={disconnecting}>
                {disconnecting ? <Spinner size="sm" /> : 'Disconnect'}
              </Button>
            ) : (
              <Button color="primary" onClick={handleConnect} style={{ backgroundColor: '#1877f2', borderColor: '#1877f2' }}>
                <Facebook className="me-1" /> Connect Facebook Page
              </Button>
            )
          )}
        </div>
        {!status?.connected && !loadingStatus && (
          <div className="card-footer text-muted small">
            Connect your Facebook Page to automatically import leads from your Lead Ad forms as new applicant profiles.
          </div>
        )}
      </div>

      {/* Mappings */}
      {status?.connected && (
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span className="fw-semibold">Form → Job Mappings</span>
            <Button color="primary" size="sm" onClick={() => setModalOpen(true)}>
              <PlusCircle className="me-1" /> Add Mapping
            </Button>
          </div>
          <div className="card-body p-0">
            {loadingMappings ? (
              <div className="text-center p-4"><Spinner /></div>
            ) : mappings.length === 0 ? (
              <div className="text-center text-muted p-4">
                <p className="mb-1">No mappings yet.</p>
                <small>Add a mapping to route leads from a Facebook form to a specific job opening.</small>
              </div>
            ) : (
              <Table hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th>Facebook Form</th>
                    <th>Job</th>
                    <th>Ad ID (optional)</th>
                    <th style={{ width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {mappings.map((m) => {
                    const job = jobs.find((j) => j.id === m.job_id);
                    return (
                      <tr key={m.id}>
                        <td>
                          <div>{m.form_name ?? m.form_id}</div>
                          {m.form_name && <small className="text-muted">{m.form_id}</small>}
                        </td>
                        <td>{job?.title ?? `Job #${m.job_id}`}</td>
                        <td>
                          {m.ad_id
                            ? <Badge color="secondary" pill>{m.ad_id}</Badge>
                            : <span className="text-muted">—</span>}
                        </td>
                        <td className="text-center">
                          <Button
                            color="link" size="sm" className="text-danger p-0"
                            onClick={() => handleDeleteMapping(m.id)}
                            disabled={deletingId === m.id}
                          >
                            {deletingId === m.id ? <Spinner size="sm" /> : <Trash />}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </div>
          <div className="card-footer text-muted small">
            <strong>How it works:</strong> When a lead is submitted on a Facebook form, DriverFly matches the
            form ID to the mapping below and automatically links the new applicant to the correct job.
          </div>
        </div>
      )}

      {/* Add Mapping Modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} centered>
        <ModalHeader toggle={() => setModalOpen(false)}>Add Form → Job Mapping</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <label className="form-label fw-semibold">Facebook Lead Form</label>
            {pageForms.length > 0 ? (
              <select
                className="form-select"
                value={newMapping.form_id}
                onChange={(e) => setNewMapping((p) => ({ ...p, form_id: e.target.value }))}
              >
                <option value="">— Select a form —</option>
                {pageForms.map((f) => (
                  <option key={f.id} value={f.id}>{f.name} ({f.id})</option>
                ))}
              </select>
            ) : (
              <div className="text-muted small p-2 border rounded">
                No Lead Ad forms found on the connected page. Create a Lead Ad form in Meta Ads Manager first.
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Job Opening</label>
            <select
              className="form-select"
              value={newMapping.job_id}
              onChange={(e) => setNewMapping((p) => ({ ...p, job_id: e.target.value }))}
            >
              <option value="">— Select a job —</option>
              {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>
          <div className="mb-1">
            <label className="form-label fw-semibold">
              Ad ID <span className="text-muted fw-normal">(optional)</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Leave blank to match all ads using this form"
              value={newMapping.ad_id}
              onChange={(e) => setNewMapping((p) => ({ ...p, ad_id: e.target.value }))}
            />
            <div className="form-text">
              Specify an Ad ID to route leads from one specific ad to a different job.
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
          <Button color="primary" onClick={handleAddMapping} disabled={saving}>
            {saving ? <Spinner size="sm" className="me-1" /> : null} Save Mapping
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

// ─── Indeed tab ───────────────────────────────────────────────────────────────

function IndeedTab({ companyId, jobs, company }: { companyId: number; jobs: JobEntity[]; company: any }) {
  const [feedUrl, setFeedUrl] = useState<string | null>(null);
  const [loadingUrl, setLoadingUrl] = useState(true);
  const [copied, setCopied] = useState(false);

  // Validation
  const validJobs = jobs.filter((j) => JobIndeedExporter.validateJobForIndeed(j).valid);
  const invalidJobs = jobs
    .map((j) => ({ job: j, result: JobIndeedExporter.validateJobForIndeed(j) }))
    .filter(({ result }) => !result.valid);

  useEffectAsync(async () => {
    if (!companyId) return;
    try {
      const api = new IndeedApi();
      const { feedUrl: url } = await api.getToken(companyId);
      setFeedUrl(url);
    } catch {
      // Secret not configured — build unprotected URL as fallback
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      setFeedUrl(`${origin}/api/indeed/feed?companyId=${companyId}`);
    } finally {
      setLoadingUrl(false);
    }
  }, [companyId]);

  function handleCopy() {
    if (!feedUrl) return;
    navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    toast.success('Feed URL copied!');
    setTimeout(() => setCopied(false), 3000);
  }

  function handleDownload() {
    if (!company || validJobs.length === 0) {
      toast.error('No valid jobs to export');
      return;
    }
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const xml = JobIndeedExporter.generateXMLFeed(validJobs, company, baseUrl);
    JobIndeedExporter.downloadXMLFeed(xml, `indeed-feed-${companyId}.xml`);
    toast.success('XML downloaded');
  }

  return (
    <div className="pt-3">
      {/* Feed URL card */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3" style={{ gap: '0.75rem' }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Indeed_logo.svg"
              alt="Indeed"
              style={{ height: 28, objectFit: 'contain' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <h5 className="mb-0">Indeed XML Feed</h5>
          </div>

          <p className="text-muted small mb-3">
            Copy the feed URL below and submit it to the{' '}
            <a href="https://employers.indeed.com" target="_blank" rel="noopener noreferrer">
              Indeed Employer Console <BoxArrowUpRight size={12} />
            </a>. Indeed will crawl it every 15–60 minutes to keep your listings up-to-date.
          </p>

          {loadingUrl ? (
            <div className="d-flex align-items-center gap-2 text-muted">
              <Spinner size="sm" /> Generating feed URL…
            </div>
          ) : (
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control form-control-sm font-monospace"
                value={feedUrl ?? ''}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button color={copied ? 'success' : 'outline-secondary'} size="sm" onClick={handleCopy}>
                {copied ? <><ClipboardCheck className="me-1" /> Copied</> : 'Copy URL'}
              </Button>
              <Button color="outline-secondary" size="sm" onClick={handleDownload} title="Download XML file">
                <Download />
              </Button>
            </div>
          )}

          <div className="alert alert-info py-2 mb-0 small">
            <strong>Next steps:</strong>
            <ol className="mb-0 mt-1">
              <li>Copy the feed URL above</li>
              <li>Log in to <a href="https://employers.indeed.com" target="_blank" rel="noopener noreferrer">employers.indeed.com</a></li>
              <li>Go to <strong>Job Posting → XML Feed</strong> and submit the URL</li>
              <li>Indeed will automatically sync your jobs within the hour</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Job readiness card */}
      <div className="card">
        <div className="card-header fw-semibold">Job Readiness</div>
        <div className="card-body">
          {jobs.length === 0 ? (
            <p className="text-muted mb-0">No active jobs found.</p>
          ) : (
            <>
              <div className="d-flex gap-3 mb-3">
                <span className="text-success d-flex align-items-center gap-1">
                  <CheckCircleFill />
                  <strong>{validJobs.length}</strong> ready for Indeed
                </span>
                {invalidJobs.length > 0 && (
                  <span className="text-warning d-flex align-items-center gap-1">
                    <ExclamationTriangleFill />
                    <strong>{invalidJobs.length}</strong> missing required fields
                  </span>
                )}
              </div>

              {invalidJobs.length > 0 && (
                <Table size="sm" responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Job</th>
                      <th>Missing Fields</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invalidJobs.map(({ job, result }) => (
                      <tr key={job.id}>
                        <td>{job.title}</td>
                        <td>
                          {result.errors.map((e) => (
                            <Badge key={e} color="warning" className="me-1 text-dark">{e}</Badge>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </div>
        {invalidJobs.length > 0 && (
          <div className="card-footer text-muted small">
            Edit these jobs and fill in the missing fields (Title, Description, City, State, Zip Code) to include them in the feed.
          </div>
        )}
      </div>
    </div>
  );
}
