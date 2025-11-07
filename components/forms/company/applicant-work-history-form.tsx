import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { ChevronUp, PlusCircle, XCircle, FileEarmarkText } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

import { ApplicantType } from '../../../enums/applicants/applicant-type.enum';
import { ApplicantExtras as ApplicantExtrasEnum } from '../../../enums/applicants/applicant-extras.enum';
import { useTranslation } from '../../../hooks/use-translation';
import { ApplicantEmployerEntity } from '../../../models/applicant/applicant-employer.entity';
import { ApplicantEntity } from '../../../models/applicant/applicant.entity';
import { CurrentEmploymentHistoryDto } from '../../../models/jot-form/long-form/current-emplyment-history/index.dto';
import ApplicantApi from '../../../pages/api/applicant';
import { globalAjaxExceptionHandler } from '../../../utils/ajax';
import { focusOnErrorField } from '../../../utils/form-error';
import { useEffectAsync } from '../../../utils/react';
import { formFailed, formSuccess } from '../../../utils/toast';
import OverlyPopover from '../../popover/overly-popover';
import Section from '../../view-details/section';
import BaseCheck from '../base-check';
import BaseInput from '../base-input';
import BaseInputPhone from '../base-input-phone';
import StateSelect from '../state-select';
import { BaseFormProps } from './base-form-props';
import { LoaderIcon } from '../../loading/loader-icon';
import BaseTextArea from '../base-text-area';

export interface ApplicantWorkHistoryFormProps extends BaseFormProps<ApplicantEntity> {
  isSubmitting: boolean;
  setIsSubmitting(value: boolean): void;
  hideActions?: boolean;
}
interface WorkHistoryMetaData {
  curentCompanyCheck: CurrentEmploymentHistoryDto;
  sendVoeEmailsHistory: string[];
  isSubmittingVoe: boolean;
}

const workHistoryMetaDataInitialState: WorkHistoryMetaData = {
  curentCompanyCheck: null,
  sendVoeEmailsHistory: [],
  isSubmittingVoe: false,
};

