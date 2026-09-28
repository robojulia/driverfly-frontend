import { useState } from 'react';
import { FileEarmarkPdf } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { Badge, Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Table } from 'reactstrap';
import { useAuth } from '../../hooks/use-auth';
import DocumentApi from '../../pages/api/document';
import MvrApi, { MVR_CATEGORY_LABELS, MVR_PURPOSE_LABELS, MvrOrder } from '../../pages/api/mvr';
import { useEffectAsync } from '../../utils/react';
import { mvrErrorMessage } from './errors';

interface Props {
  orderId: number | null;
  onClose: () => void;
  onSaved?: (order: MvrOrder) => void;
}

const dash = (value?: string | number | null) => (value === undefined || value === null || value === '' ? '—' : value);

/** One pulled record: license, violations, accidents, suspensions, the filed PDF, and review notes. */
export default function MvrReportModal({ orderId, onClose, onSaved }: Props) {
  const { company } = useAuth();
  const companyId = company?.id;
  const api = new MvrApi();

  const [order, setOrder] = useState<MvrOrder | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffectAsync(async () => {
    setOrder(null);
    if (!orderId || !companyId) return;
    try {
      const loaded = await api.getOrder(companyId, orderId);
      setOrder(loaded);
      setNote(loaded.note ?? '');
    } catch (e) {
      toast.error(mvrErrorMessage(e));
      onClose();
    }
  }, [orderId, companyId]);

  async function handleOpenPdf() {
    // Open the tab now: a window opened after an await is treated as a popup and blocked.
    const tab = window.open('', '_blank');
    try {
      const document = await new DocumentApi().getSignedUrl(order.documentId);
      if (tab) tab.location.href = document.path;
      else window.location.href = document.path;
    } catch {
      tab?.close();
      toast.error('Could not open the MVR PDF.');
    }
  }

  async function handleSaveNote() {
    setSaving(true);
    try {
      const saved = await api.updateNote(companyId, order.id, note);
      setOrder((o) => ({ ...o, note: saved.note }));
      onSaved?.(saved);
      toast.success('Review notes saved');
    } catch (e) {
      toast.error(mvrErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  const report = order?.report;

  return (
    <Modal isOpen={!!orderId} toggle={onClose} centered size="xl" scrollable>
      <ModalHeader toggle={onClose}>
        Motor Vehicle Record{order ? `: ${order.driverName}` : ''}
      </ModalHeader>
      <ModalBody>
        {!order ? (
          <div className="text-center p-4">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="d-flex flex-wrap gap-3 align-items-center mb-3 small text-muted">
              <span>
                {MVR_PURPOSE_LABELS[order.purpose]} · pulled {order.completed_at ? new Date(order.completed_at).toLocaleDateString() : '—'} through{' '}
                {order.provider}
              </span>
              {order.assessment && (
                <Badge color={order.assessment === 'CLEAR' ? 'success' : 'warning'} pill>
                  {order.assessment === 'CLEAR' ? 'Clear' : 'Needs review'}
                </Badge>
              )}
              {order.documentId && (
                <Button color="link" size="sm" className="p-0 d-flex align-items-center gap-1" onClick={handleOpenPdf}>
                  <FileEarmarkPdf /> Open report PDF
                </Button>
              )}
            </div>

            {!report ? (
              <div className="text-muted">The record hasn&apos;t come back yet.</div>
            ) : (
              <>
                <h6 className="fw-semibold">License</h6>
                <Table size="sm" bordered className="small mb-4">
                  <tbody>
                    <tr>
                      <th style={{ width: 160 }}>Number</th>
                      <td>{report.license.numberLast4 ? `••••${report.license.numberLast4}` : '—'}</td>
                      <th style={{ width: 160 }}>State</th>
                      <td>{dash(report.license.state)}</td>
                    </tr>
                    <tr>
                      <th>Class / type</th>
                      <td>{[report.license.class, report.license.type].filter(Boolean).join(' · ') || '—'}</td>
                      <th>Status</th>
                      <td>
                        <strong className={/valid/i.test(report.license.status ?? '') && !/in ?valid/i.test(report.license.status ?? '') ? 'text-success' : 'text-danger'}>
                          {dash(report.license.status)}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <th>Issued</th>
                      <td>{dash(report.license.issuedDate)}</td>
                      <th>Expires</th>
                      <td>{dash(report.license.expirationDate)}</td>
                    </tr>
                    <tr>
                      <th>Endorsements</th>
                      <td>{report.license.endorsements?.join(', ') || '—'}</td>
                      <th>Restrictions</th>
                      <td>{report.license.restrictions?.join(', ') || '—'}</td>
                    </tr>
                  </tbody>
                </Table>

                <h6 className="fw-semibold">Violations ({report.violations.length})</h6>
                {report.violations.length === 0 ? (
                  <p className="text-muted small">None reported.</p>
                ) : (
                  <Table size="sm" bordered responsive className="small mb-4">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Conviction</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>State</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.violations.map((v, i) => (
                        <tr key={i} className={v.category === 'DUI' ? 'table-danger' : undefined}>
                          <td>{dash(v.date)}</td>
                          <td>{dash(v.convictionDate)}</td>
                          <td>{v.description}</td>
                          <td>{MVR_CATEGORY_LABELS[v.category] ?? v.category}</td>
                          <td>{dash(v.state)}</td>
                          <td>{dash(v.points)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}

                <h6 className="fw-semibold">Accidents ({report.accidents.length})</h6>
                {report.accidents.length === 0 ? (
                  <p className="text-muted small">None reported.</p>
                ) : (
                  <Table size="sm" bordered responsive className="small mb-4">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>State</th>
                        <th>At fault</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.accidents.map((a, i) => (
                        <tr key={i}>
                          <td>{dash(a.date)}</td>
                          <td>{dash(a.description)}</td>
                          <td>{dash(a.state)}</td>
                          <td>{a.atFault === undefined ? 'Not stated' : a.atFault ? 'Yes' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}

                <h6 className="fw-semibold">Suspensions / revocations ({report.suspensions.length})</h6>
                {report.suspensions.length === 0 ? (
                  <p className="text-muted small">None reported.</p>
                ) : (
                  <Table size="sm" bordered responsive className="small mb-4">
                    <thead>
                      <tr>
                        <th>Start</th>
                        <th>End</th>
                        <th>Reinstated</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.suspensions.map((s, i) => (
                        <tr key={i}>
                          <td>{dash(s.startDate)}</td>
                          <td>{dash(s.endDate)}</td>
                          <td>{dash(s.reinstatementDate)}</td>
                          <td>{dash(s.description)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </>
            )}

            <label className="form-label fw-semibold mt-2">Review notes</label>
            <textarea
              className="form-control"
              rows={3}
              maxLength={4000}
              placeholder="e.g. Reviewed by J. Smith on 9/28: meets minimum requirements for safe driving (49 CFR 391.25(b))."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose}>
          Close
        </Button>
        <Button color="primary" onClick={handleSaveNote} disabled={!order || saving || note === (order?.note ?? '')}>
          {saving ? <Spinner size="sm" className="me-1" /> : null} Save notes
        </Button>
      </ModalFooter>
    </Modal>
  );
}
