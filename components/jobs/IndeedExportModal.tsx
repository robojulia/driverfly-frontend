import React from 'react';
import { Modal, Button, Badge, ListGroup } from 'react-bootstrap';
import { BoxArrowUpRight } from 'react-bootstrap-icons';
import { JobEntity } from '../../models/job/job.entity';
import { JobBenefits } from '../../enums/jobs/job-benefits.enum';
import { JobEmploymentType } from '../../enums/jobs/job-employment-type.enum';
import { JobPayMethod } from '../../enums/jobs/job-pay-method.enum';
import { JobPayFrequency } from '../../enums/jobs/job-pay-frequency.enum';

interface IndeedExportModalProps {
  show: boolean;
  jobs: JobEntity[];
  companyId: number;
  onClose: () => void;
}

const INDEED_BENEFITS: { label: string; values: JobBenefits[] }[] = [
  { label: 'Health insurance', values: [JobBenefits.MEDICAL] },
  { label: 'Pet rider program', values: [JobBenefits.PETS_ALLOWED] },
  { label: '401(k)', values: [JobBenefits.RETIREMENT_401K] },
  { label: '401(k) matching', values: [JobBenefits.RETIREMENT_401K] },
  { label: 'Retirement plan', values: [JobBenefits.RETIREMENT_401K] },
  { label: 'Paid time off', values: [] },
  { label: 'Dental insurance', values: [JobBenefits.DENTAL] },
  { label: 'Vision insurance', values: [JobBenefits.VISION] },
  { label: 'Passenger ride along program', values: [JobBenefits.RIDER_POLICY] },
  { label: 'Paid orientation', values: [] },
  { label: 'Referral program', values: [] },
  { label: 'Life insurance', values: [] },
  { label: 'Disability insurance', values: [] },
  { label: 'Paid training', values: [JobBenefits.PAID_TRAINING] },
  { label: 'Fuel discount', values: [JobBenefits.FUEL_CARD] },
  { label: 'Fuel card', values: [JobBenefits.FUEL_CARD] },
  { label: 'Tuition reimbursement', values: [] },
  { label: 'Health savings account', values: [] },
  { label: 'Flexible spending account', values: [] },
  { label: 'Lease purchase program', values: [] },
  { label: 'AD&D insurance', values: [] },
  { label: 'Prescription drug insurance', values: [] },
  { label: 'Employee assistance program', values: [] },
  { label: 'Parental leave', values: [] },
  { label: 'Employee discount', values: [] },
  { label: 'Employee stock purchase plan', values: [] },
  { label: 'Paid toll fees', values: [JobBenefits.TOLL_ROAD_PASS] },
  { label: 'Profit sharing', values: [] },
  { label: 'Safety equipment provided', values: [] },
  { label: 'Paid sick time', values: [] },
  { label: 'Cell phone reimbursement', values: [] },
  { label: 'Employee stock ownership plan', values: [] },
];

function formatEmploymentType(type?: JobEmploymentType): string {
  switch (type) {
    case JobEmploymentType.W2: return 'Full-time (W2)';
    case JobEmploymentType.CONTRACT: return 'Contract (1099)';
    case JobEmploymentType.OWNER_OPERATOR: return 'Contract (Owner-Operator)';
    case JobEmploymentType.PART_TIME: return 'Part-time';
    case JobEmploymentType.SEASONAL: return 'Temporary (Seasonal)';
    case JobEmploymentType.ONE_TIME_GIG: return 'Temporary (One-time Gig)';
    default: return '—';
  }
}

function formatPayFrequency(freq?: JobPayFrequency): string {
  switch (freq) {
    case JobPayFrequency.WEEKLY: return 'Weekly';
    case JobPayFrequency.BIWEEKLY: return 'Bi-weekly';
    case JobPayFrequency.BIMONTHLY: return 'Bi-monthly';
    case JobPayFrequency.MONTHLY: return 'Monthly';
    case JobPayFrequency.PRE_LOAD: return 'Per load';
    default: return '—';
  }
}

