import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface PartnerSurveyModalProps {
  show: boolean;
  onClose: () => void;
}

interface SurveyForm {
  name: string;
  company: string;
  email: string;
  mostLiked: string;
  leastLiked: string;
  missing: string;
  bugs: string;
  otherComments: string;
}

const EMPTY_FORM: SurveyForm = {
  name: '',
  company: '',
  email: '',
  mostLiked: '',
  leastLiked: '',
  missing: '',
  bugs: '',
  otherComments: '',
};

const BRAND = '#006078';

export const PartnerSurveyModal: React.FC<PartnerSurveyModalProps> = ({ show, onClose }) => {
  const [form, setForm] = useState<SurveyForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const handleChange =
    (field: keyof SurveyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.company.trim()) {
      toast.error('Please enter your name and company.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('/api/partner-survey', form);
      toast.success('Thanks! Your feedback has been sent to our team.');
      setForm(EMPTY_FORM);
      onClose();
    } catch (err) {
      console.error('Survey submission failed:', err);
      toast.error('Sorry, something went wrong. Please try again or email info@driverfly.co.');
    } finally {
      setSubmitting(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
    fontSize: '0.95rem',
    display: 'block',
  };

  const inputStyle: React.CSSProperties = {
    borderRadius: 10,
    backgroundColor: '#f7f9fb',
    border: '1px solid #e5e7eb',
    width: '100%',
    padding: '10px 12px',
    fontSize: '0.95rem',
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static" keyboard={!submitting}>
      <Modal.Header className="border-0" style={{ background: BRAND, padding: '18px 24px' }}>
        <div className="d-flex justify-content-between align-items-center w-100">
          <h4 className="mb-0" style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>
            Share Your Feedback
          </h4>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            style={{
              border: 'none',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              borderRadius: 6,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={22} />
          </button>
        </div>
      </Modal.Header>

      <Modal.Body style={{ padding: '24px', background: '#fff' }}>
        <p style={{ color: '#6b7280', marginTop: 0, marginBottom: 20 }}>
          This takes about 2 minutes. Your responses go straight to our team so we can keep
          improving DriverFly for you.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label style={labelStyle}>
                Your name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                style={inputStyle}
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Jane Doe"
                required
              />
            </div>
            <div className="col-md-6">
              <label style={labelStyle}>
                Company <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                style={inputStyle}
                value={form.company}
                onChange={handleChange('company')}
                placeholder="Fast Trucking Inc."
                required
              />
            </div>
            <div className="col-12">
              <label style={labelStyle}>Email (optional, so we can follow up)</label>
              <input
                type="email"
                style={inputStyle}
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@company.com"
              />
            </div>
            <div className="col-12">
              <label style={labelStyle}>What feature(s) do you like the most?</label>
              <textarea
                style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
                value={form.mostLiked}
                onChange={handleChange('mostLiked')}
              />
            </div>
            <div className="col-12">
              <label style={labelStyle}>What feature(s) do you like the least?</label>
              <textarea
                style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
                value={form.leastLiked}
                onChange={handleChange('leastLiked')}
              />
            </div>
            <div className="col-12">
              <label style={labelStyle}>Anything missing you&apos;d like to see?</label>
              <textarea
                style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
                value={form.missing}
                onChange={handleChange('missing')}
              />
            </div>
            <div className="col-12">
              <label style={labelStyle}>Any bugs or issues to report?</label>
              <textarea
                style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
                value={form.bugs}
                onChange={handleChange('bugs')}
              />
            </div>
            <div className="col-12">
              <label style={labelStyle}>Anything else you&apos;d like to share?</label>
              <textarea
                style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
                value={form.otherComments}
                onChange={handleChange('otherComments')}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn"
              onClick={handleClose}
              disabled={submitting}
              style={{ borderRadius: 10, border: '1px solid #e5e7eb', padding: '10px 20px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn"
              disabled={submitting}
              style={{
                borderRadius: 10,
                background: BRAND,
                color: '#fff',
                padding: '10px 24px',
                fontWeight: 600,
                minWidth: 140,
              }}
            >
              {submitting ? 'Sending…' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default PartnerSurveyModal;
