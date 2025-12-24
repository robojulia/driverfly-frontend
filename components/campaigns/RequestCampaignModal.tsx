import { useFormik } from 'formik';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from '../../hooks/use-translation';
import CampaignRequestApi from '../../pages/api/campaign-request';
import { CampaignRequestDTO } from '../../models/campaigns/campaign-request.dto';
import { CampaignCommunicationType } from '../../enums/campaigns/campaign-communication-type.enum';
import { globalAjaxExceptionHandler } from '../../utils/ajax';

import BaseInput from '../forms/base-input';
import BaseSelect from '../forms/base-select';
import BaseTextArea from '../forms/base-text-area';
import BaseDateInput from '../forms/base-date-input';
import BaseMoneyInput from '../forms/base-money-input';

interface RequestCampaignModalProps {
  show: boolean;
  onHide: () => void;
  onRequestSubmitted?: () => void;
}

export default function RequestCampaignModal({
  show,
  onHide,
  onRequestSubmitted,
}: RequestCampaignModalProps) {
  const { t } = useTranslation();

  const form = useFormik({
    initialValues: {
      communicationType: '',
      campaignType: '',
      targetAudience: '',
      budgetRangeMax: '',
      desiredStartDate: '',
      goals: '',
      personaGender: 'female',
      personaAccent: 'neutral',
      personaTone: 'professional',
      personaName: '',
    },
    validationSchema: CampaignRequestDTO.yupSchema(),
    onSubmit: async (values) => {
      try {
        const api = new CampaignRequestApi();

        const dto: CampaignRequestDTO = {
          communicationType: values.communicationType,
          campaignType: values.campaignType,
          targetAudience: values.targetAudience,
          budgetRangeMax: parseFloat(values.budgetRangeMax),
          desiredStartDate: new Date(values.desiredStartDate),
          goals: values.goals,
          personaGender: values.personaGender,
          personaAccent: values.personaAccent,
          personaTone: values.personaTone,
          personaName: values.personaName,
        };

        await api.submitRequest(dto);

        toast.success(t('CAMPAIGN_REQUEST_SUBMITTED_SUCCESSFULLY'));
        form.resetForm();
        onHide();
        onRequestSubmitted?.();
      } catch (e) {
        console.error('Unable to submit campaign request', e);
        globalAjaxExceptionHandler(e, {
          formik: form,
          toast: toast,
          t: t,
          defaultMessage: t('Failed to submit campaign request. Please try again.'),
        });
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
          <Modal.Title>{t('REQUEST_A_NEW_CAMPAIGN')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BaseSelect
            className="mb-4"
            label={t('COMMUNICATION_TYPE')}
            name="communicationType"
            enumType={CampaignCommunicationType}
            formik={form}
            required
            placeholder={t('COMMUNICATION_TYPE_PLACEHOLDER')}
          />

          <BaseTextArea
            className="mb-4"
            label={t('CAMPAIGN_TYPE')}
            name="campaignType"
            rows={3}
            maxLength={500}
            formik={form}
            required
            placeholder={t('CAMPAIGN_TYPE_PLACEHOLDER')}
          />

          <BaseTextArea
            className="mb-4"
            label={t('TARGET_AUDIENCE_DESCRIPTION')}
            name="targetAudience"
            rows={3}
            maxLength={500}
            formik={form}
            required
            placeholder={t('TARGET_AUDIENCE_PLACEHOLDER')}
          />

          <div className="row">
            <div className="col-md-6">
              <BaseMoneyInput
                className="mb-4"
                label={t('MAXIMUM_BUDGET')}
                name="budgetRangeMax"
                formik={form}
                required
                placeholder="0.00"
              />
            </div>
            <div className="col-md-6">
              <BaseDateInput
                className="mb-4"
                label={t('DESIRED_START_DATE')}
                name="desiredStartDate"
                formik={form}
                required
              />
            </div>
          </div>

          <BaseTextArea
            className="mb-4"
            label={t('SPECIFIC_CAMPAIGN_GOALS')}
            name="goals"
            rows={3}
            maxLength={1000}
            formik={form}
            required
            placeholder={t('CAMPAIGN_GOALS_PLACEHOLDER')}
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
                  { value: 'male', label: t('MALE') }
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
                  { value: 'indian', label: t('INDIAN') }
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
                  { value: 'formal', label: t('FORMAL') }
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
            {form.isSubmitting ? t('SUBMITTING') : t('REQUEST_CAMPAIGN')}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
