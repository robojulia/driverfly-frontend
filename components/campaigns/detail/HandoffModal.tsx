import React from 'react';
import { useFormik } from 'formik';
import { Modal, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CampaignTargetEntity, CampaignCallSummary } from '../../../models/campaigns/campaign-target.entity';
import { UserEntity } from '../../../models/user/user.entity';
import { CreateHandoffDto } from '../../../models/campaigns/create-handoff.dto';
import BaseSelect from '../../forms/base-select';
import BaseTextArea from '../../forms/base-text-area';

interface HandoffModalProps {
  show: boolean;
  onHide: () => void;
  target: CampaignTargetEntity | null;
  users: UserEntity[];
  /** Resolve a user id when "Auto-assign" is chosen. Returns null when none available. */
  resolveAutoAssignee?: () => Promise<number | null>;
  onSubmit: (dto: CreateHandoffDto) => Promise<void>;
}

const AUTO_ASSIGN_VALUE = 'auto';

const userLabel = (u: UserEntity) =>
  [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email || `User #${u.id}`;

export default function HandoffModal({
  show,
  onHide,
  target,
  users,
  resolveAutoAssignee,
  onSubmit,
}: HandoffModalProps) {
  const summary = target?.metadata?.campaignCallSummary as CampaignCallSummary | undefined;

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      assignee: '' as string,
      notes: '',
    },
    onSubmit: async (values) => {
      if (!target) return;
      try {
        let assignedUserId: number | undefined;
        if (values.assignee === AUTO_ASSIGN_VALUE) {
          const resolved = resolveAutoAssignee ? await resolveAutoAssignee() : null;
          if (!resolved) {
            toast.error('No active recruiter is available for auto-assignment.');
            return;
          }
          assignedUserId = resolved;
        } else if (values.assignee) {
          assignedUserId = Number(values.assignee);
        } else {
          toast.error('Please choose who to hand this driver off to.');
          return;
        }

        await onSubmit({
          campaignTargetId: target.id as number,
          assignedUserId,
          notes: values.notes || undefined,
        });

        toast.success('Driver handed off successfully.');
        form.resetForm();
        onHide();
      } catch (e) {
        console.error('Failed to create handoff', e);
        toast.error('Failed to hand off driver. Please try again.');
      }
    },
  });

  const assigneeOptions = [
    { value: AUTO_ASSIGN_VALUE, label: 'Auto-assign (round-robin / weighted)' },
    ...users.map((u) => ({ value: String(u.id), label: userLabel(u) })),
  ];

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        :global(.modal-body label) {
          font-size: 14px !important;
          font-weight: 500 !important;
          text-align: left !important;
          display: block !important;
          margin-bottom: 0.25rem !important;
        }
      `}</style>
      <form onSubmit={form.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Hand off {target?.name || 'driver'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">
            Route this driver to a recruiter who will take over the follow-up. They will be
            notified by email and the handoff will appear in their inbox.
          </p>

          {summary && (
            <div className="bg-light border rounded p-3 mb-4">
              <div className="fw-semibold mb-1">AI Call Summary</div>
              <p className="mb-2 small">{summary.summary}</p>
              {summary.outcome && (
                <Badge bg="secondary" className="text-uppercase">
                  {summary.outcome}
                </Badge>
              )}
            </div>
          )}

          <BaseSelect
            className="mb-4"
            label="Assign to"
            name="assignee"
            options={assigneeOptions}
            formik={form}
            placeholder="Select a recruiter"
            required
          />

          <BaseTextArea
            className="mb-2"
            label="Notes (optional)"
            name="notes"
            rows={3}
            maxLength={1000}
            formik={form}
            placeholder="Context for the recruiter (e.g. interested in regional routes, call back after 5pm)"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={form.isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={form.isSubmitting}>
            {form.isSubmitting ? 'Handing off…' : 'Hand off'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
