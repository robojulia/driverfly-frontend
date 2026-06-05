import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState, useRef, useMemo } from 'react';
import { Button, Col, Form, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ChevronUp, PlusCircle, XCircle, FileEarmarkText, EnvelopeCheck } from 'react-bootstrap-icons';
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
  companyAutoVoeEnabled?: boolean;
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
  console.log('ApplicantWorkHistoryForm received props:', { companyAutoVoeEnabled: props.companyAutoVoeEnabled, hideActions: props.hideActions });
  let { className, entity, setEntity, isSubmitting, setIsSubmitting, onSaveComplete, companyAutoVoeEnabled = true } = props;
  console.log('After destructuring, companyAutoVoeEnabled =', companyAutoVoeEnabled);
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

        // Send ONLY work history fields to avoid overwriting other forms' changes
        const payload: any = { 
          employers: sanitizedEmployers, 
          extras: updatedExtras 
        };

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

      form.resetForm({
        values: {
          ...entity,
          employers: employersWithDuties,
        }
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

  // Keep a ref to always have the latest form instance
  const formRef = useRef(form);
  formRef.current = form;

  // Register getter function that returns CURRENT work history fields when called
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Register validation function
      (window as any).__applicantFormValidation = (window as any).__applicantFormValidation || {};
      (window as any).__applicantFormValidation['work-history'] = () => {
        // Return current validation errors from formik
        return formRef.current.errors;
      };

      // Register dirty state function
      (window as any).__applicantFormDirty = (window as any).__applicantFormDirty || {};
      (window as any).__applicantFormDirty['work-history'] = () => {
        return formRef.current.dirty;
      };

      // Register reset dirty function
      (window as any).__applicantFormResetDirty = (window as any).__applicantFormResetDirty || {};
      (window as any).__applicantFormResetDirty['work-history'] = () => {
        formRef.current.resetForm({ values: formRef.current.values });
      };

      (window as any).__applicantFormRegistry = (window as any).__applicantFormRegistry || {};
      (window as any).__applicantFormRegistry['work-history'] = () => {
        // Prepare job duties in extras
        const jobDutiesArray = (formRef.current.values?.employers || []).map((e: any) => e?.job_duties ?? null);
        const updatedExtras = [
          ...(formRef.current.values?.extras || []).filter((e: any) => e.type !== ApplicantExtrasEnum.JOB_DUTIES),
          { type: ApplicantExtrasEnum.JOB_DUTIES, value: jobDutiesArray } as any,
        ];
        // Strip presentation-only field from employers
        const sanitizedEmployers = (formRef.current.values?.employers || []).map((e: any) => {
          const { job_duties, ...rest } = e || {};
          return rest;
        });
        console.log('WorkHistoryForm getter called, employers count:', sanitizedEmployers.length);
        return {
          employers: sanitizedEmployers,
          extras: updatedExtras,
        };
      };
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__applicantFormValidation?.['work-history'];
        delete (window as any).__applicantFormDirty?.['work-history'];
        delete (window as any).__applicantFormResetDirty?.['work-history'];
        delete (window as any).__applicantFormRegistry?.['work-history'];
      }
    };
  }, []);

  const currentCompanyCheckBox = (employerId) => {
    return workHistoryMetaData?.curentCompanyCheck?.is_current
      ? Boolean(employerId?.id !== workHistoryMetaData?.curentCompanyCheck?.id)
      : false;
  };

  const handleSendBackgroundRequest = async (i: number) => {
    console.log('=== SENDING VOE REQUEST ===');
    console.log('Employer index:', i);
    console.log('Employer data:', form.values.employers[i]);
    console.log('Applicant ID:', entity?.id);

    setWorkHistoryMetaData((prev) => ({ ...prev, isSubmittingVoe: true }));

    try {
      const res = await applicantApi.sendVoeRequest({
        applicant: entity,
        employer: form.values.employers[i],
      });
      console.log('=== VOE REQUEST SUCCESS ===');
      console.log('Response:', res);
      setEntity(res);
      setWorkHistoryMetaData((prev) => ({
        ...prev,
        sendVoeEmailsHistory: [...prev.sendVoeEmailsHistory, form?.values?.employers[i]?.email],
        isSubmittingVoe: false,
      }));
      toast.success(t('SUCCESSFULLY_SENT_VOE'));
      setWorkHistoryMetaData((prev) => ({ ...prev, isSubmittingVoe: false }));
    } catch (e) {
      console.error('=== VOE REQUEST FAILED ===');
      console.error('Error:', e);
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

  // Sort employers from most recent to oldest (for display only)
  const sortedEmployersWithIndex = useMemo(() => {
    if (!form.values?.employers) return [];

    return form.values.employers
      .map((employer, originalIndex) => ({ employer, originalIndex }))
      .sort((a, b) => {
        // Current jobs always come first
        if (a.employer.is_current && !b.employer.is_current) return -1;
        if (!a.employer.is_current && b.employer.is_current) return 1;

        // For non-current jobs, sort by end date (most recent first)
        const aDate = a.employer.end_at || a.employer.start_at;
        const bDate = b.employer.end_at || b.employer.start_at;

        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;

        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
  }, [form.values?.employers]);

  const handleAutoSendVoe = async (i: number) => {
    if (!entity?.id) return;

    setWorkHistoryMetaData((prev) => ({ ...prev, isSubmittingVoe: true }));
    try {
      await handleSendBackgroundRequest(i);
    } finally {
      setWorkHistoryMetaData((prev) => ({ ...prev, isSubmittingVoe: false }));
    }
  };

  const canSendVoe = (employer: any, originalIndex: number) => {
    // Check all required fields are populated
    const hasCompanyName = employer?.name && typeof employer.name === 'string' && employer.name.trim() !== '';
    const hasRoleName = employer?.title && typeof employer.title === 'string' && employer.title.trim() !== '';
    const hasManagerName = employer?.manager_name && typeof employer.manager_name === 'string' && employer.manager_name.trim() !== '';
    const hasEmail = employer?.email && typeof employer.email === 'string' && employer.email.trim() !== '';
    const canContact = employer?.can_contact === true || employer?.can_contact === 'Yes';
    const isSubjectToFmcsrs = employer?.is_subject_to_fmcsrs === true || employer?.is_subject_to_fmcsrs === 'Yes';
    const alreadySent = employer?.voe_attempts > 0 || employer?.auto_voe_attempts > 0;

    // Debug logging
    console.log('VOE Debug for employer:', employer?.name, {
      hasCompanyName,
      hasRoleName,
      hasManagerName,
      hasEmail,
      canContact,
      isSubjectToFmcsrs,
      alreadySent,
      companyAutoVoeEnabled,
      isViewMode: Boolean(entity?.is_hired),
      employer
    });

    // Check if company has automated VOE disabled
    // If automated VOE is enabled, don't show manual send button (it will be sent automatically)
    if (companyAutoVoeEnabled) {
      console.log('VOE blocked: companyAutoVoeEnabled is true');
      return false;
    }

    // In view mode (is_hired), allow sending if all fields are populated
    // In edit mode, only allow if email was just changed
    const isViewMode = Boolean(entity?.is_hired);

    if (isViewMode) {
      // View mode: Enable if all conditions met
      const result = hasCompanyName && hasRoleName && hasManagerName && hasEmail && canContact && isSubjectToFmcsrs && !alreadySent;
      console.log('VOE View Mode Result:', result);
      return result;
    } else {
      // Edit mode: Require email to be recently changed plus all other conditions
      const originalEmployer = entity?.employers?.[originalIndex];
      const emailChanged = originalEmployer?.email !== employer?.email;
      const result = hasCompanyName && hasRoleName && hasManagerName && hasEmail && emailChanged && canContact && isSubjectToFmcsrs && !alreadySent;
      console.log('VOE Edit Mode Result:', result, 'emailChanged:', emailChanged);
      return result;
    }
  };

  const getVoeButtonTooltip = (employer: any, originalIndex: number) => {
    const hasCompanyName = employer?.name && typeof employer.name === 'string' && employer.name.trim() !== '';
    const hasRoleName = employer?.title && typeof employer.title === 'string' && employer.title.trim() !== '';
    const hasManagerName = employer?.manager_name && typeof employer.manager_name === 'string' && employer.manager_name.trim() !== '';
    const hasEmail = employer?.email && typeof employer.email === 'string' && employer.email.trim() !== '';
    const canContact = employer?.can_contact === true || employer?.can_contact === 'Yes';
    const isSubjectToFmcsrs = employer?.is_subject_to_fmcsrs === true || employer?.is_subject_to_fmcsrs === 'Yes';
    const alreadySent = employer?.voe_attempts > 0 || employer?.auto_voe_attempts > 0;

    if (companyAutoVoeEnabled) {
      return t('AUTOMATED_VOE_ENABLED_NO_MANUAL_SEND');
    }
    if (alreadySent) {
      return t('VOE_ALREADY_SENT');
    }

    const isViewMode = Boolean(entity?.is_hired);

    if (!isViewMode) {
      // Edit mode: Check if email was changed
      const originalEmployer = entity?.employers?.[originalIndex];
      const emailChanged = originalEmployer?.email !== employer?.email;

      if (!emailChanged && hasEmail) {
        return t('VOE_EMAIL_NOT_CHANGED');
      }
    }

    // Check all required fields and provide specific feedback
    if (!hasCompanyName) {
      return 'Company name is required to send VOE';
    }
    if (!hasRoleName) {
      return 'Role/title is required to send VOE';
    }
    if (!hasManagerName) {
      return 'Manager name is required to send VOE';
    }
    if (!hasEmail) {
      return t('EMAIL_REQUIRED_FOR_VOE');
    }
    if (!canContact) {
      return t('CONTACT_PERMISSION_REQUIRED_FOR_VOE');
    }
    if (!isSubjectToFmcsrs) {
      return t('FMCSR_CONFIRMATION_REQUIRED_FOR_VOE');
    }
    return t('SEND_VOE_REQUEST_TO_EMPLOYER');
  };

  return (
    <Form onSubmit={form.handleSubmit} className={className} data-applicant-edit-form data-form-id="work-history">
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
                       <PlusCircle className="me-2" /> {t('ADD')}
                     </Button>
                  </div>
                )
              }
            >
              {sortedEmployersWithIndex.length > 0 && (
                <>
                  {sortedEmployersWithIndex.map(({ employer, originalIndex: i }) => (
                    <div key={i} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '2px solid #e0e0e0' }}><Row>
                      <div className="col-md-12 mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <h5 className="mb-0">
                            {employer.name || 'Employer'}
                          </h5>
                          {employer.is_current && (
                            <span className="badge bg-success">Current</span>
                          )}
                        </div>
                      </div>
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
                      <div className="col-md-12 mt-2">
                        <Col className="p-0">
                          <strong>Street Address</strong>
                        </Col>
                        <BaseInput
                          readOnly={Boolean(entity?.is_hired)}
                          name={`employers[${i}].street`}
                          placeholder="123 Main St"
                          formik={form}
                        />
                      </div>
                      <div className="col-md-6 mt-2">
                        <Col className="p-0">
                          <strong>City</strong>
                        </Col>
                        <BaseInput
                          readOnly={Boolean(entity?.is_hired)}
                          name={`employers[${i}].city`}
                          placeholder="City"
                          formik={form}
                        />
                      </div>
                      <div className="col-md-3 mt-2">
                        <Col className="p-0">
                          <strong>State</strong>
                        </Col>
                        <StateSelect
                          readOnly={Boolean(entity?.is_hired)}
                          name={`employers[${i}].state`}
                          placeholder="State"
                          formik={form}
                        />
                      </div>
                      <div className="col-md-3 mt-2">
                        <Col className="p-0">
                          <strong>Zip Code</strong>
                        </Col>
                        <BaseInput
                          readOnly={Boolean(entity?.is_hired)}
                          name={`employers[${i}].zip_code`}
                          placeholder="12345"
                          formik={form}
                        />
                      </div>
                      <div className="col-md-6 mt-2">
                        <Col className="p-0">
                          <strong>Phone</strong>
                        </Col>
                        <BaseInputPhone
                          readOnly={Boolean(entity?.is_hired)}
                          name={`employers[${i}].phone`}
                          placeholder="(555) 555-5555"
                          formik={form}
                        />
                      </div>
                      <div className="col-md-6 mt-2">
                        <Col className="p-0">
                          <strong>Email</strong>
                        </Col>
                        <BaseInput
                          readOnly={Boolean(entity?.is_hired)}
                          name={`employers[${i}].email`}
                          type="email"
                          placeholder="email@company.com"
                          formik={form}
                        />
                      </div>
                      <div className="col-md-12 mt-2">
                        <Col className="p-0">
                          <strong>Manager Name</strong>
                        </Col>
                        <BaseInput
                          readOnly={Boolean(entity?.is_hired)}
                          name={`employers[${i}].manager_name`}
                          placeholder="John Smith"
                          formik={form}
                        />
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
                          disabled={employer?.is_current}
                        />
                      </div>
                      <div className="col-md-12 mt-2">
                        <BaseCheck
                          disabled={Boolean(entity?.is_hired)}
                          label="Currently Employed Here"
                          name={`employers[${i}].is_current`}
                          formik={form}
                        />
                      </div>
                      <div className="col-12 mt-2">
                        <Col className="p-0">
                          <strong>Reason for Leaving</strong>
                        </Col>
                        <BaseTextArea
                          name={`employers[${i}].reason_for_leaving`}
                          placeholder="Describe reason for leaving..."
                          rows={2}
                          formik={form}
                          readOnly={Boolean(entity?.is_hired)}
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
                      <div className="col-md-4 mt-2">
                        <BaseCheck
                          disabled={Boolean(entity?.is_hired)}
                          label="May we contact this employer?"
                          name={`employers[${i}].can_contact`}
                          formik={form}
                        />
                      </div>
                      <div className="col-md-4 mt-2">
                        <BaseCheck
                          disabled={Boolean(entity?.is_hired)}
                          label="Subject to FMCSRs?"
                          name={`employers[${i}].is_subject_to_fmcsrs`}
                          formik={form}
                        />
                      </div>
                      <div className="col-md-4 mt-2">
                        <BaseCheck
                          disabled={Boolean(entity?.is_hired)}
                          label="Subject to drug testing?"
                          name={`employers[${i}].is_subject_to_drug_tests`}
                          formik={form}
                        />
                      </div>
                      <div className="col-12 mt-3">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-voe-${i}`}>
                              {getVoeButtonTooltip(employer, i)}
                            </Tooltip>
                          }
                        >
                          <span className="d-inline-block">
                            <Button
                              size="sm"
                              variant={canSendVoe(employer, i) ? "primary" : "secondary"}
                              disabled={!canSendVoe(employer, i) || workHistoryMetaData.isSubmittingVoe}
                              onClick={() => handleAutoSendVoe(i)}
                              style={!canSendVoe(employer, i) ? { pointerEvents: 'none' } : {}}
                            >
                              {workHistoryMetaData.isSubmittingVoe ? (
                                <>
                                  <LoaderIcon isLoading={true} /> {t('SENDING')}
                                </>
                              ) : (
                                <>
                                  <EnvelopeCheck className="me-1" />
                                  Send VOE
                                </>
                              )}
                            </Button>
                          </span>
                        </OverlayTrigger>
                      </div>
                    </Row></div>
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
                  <PlusCircle className="me-2" /> Add Another Position
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
