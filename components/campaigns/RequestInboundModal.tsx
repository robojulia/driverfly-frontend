import { useFormik } from 'formik';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useTranslation } from '../../hooks/use-translation';
import { InboundRequestDTO } from '../../models/campaigns/inbound-request.dto';

import BaseInput from '../forms/base-input';
import BaseSelect from '../forms/base-select';
import BaseTextArea from '../forms/base-text-area';
import BaseDateInput from '../forms/base-date-input';

interface RequestInboundModalProps {
  show: boolean;
  onHide: () => void;
  onRequestSubmitted?: () => void;
}

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const period = i < 12 ? 'AM' : 'PM';
  const value = `${String(i).padStart(2, '0')}:00`;
  return { value, label: `${hour}:00 ${period}` };
});

export default function RequestInboundModal({
  show,
  onHide,
  onRequestSubmitted,
}: RequestInboundModalProps) {
  const { t } = useTranslation();

  const form = useFormik({
    initialValues: {
      businessHoursStart: '08:00',
      businessHoursEnd: '17:00',
      callRoutingGoal: '',
      greeting: '',
      callbackEnabled: false,
      goals: '',
      desiredStartDate: '',
      personaGender: 'female',
      personaAccent: 'neutral',
      personaTone: 'professional',
      personaName: '',
    },
    validationSchema: InboundRequestDTO.yupSchema(),
    onSubmit: async (values) => {
      try {
        await axios.post('/api/send-intake-email', {
          type: 'inbound',
          fields: {
            'Business Hours': `${values.businessHoursStart} – ${values.businessHoursEnd}`,
            'Call Routing Goal': values.callRoutingGoal,
            'Greeting / Script': values.greeting,
            'Callback Enabled': values.callbackEnabled ? 'Yes' : 'No',
            'Desired Start Date': values.desiredStartDate,
            'Goals / Objectives': values.goals,
            'Persona Name': values.personaName,
            'Persona Gender': values.personaGender,
            'Persona Accent': values.personaAccent,
            'Persona Tone': values.personaTone,
          },
        });

        toast.success('Inbound request submitted successfully!');
        form.resetForm();
        onHide();
        onRequestSubmitted?.();
      } catch (e) {
        console.error('Unable to submit inbound request', e);
        toast.error('Failed to submit inbound request. Please try again.');
      }
    },
  });

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
          <Modal.Title>Request Inbound AI Setup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <BaseSelect
                className="mb-4"
                label="Business Hours Start"
                name="businessHoursStart"
                options={HOUR_OPTIONS}
                formik={form}
                required
              />
            </div>
            <div className="col-md-6">
              <BaseSelect
                className="mb-4"
                label="Business Hours End"
                name="businessHoursEnd"
                options={HOUR_OPTIONS}
                formik={form}
                required
              />
            </div>
          </div>

          <BaseTextArea
            className="mb-4"
            label="Call Routing Goal"
            name="callRoutingGoal"
            rows={3}
            maxLength={500}
            formik={form}
            required
            placeholder="Describe how inbound calls should be handled and routed (e.g., screen applicants, schedule interviews, answer job questions)"
          />

          <BaseTextArea
            className="mb-4"
            label="Greeting / Script Preference"
            name="greeting"
            rows={3}
            maxLength={500}
            formik={form}
            required
            placeholder="Describe the preferred greeting and tone for inbound callers"
          />

          <div className="row">
            <div className="col-md-6">
              <BaseDateInput
                className="mb-4"
                label="Desired Start Date"
                name="desiredStartDate"
                formik={form}
                required
              />
            </div>
            <div className="col-md-6">
              <div className="mb-4">
                <label className="form-label">Enable Callback</label>
                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="callbackEnabled"
                    name="callbackEnabled"
                    checked={form.values.callbackEnabled}
                    onChange={form.handleChange}
                  />
                  <label className="form-check-label" htmlFor="callbackEnabled">
                    Allow AI to schedule a callback for missed calls
                  </label>
                </div>
              </div>
            </div>
          </div>

          <BaseTextArea
            className="mb-4"
            label="Goals / Objectives"
            name="goals"
            rows={3}
            maxLength={1000}
            formik={form}
            required
            placeholder="Describe what you want to achieve with inbound AI (e.g., pre-qualify drivers, reduce receptionist load, 24/7 availability)"
          />

          <div className="mt-4 mb-3">
            <h6>{t('PERSONA_PREFERENCES')}</h6>
          </div>

          <div className="row">
            <div className="col-md-6">
              <BaseSelect
                className="mb-4"
                label={t('PERSONA_GENDER')}
                name="personaGender"
                options={[
                  { value: 'female', label: t('FEMALE') },
                  { value: 'male', label: t('MALE') },
                ]}
                formik={form}
                placeholder={t('PERSONA_GENDER_PLACEHOLDER')}
              />
            </div>
            <div className="col-md-6">
              <BaseSelect
                className="mb-4"
                label={t('PERSONA_ACCENT')}
                name="personaAccent"
                options={[
                  { value: 'neutral', label: t('NEUTRAL') },
                  { value: 'southern', label: t('SOUTHERN') },
                  { value: 'new_york', label: t('NEW_YORK') },
                  { value: 'boston', label: t('BOSTON') },
                  { value: 'wisconsin', label: t('WISCONSIN') },
                  { value: 'hispanic', label: t('HISPANIC') },
                  { value: 'african_american', label: t('AFRICAN_AMERICAN') },
                  { value: 'middle_eastern', label: t('MIDDLE_EASTERN') },
                  { value: 'russian', label: t('RUSSIAN') },
                  { value: 'indian', label: t('INDIAN') },
                ]}
                formik={form}
                placeholder={t('PERSONA_ACCENT_PLACEHOLDER')}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <BaseSelect
                className="mb-4"
                label={t('PERSONA_TONE')}
                name="personaTone"
                options={[
                  { value: 'professional', label: t('PROFESSIONAL') },
                  { value: 'friendly', label: t('FRIENDLY') },
                  { value: 'casual', label: t('CASUAL') },
                  { value: 'formal', label: t('FORMAL') },
                ]}
                formik={form}
                placeholder={t('PERSONA_TONE_PLACEHOLDER')}
              />
            </div>
            <div className="col-md-6">
              <BaseInput
                className="mb-4"
                label={t('PERSONA_NAME')}
                name="personaName"
                formik={form}
                placeholder={t('PERSONA_NAME_PLACEHOLDER')}
              />
            </div>
          </div>

          <div className="alert alert-info border-0 mt-3">
            <small>{t('COMPANY_INFO_AUTO_FILLED')}</small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={form.isSubmitting}>
            {t('CANCEL')}
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={form.isSubmitting || !form.isValid}
          >
            {form.isSubmitting ? t('SUBMITTING') : 'Request Inbound Setup'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