export function ApplicantWorkHistoryForm(props: ApplicantWorkHistoryFormProps) {
  let { className, entity, setEntity, isSubmitting, setIsSubmitting, onSaveComplete } = props;
  const { t } = useTranslation();

  const applicantApi = new ApplicantApi();

  const [workHistoryMetaData, setWorkHistoryMetaData] = useState(workHistoryMetaDataInitialState);
  const [lastSavedEntityId, setLastSavedEntityId] = useState<number | null>(null);

  const form = useFormik({
    initialValues: new ApplicantEntity(),
    validationSchema: ApplicantEntity.yupSchemaForApplicantWorkHistory(),
    onSubmit: async (values) => {
      setWorkHistoryMetaData((prev) => ({ ...prev, isSubmittingVoe: true }));
      setIsSubmitting(true);
      try {
        // Persist job duties via Applicant.extras
        const jobDutiesArray = (values?.employers || []).map((e: any) => e?.job_duties ?? null);
        const others = (values?.extras || entity?.extras || []).filter((e: any) => e.type !== ApplicantExtrasEnum.JOB_DUTIES);
        const updatedExtras = [
          ...others,
          { type: ApplicantExtrasEnum.JOB_DUTIES, value: jobDutiesArray } as any,
        ];

        // Strip presentation-only field from employers before save
        const sanitizedEmployers = (values?.employers || []).map((e: any) => {
          const { job_duties, ...rest } = e || {};
          return rest;
        });

        // Strip preference fields (handled by preferences form)
        const { routes, preferred_location, current_application_status, ...baseValues } = values as any;
        const payload: any = { ...baseValues, employers: sanitizedEmployers, extras: updatedExtras };

        if (entity?.id) {
          values = await applicantApi.update(entity.id, payload);
        } else {
          values = await applicantApi.create(payload);
        }
        
        // Check if child toasts are suppressed by global save
        if (!(window as any).__SUPPRESS_CHILD_TOASTS__) {
          formSuccess(t, entity?.id ? 'update' : 'create', 'APPLICANT');
        }
        
        // MERGE saved response with existing entity to preserve fields backend didn't return
        setEntity({ ...entity, ...values });
        
        // Mark that we just saved this entity
        setLastSavedEntityId(values?.id);
        
        setIsSubmitting(false);
        setWorkHistoryMetaData((prev) => ({ ...prev, isSubmittingVoe: false }));
        if (onSaveComplete) onSaveComplete(form?.values);
      } catch (e) {
        setIsSubmitting(false);
        setWorkHistoryMetaData((prev) => ({ ...prev, isSubmittingVoe: false }));
        if (!globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast }))
          formFailed(t, entity?.id ? 'update' : 'create', 'APPLICANT');
      }
    },
  });

  // Load form values on mount, or when we just saved and entity was refetched
  useEffectAsync(async () => {
    const shouldLoad = !form.values?.id || (entity?.id && entity?.id === lastSavedEntityId);
    
    if (!!entity?.id && shouldLoad) {
      const dutiesExtra = (entity?.extras || []).find((e: any) => e.type === ApplicantExtrasEnum.JOB_DUTIES);
      const dutiesArray: Array<string | null> = Array.isArray(dutiesExtra?.value) ? dutiesExtra.value : [];
      const employersWithDuties = (entity?.employers || []).map((e, idx) => ({ ...e, job_duties: dutiesArray[idx] || '' }));
      
      form.setValues({
        ...entity,
        employers: employersWithDuties,
      });
      
      // Clear the flag after loading
      if (lastSavedEntityId) {
        setLastSavedEntityId(null);
      }
    } else if (!entity?.id) {
      await form.setValues({
        ...new ApplicantEntity(),
        type: ApplicantType.COMPANY,
      });
    }
  }, [entity, lastSavedEntityId]);

  const currentCompanyCheckBox = (employerId) => {
    return workHistoryMetaData?.curentCompanyCheck?.is_current
      ? Boolean(employerId?.id !== workHistoryMetaData?.curentCompanyCheck?.id)
      : false;
  };

  const handleSendBackgroundRequest = async (i: number) => {
    setWorkHistoryMetaData((prev) => ({ ...prev, isSubmittingVoe: true }));

    try {
      const res = await applicantApi.sendVoeRequest({
        applicant: entity,
        employer: form.values.employers[i],
      });
      setEntity(res);
      setWorkHistoryMetaData((prev) => ({
        ...prev,
        sendVoeEmailsHistory: [...prev.sendVoeEmailsHistory, form?.values?.employers[i]?.email],
        isSubmittingVoe: false,
      }));
      toast.success(t('SUCCESSFULLY_SENT_VOE'));
      setWorkHistoryMetaData((prev) => ({ ...prev, isSubmittingVoe: false }));
    } catch (e) {
      setWorkHistoryMetaData((prev) => ({ ...prev, isSubmittingVoe: false }));
      globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast });
    }
  };

  const handleVoeSummaryClick = () => {
    if (entity?.uuid_token) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API || process.env.BASE_URL_API;
      const voeUrl = `${baseUrl}/applicants/voe/summary/pdf?uuid_token=${entity.uuid_token}`;
      window.open(voeUrl, '_blank');
    }
  };

  useEffect(() => {
    const currentCompanyExists = form.values?.employers?.find((e) => e.is_current);
    setWorkHistoryMetaData((prev) => ({ ...prev, curentCompanyCheck: currentCompanyExists }));
    form?.values?.employers?.forEach((employer) => {
      if (employer?.is_current) {
        employer.end_at = null;
      }
    });
  }, [form.values]);

  useEffect(() => focusOnErrorField(form), [form.submitCount]);

  const showVoeSummary = Array.isArray(form.values?.employers)
    && form.values.employers.some((e) => Boolean(e?.can_contact));

  return (
    <Form onSubmit={form.handleSubmit} className={className} data-applicant-edit-form>
      {form?.isSubmitting ? (
        <LoaderIcon isLoading={form?.isSubmitting} />
      ) : (
        <Row>
          <Col md="12" className="p-0 px-lg-2">
            <div className="df-modern-section">
            <Section
              title="Previous Employment"
              actions={
                !props?.hideActions && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {showVoeSummary && (
                      <Button
                        size="sm"
                        onClick={handleVoeSummaryClick}
                        disabled={!entity?.uuid_token}
                        title={t('GENERATE_VOE_SUMMARY_PDF')}
                      >
                        <FileEarmarkText className="me-1" />
                        VOE Summary
                      </Button>
                    )}
                     <Button
                       disabled={Boolean(entity?.is_hired)}
                       size="sm"
                       onClick={() => {
                         const newEmployer = new ApplicantEmployerEntity();
                         // Initialize with empty job_duties field for proper tracking
                         (newEmployer as any).job_duties = '';
                         form.setValues({
                           ...form.values,
                           employers: [newEmployer, ...(form.values?.employers || [])],
                         });
                       }}
                     >
                       <PlusCircle /> {t('ADD')}
                     </Button>
                  </div>
                )
              }
            >
              {form.values?.employers?.length > 0 && (
                <>
                  {form.values?.employers?.map((employer, i) => (
                    <Row key={i}>
                      <div className="col-md-6 mt-2">
                        <Col className="p-0">
                          <strong>Employer Name</strong>
                          <span className="p-0 text-danger">*</span>
                        </Col>
                        <BaseInput
                          readOnly={Boolean(entity?.is_hired)}
                          name={`employers[${i}].name`}
                          placeholder="ABC Transport Co."
                          required
                          formik={form}
                        />
                      </div>
                      <div className="col-md-5 mt-2">
                        <Col className="p-0">
                          <strong>Position</strong>
                        </Col>
                        <BaseInput
                          readOnly={Boolean(entity?.is_hired)}
                          name={`employers[${i}].title`}
                          placeholder="Truck Driver"
                          formik={form}
                        />
                      </div>
                      <div className="pl-sm-1 pt-lg-2 col-lg-1 col-md-12">
                        <Col className="mt-4"></Col>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            form.setValues({
                              ...form.values,
                              employers: form.values?.employers?.filter((v, idx) => i !== idx),
                            });
                          }}
                        >
                          <XCircle color="red" size={20} />
                        </a>
                      </div>
                      <div className="col-md-6 mt-2">
                        <Col className="p-0">
                          <strong>Start Date</strong>
                        </Col>
                        <BaseInput
                          readOnly={Boolean(entity?.is_hired)}
                          name={`employers[${i}].start_at`}
                          type="date"
                          max={new Date().toISOString().split('T')[0]}
                          formik={form}
                        />
                      </div>
                      <div className="col-md-6 mt-2">
                        <Col className="p-0">
                          <strong>End Date</strong>
                        </Col>
                        <BaseInput
                          readOnly={Boolean(entity?.is_hired)}
                          name={`employers[${i}].end_at`}
                          type="date"
                          formik={form}
                        />
                      </div>
                      <div className="col-12 mt-2">
                        <Col className="p-0">
                          <strong>Job Duties</strong>
                        </Col>
                        <BaseTextArea
                          name={`employers[${i}].job_duties`}
                          placeholder="Describe responsibilities..."
                          rows={3}
                          formik={form}
                          readOnly={Boolean(entity?.is_hired)}
                        />
                      </div>
                      <div className="col-12">
                        <hr />
                      </div>
                    </Row>
                  ))}
                </>
              )}
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                  disabled={Boolean(entity?.is_hired)}
                  size="sm"
                  variant="link"
                  className="p-0"
                  onClick={() => {
                    const newEmployer = new ApplicantEmployerEntity();
                    // Initialize with empty job_duties field for proper tracking
                    (newEmployer as any).job_duties = '';
                    form.setValues({
                      ...form.values,
                      employers: [...(form.values?.employers || []), newEmployer],
                    });
                  }}
                >
                  <PlusCircle /> Add Another Position
                </Button>
              </div>
            </Section>
            </div>
          </Col>
        </Row>
      )}
    </Form>
  );
}