function formatPayRange(job: JobEntity): string {
  const fmt = (n?: number) => n != null ? `$${n.toLocaleString()}` : null;
  switch (job.pay_method) {
    case JobPayMethod.SALARY:
      if (job.min_salary || job.max_salary)
        return [fmt(job.min_salary), fmt(job.max_salary)].filter(Boolean).join(' – ') + ' /year';
      return '—';
    case JobPayMethod.HOURLY:
      if (job.min_rate || job.max_rate)
        return [fmt(job.min_rate), fmt(job.max_rate)].filter(Boolean).join(' – ') + ' /hour';
      return '—';
    case JobPayMethod.RATE_PER_MILE:
      if (job.min_rate || job.max_rate) {
        const r = [job.min_rate, job.max_rate].filter(n => n != null);
        return r.map(n => `$${n}`).join(' – ') + ' /mile';
      }
      return '—';
    case JobPayMethod.SET_WEEKLY:
      if (job.min_weekly_pay || job.max_weekly_pay)
        return [fmt(job.min_weekly_pay), fmt(job.max_weekly_pay)].filter(Boolean).join(' – ') + ' /week';
      return '—';
    case JobPayMethod.PERCENT_PER_MOVE:
      if (job.min_percent || job.max_percent)
        return [job.min_percent, job.max_percent].filter(n => n != null).map(n => `${n}%`).join(' – ') + ' per move';
      return '—';
    case JobPayMethod.PERCENT_PER_WEIGHT:
      if (job.min_percent || job.max_percent)
        return [job.min_percent, job.max_percent].filter(n => n != null).map(n => `${n}%`).join(' – ') + ' per weight';
      return '—';
    case JobPayMethod.OPEN_TO_NEGOTIATE:
      return 'Open to negotiate';
    default:
      return '—';
  }
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr>
      <td className="fw-semibold text-muted" style={{ width: '40%', paddingRight: '1rem', verticalAlign: 'top' }}>
        {label}
      </td>
      <td style={{ verticalAlign: 'top' }}>{value || '—'}</td>
    </tr>
  );
}

export function IndeedExportModal({ show, jobs, onClose }: IndeedExportModalProps) {
  const job = jobs[0];

  if (!job) return null;

  const jobBenefits = job.benefits || [];
  const activeBenefits = INDEED_BENEFITS.filter(b =>
    b.values.length > 0 && b.values.some(v => jobBenefits.includes(v))
  );

  return (
    <Modal show={show} onHide={onClose} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Post to Indeed</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Indeed link button */}
        <div className="mb-4">
          <Button
            variant="warning"
            href="https://employers.indeed.com/job-posting/choose-flow"
            target="_blank"
            rel="noopener noreferrer"
            className="w-100 fw-bold"
            style={{ fontSize: '1rem' }}
          >
            Go to Indeed Job Posting <BoxArrowUpRight className="ms-2" />
          </Button>
          <p className="text-muted small mt-2 mb-0">
            Use the field values below to fill in your Indeed job posting.
          </p>
        </div>

        {/* Job fields table */}
        <table className="table table-borderless mb-0" style={{ fontSize: '0.95rem' }}>
          <tbody>
            <FieldRow label="Job Title" value={job.title} />
            <FieldRow label="Location Type" value="On the road" />
            <FieldRow label="Consistent Starting Location?" value="No" />
            <FieldRow
              label="Operating Area"
              value={[job.location?.city, job.location?.state].filter(Boolean).join(', ') || '—'}
            />
            <FieldRow
              label="Number of People to Hire"
              value={job.drivers_needed != null ? String(job.drivers_needed) : '—'}
            />
            <FieldRow label="Job Type" value={formatEmploymentType(job.employment_type)} />
            <FieldRow label="Pay Range" value={formatPayRange(job)} />
            <FieldRow label="Pay Period" value={formatPayFrequency(job.pay_frequency)} />
            <FieldRow
              label="Benefits"
              value={
                activeBenefits.length > 0 ? (
                  <div className="d-flex flex-wrap gap-1">
                    {activeBenefits.map(b => (
                      <Badge key={b.label} bg="secondary" className="fw-normal">
                        {b.label}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted">None selected</span>
                )
              }
            />
            <FieldRow
              label="Job Description"
              value={
                job.description ? (
                  <div
                    className="border rounded p-2 bg-light"
                    style={{ maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}
                  >
                    {job.description}
                  </div>
                ) : null
              }
            />
          </tbody>
        </table>

        {/* Full benefits reference list */}
        <div className="mt-4">
          <p className="fw-semibold mb-2 text-muted small">All available Indeed benefits (select on Indeed):</p>
          <div className="d-flex flex-wrap gap-1">
            {INDEED_BENEFITS.map(b => {
              const active = b.values.length > 0 && b.values.some(v => jobBenefits.includes(v));
              return (
                <Badge key={b.label} bg={active ? 'success' : 'light'} text={active ? 'white' : 'dark'} className="fw-normal border">
                  {b.label}
                </Badge>
              );
            })}
          </div>
          <p className="text-muted small mt-2 mb-0">
            <span className="badge bg-success me-1 fw-normal">green</span> = matched from your job listing
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="warning"
          href="https://employers.indeed.com/job-posting/choose-flow"
          target="_blank"
          rel="noopener noreferrer"
        >
          Post to Indeed <BoxArrowUpRight className="ms-2" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
