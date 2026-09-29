import Link from 'next/link';
import { useState } from 'react';
import { Alert, Badge, Button, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { BoxArrowUpRight, CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { JobEntity } from '../../models/job/job.entity';
import JobBoardsApi, {
  JOB_BOARD_LABELS,
  JobBoardConnection,
  JobBoardPosting,
  JobBoardPreview,
  JobBoardProvider,
  jobBoardErrorMessage,
} from '../../pages/api/job-boards';
import { useEffectAsync } from '../../utils/react';

export const JOB_BOARD_SETTINGS_PATH = '/dashboard/company/settings/integrations/facebook';

function when(value: string) {
  return new Date(value).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function PostToJobBoardsModal({ show, job, companyId, onClose }: { show: boolean; job: JobEntity; companyId: number; onClose: () => void }) {
  const [connections, setConnections] = useState<JobBoardConnection[] | null>(null);
  const [postings, setPostings] = useState<JobBoardPosting[]>([]);
  const [previews, setPreviews] = useState<JobBoardPreview[]>([]);
  const [selected, setSelected] = useState<Set<JobBoardProvider>>(new Set());
  const [loadError, setLoadError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState<JobBoardPosting[] | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const api = new JobBoardsApi();

  useEffectAsync(async () => {
    if (!show || !companyId || !job?.id) return;
    setResults(null);
    setLoadError(null);
    try {
      const [c, p, v] = await Promise.all([api.getConnections(companyId), api.getPostings(companyId, job.id), api.getPreview(companyId, job.id)]);
      setConnections(c);
      setPostings(p);
      setPreviews(v);
      setSelected(new Set(c.filter((x) => x.connected && !x.lastError).map((x) => x.provider)));
    } catch (e) {
      setLoadError(jobBoardErrorMessage(e, 'Could not load job boards'));
    }
  }, [show, companyId, job?.id]);

  const toggle = (provider: JobBoardProvider) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(provider)) next.delete(provider);
      else next.add(provider);
      return next;
    });

  const livePost = (provider: JobBoardProvider) => postings.find((p) => p.provider === provider && p.status === 'posted');

  async function publish() {
    setPosting(true);
    setResults(null);
    try {
      const out = await api.publish(companyId, job.id, [...selected]);
      setResults(out);
      setPostings(await api.getPostings(companyId, job.id));
      const ok = out.filter((r) => r.status === 'posted').length;
      if (ok === out.length) toast.success(`Posted to ${out.map((r) => JOB_BOARD_LABELS[r.provider]).join(', ')}`);
      else if (ok) toast.warn(`Posted to ${ok} of ${out.length} job boards`);
      else toast.error('Posting failed');
    } catch (e) {
      toast.error(jobBoardErrorMessage(e, 'Posting failed'));
    } finally {
      setPosting(false);
    }
  }

  async function remove(p: JobBoardPosting) {
    const what = p.provider === 'indeed' ? 'Expire this Indeed listing' : `Delete this post from ${JOB_BOARD_LABELS[p.provider]}`;
    if (!confirm(`${what}?`)) return;
    setRemovingId(p.id);
    try {
      const updated = await api.removePosting(companyId, p.id);
      setPostings((list) => list.map((x) => (x.id === updated.id ? updated : x)));
      toast.success('Removed');
    } catch (e) {
      toast.error(jobBoardErrorMessage(e, 'Could not remove the post'));
    } finally {
      setRemovingId(null);
    }
  }

  const socialPreview = previews.find((p) => p.provider === 'facebook') ?? previews[0];
  const anyConnected = connections?.some((c) => c.connected);

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Post to job boards</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-start">
        <div className="mb-3 fs-5 fw-semibold">{job.title}</div>
        {loadError && <Alert variant="danger">{loadError}</Alert>}
        {!connections && !loadError && (
          <div className="text-center p-4">
            <Spinner animation="border" />
          </div>
        )}

        {connections && (
          <>
            {!anyConnected && (
              <Alert variant="info">
                No job boards are connected yet. Add your Facebook, LinkedIn or Indeed credentials in{' '}
                <Link href={JOB_BOARD_SETTINGS_PATH}>Settings → Integrations → Job Boards</Link>.
              </Alert>
            )}

            {connections.map((c) => {
              const live = livePost(c.provider);
              return (
                <div key={c.provider} className="d-flex align-items-center border rounded p-2 mb-2" style={{ gap: '0.75rem' }}>
                  <Form.Check
                    id={`post-${c.provider}`}
                    checked={selected.has(c.provider)}
                    disabled={!c.connected || posting}
                    onChange={() => toggle(c.provider)}
                    label={<b>{JOB_BOARD_LABELS[c.provider]}</b>}
                  />
                  <div className="small text-muted" style={{ flex: 1 }}>
                    {!c.connected ? (
                      <>
                        Not connected · <Link href={JOB_BOARD_SETTINGS_PATH}>connect</Link>
                      </>
                    ) : c.lastError ? (
                      <span className="text-danger">Connection problem: {c.lastError}</span>
                    ) : (
                      <>as {c.accountName}</>
                    )}
                  </div>
                  {live && (
                    <Badge bg="success" className="fw-normal">
                      {c.provider === 'indeed' ? 'Listed' : 'Posted'} {when(live.updated_at)}
                    </Badge>
                  )}
                </div>
              );
            })}
            {selected.has('indeed') && livePost('indeed') && <div className="small text-muted mb-2">Indeed already lists this job; posting again updates that listing.</div>}
            {[...selected].some((p) => p !== 'indeed' && livePost(p)) && (
              <div className="small text-muted mb-2">Facebook and LinkedIn posts are new posts each time; remove the earlier one below if you are replacing it.</div>
            )}

            {socialPreview && (
              <div className="mb-3">
                <Button variant="link" size="sm" className="p-0" onClick={() => setShowPreview((s) => !s)}>
                  {showPreview ? 'Hide' : 'Preview'} post text
                </Button>
                {showPreview && (
                  <pre className="bg-light border rounded p-2 small mt-2 mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {socialPreview.text}
                  </pre>
                )}
              </div>
            )}

            {results && (
              <div className="mb-3">
                {results.map((r) => (
                  <Alert key={`${r.provider}-${r.id}`} variant={r.status === 'posted' ? 'success' : 'danger'} className="py-2 small mb-2">
                    {r.status === 'posted' ? <CheckCircleFill className="me-1" /> : <XCircleFill className="me-1" />}
                    <b>{JOB_BOARD_LABELS[r.provider]}:</b>{' '}
                    {r.status === 'posted' ? (
                      <>
                        {r.provider === 'indeed' ? 'listed' : 'posted'}.{' '}
                        {r.externalUrl && (
                          <a href={r.externalUrl} target="_blank" rel="noopener noreferrer">
                            View <BoxArrowUpRight size={11} />
                          </a>
                        )}
                      </>
                    ) : (
                      r.error
                    )}
                  </Alert>
                ))}
              </div>
            )}

            {postings.length > 0 && (
              <>
                <div className="fw-semibold small mb-1">History</div>
                <Table size="sm" responsive className="small mb-0">
                  <thead>
                    <tr>
                      <th>Board</th>
                      <th>Status</th>
                      <th>When</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {postings.map((p) => (
                      <tr key={p.id}>
                        <td>{JOB_BOARD_LABELS[p.provider]}</td>
                        <td>
                          {p.status === 'posted' && <Badge bg="success">Live</Badge>}
                          {p.status === 'removed' && <Badge bg="secondary">Removed</Badge>}
                          {p.status === 'failed' && (
                            <span className="text-danger" title={p.error ?? ''}>
                              Failed{p.error ? `: ${p.error.length > 90 ? `${p.error.slice(0, 90)}…` : p.error}` : ''}
                            </span>
                          )}
                        </td>
                        <td className="text-nowrap">{when(p.updated_at)}</td>
                        <td className="text-end text-nowrap">
                          {p.externalUrl && p.status !== 'failed' && (
                            <a href={p.externalUrl} target="_blank" rel="noopener noreferrer" className="me-2">
                              View
                            </a>
                          )}
                          {p.status === 'posted' && (
                            <Button variant="link" size="sm" className="p-0 text-danger small align-baseline" style={{ fontSize: 'inherit' }} onClick={() => remove(p)} disabled={removingId === p.id}>
                              {removingId === p.id ? <Spinner size="sm" animation="border" /> : 'Remove'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={posting}>
          Close
        </Button>
        <Button onClick={publish} disabled={posting || selected.size === 0 || !connections}>
          {posting ? (
            <>
              <Spinner size="sm" animation="border" className="me-1" /> Posting…
            </>
          ) : (
            `Post to ${selected.size || ''} ${selected.size === 1 ? 'board' : 'boards'}`
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