function hasErrorsAtIndex(form, index: number): boolean {
  if (form.errors && Array.isArray(form.errors.employers) && form.errors.employers[index]) {
    const errorObject = form.errors.employers[index];
    return Object.keys(errorObject).length > 0;
  }
  return false;
}

const renderSendBackgroundRequestButton = (
  form: ReturnType<typeof useFormik>,
  i: number,
  workHistoryMetaData: WorkHistoryMetaData,
  entity: ApplicantEntity,
  isSubmitting: boolean,
  handleSendBackgroundRequest: (i: number) => Promise<void>,
  t: (key: string) => string
) => {
  const employer = form.values?.employers[i];
  const email = employer?.email;

  const emailInvalid = typeof email !== 'string' || email === '';
  const canContact = employer?.can_contact;
  const isSubjectToFmcsrs = employer?.is_subject_to_fmcsrs;

  const entityEmployer = entity?.employers?.find((e) => e.id === employer?.id);
  const emailAlreadySent = employer?.id
    ? workHistoryMetaData?.sendVoeEmailsHistory?.includes(email) || email === entityEmployer?.email
    : false;

  // Helper function to get the appropriate message and status
  const getButtonState = () => {
    if (emailInvalid) {
      return {
        disabled: true,
        message: t('EMAIL_REQUIRED_FOR_BACKGROUND_CHECK'),
        variant: 'warning',
      };
    }
    if (!canContact) {
      return {
        disabled: true,
        message: t('CONTACT_PERMISSION_REQUIRED'),
        variant: 'warning',
      };
    }
    if (!isSubjectToFmcsrs) {
      return {
        disabled: true,
        message: t('FMCSR_CONFIRMATION_REQUIRED'),
        variant: 'warning',
      };
    }
    if (hasErrorsAtIndex(form, i)) {
      return {
        disabled: true,
        message: t('COMPLETE_EMPLOYER_INFO_FIRST'),
        variant: 'warning',
      };
    }
    if (emailAlreadySent) {
      return {
        disabled: true,
        message: t('BACKGROUND_CHECK_ALREADY_REQUESTED'),
        variant: 'info',
      };
    }
    if (workHistoryMetaData?.isSubmittingVoe) {
      return {
        disabled: true,
        message: t('BACKGROUND_CHECK_IN_PROGRESS'),
        variant: 'info',
      };
    }
    if (form.isSubmitting || isSubmitting) {
      return {
        disabled: true,
        message: t('PLEASE_WAIT'),
        variant: 'info',
      };
    }

    return {
      disabled: false,
      message: t('CLICK_TO_REQUEST_BACKGROUND_CHECK'),
      variant: 'primary',
    };
  };

  const buttonState = getButtonState();

  return (
    <div className="background-request-container">
      <OverlyPopover str={buttonState.message}>
        <Button
          className={`theme-secondary-btn ${buttonState.variant}`}
          disabled={buttonState.disabled}
          onClick={buttonState.disabled ? undefined : () => handleSendBackgroundRequest(i)}
        >
          {workHistoryMetaData?.isSubmittingVoe ? (
            <>
              <LoaderIcon isLoading={true} /> {t('SENDING_REQUEST')}
            </>
          ) : (
            t('SEND_BACKGROUND_REQUEST')
          )}
        </Button>
      </OverlyPopover>
      {buttonState.disabled && (
        <div className={`help-text ${buttonState.variant}`}>{buttonState.message}</div>
      )}
    </div>
  );
};
