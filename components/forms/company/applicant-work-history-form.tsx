import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { ChevronUp, PlusCircle, XCircle, FileEarmarkText } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

import { ApplicantType } from '../../../enums/applicants/applicant-type.enum';
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
import ViewCard from '../../view-details/view-card';
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

  const form = useFormik({
    initialValues: new ApplicantEntity(),
    validationSchema: ApplicantEntity.yupSchemaForApplicantWorkHistory(),
    onSubmit: async (values) => {
      setWorkHistoryMetaData((prev) => ({ ...prev, isSubmittingVoe: true }));
      setIsSubmitting(true);
      try {
        if (entity?.id) {
          values = await applicantApi.update(entity.id, {
            ...values,
          });
        } else {
          values = await applicantApi.create(values);
        }
        formSuccess(t, entity?.id ? 'update' : 'create', 'APPLICANT');
        setEntity(values);
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

  useEffectAsync(async () => {
    if (!!entity?.id) {
      form.setValues({
        ...entity,
      });
    } else {
      await form.setValues({
        ...new ApplicantEntity(),
        type: ApplicantType.COMPANY,
      });
    }
  }, [entity]);

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

  return (
    <Form onSubmit={form.handleSubmit} className={className}>
      {form?.isSubmitting ? (
        <LoaderIcon isLoading={form?.isSubmitting} />
      ) : (
        <Row>
          <Col md="12" className="p-0 px-lg-2">
            <ViewCard
              title="WORK_HISTORY"
              actions={
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={handleVoeSummaryClick}
                    disabled={!entity?.uuid_token}
                    title={t('GENERATE_VOE_SUMMARY_PDF')}
                  >
                    <FileEarmarkText className="me-1" />
                    {t('VOE_SUMMARY')}
                  </Button>
                  <Button
                    disabled={Boolean(entity?.is_hired)}
                    size="sm"
                    onClick={() =>
                      form.setValues({
                        ...form.values,
                        employers: [new ApplicantEmployerEntity(), ...(form.values?.employers || [])],
                      })
                    }
                  >
                    <PlusCircle /> {t('ADD')}
                  </Button>
                </div>
              }
            >
              {form.values?.employers?.length > 0 && (
                <>
                  {form.values?.employers?.map((e, i) => {
                    const meta = form.getFieldMeta(`employers[${i}]`);
                    const hasError = Object.keys(e || {}).some(
                      (v) => form.getFieldMeta(`employers[${i}].${v}`).error
                    );

                    // Check if the applicant is not actively employed at the current company
                    const applicantNotActivelyEmployed =
                      workHistoryMetaData?.curentCompanyCheck?.id !=
                        form.values?.employers[i]?.id || !form.values?.employers[i]?.is_current;
                    return (
                      <Accordion
                        key={i}
                        defaultExpanded={i == 0 || !meta.touched || hasError}
                        expanded={hasError || undefined}
                      >
                        <AccordionSummary expandIcon={<ChevronUp />}>
                          <div
                            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                          >
                            <span>
                              <b>{e.name || t('NEW_EMPLOYER')}</b>
                            </span>
                            <Button
                              disabled={Boolean(entity?.is_hired)}
                              type="button"
                              size="sm"
                              style={{ marginLeft: '10px' }}
                              variant="danger"
                              onClick={(v) =>
                                form.setValues({
                                  ...form.values,
                                  employers: form.values?.employers?.filter((v, idx) => idx != i),
                                })
                              }
                            >
                              <XCircle /> {t('REMOVE')}
                            </Button>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Row>
                            <BaseInput
                              readOnly={Boolean(entity?.is_hired)}
                              className="col-12 mt-2"
                              name={`employers[${i}].name`}
                              label="COMPANY_NAME"
                              required
                              placeholder="ENTER_COMPANY_NAME"
                              formik={form}
                            />
                            <BaseInput
                              className="col-12 mt-2"
                              readOnly={Boolean(entity?.is_hired)}
                              name={`employers[${i}].title`}
                              label="TITLE"
                              placeholder="ENTER_JOB_TITLE"
                              formik={form}
                            />
                            <BaseInput
                              className="col-12 mt-2"
                              name={`employers[${i}].manager_name`}
                              label="MANAGER_OR_REPRESENTATIVE"
                              placeholder="ENTER_MANAGER"
                              formik={form}
                            />
                            <BaseInput
                              className="col-12 mt-2"
                              readOnly={Boolean(entity?.is_hired)}
                              label="EMAIL"
                              type="email"
                              name={`employers[${i}].email`}
                              placeholder="ENTER_EMAIL"
                              formik={form}
                            />
                            <BaseInput
                              readOnly={Boolean(entity?.is_hired)}
                              className="col-6 mt-2"
                              name={`employers[${i}].start_at`}
                              label="DATES_EMPLOYED"
                              type="date"
                              max={new Date().toISOString().split('T')[0]}
                              formik={form}
                            />
                            {applicantNotActivelyEmployed ? (
                              <BaseInput
                                className="col-6 mt-2"
                                readOnly={Boolean(entity?.is_hired)}
                                name={`employers[${i}].end_at`}
                                label="THROUGH"
                                type="date"
                                formik={form}
                              />
                            ) : (
                              <div className="col-6 "></div>
                            )}
                            <BaseInput
                              className="col-md-6 mt-2"
                              name={`employers[${i}].address`}
                              placeholder="ENTER_ADDRESS_LINE1"
                              label="ADDRESS_LINE_1"
                              formik={form}
                            />
                            <BaseInput
                              className="col-md-6 mt-2"
                              name={`employers[${i}].address_2`}
                              placeholder="ENTER_ADDRESS_LINE2"
                              label="ADDRESS_LINE_2"
                              formik={form}
                            />

                            <BaseInput
                              className="col-5 mt-2"
                              readOnly={Boolean(entity?.is_hired)}
                              name={`employers[${i}].city`}
                              label="CITY"
                              placeholder="ENTER_CITY"
                              formik={form}
                            />
                            <StateSelect
                              className="col-4 mt-2"
                              readOnly={Boolean(entity?.is_hired)}
                              name={`employers[${i}].state`}
                              label="STATE"
                              placeholder="SELECT_STATE"
                              formik={form}
                            />
                            <BaseInput
                              className="col-3 mt-2"
                              readOnly={Boolean(entity?.is_hired)}
                              name={`employers[${i}].zip_code`}
                              label="ZIP_CODE"
                              placeholder="ENTER_ZIP_CODE"
                              formik={form}
                            />

                            <BaseInputPhone
                              className="col-12 mt-2"
                              readOnly={Boolean(entity?.is_hired)}
                              name={`employers[${i}].phone`}
                              label="PHONE"
                              placeholder="ENTER_PHONE"
                              formik={form}
                            />
                            {(!form.values.employers?.some((v) => v.is_current) ||
                              form.values.employers?.indexOf(
                                form.values.employers?.find((v) => v.is_current)
                              ) == i) && (
                              <BaseCheck
                                className="col-12 mt-2"
                                disabled={currentCompanyCheckBox(form.values?.employers[i])}
                                name={`employers[${i}].is_current`}
                                label="CURRENT_COMPANY"
                                formik={form}
                              />
                            )}
                            <BaseCheck
                              className="col-12 mt-2"
                              disabled={Boolean(entity?.is_hired)}
                              name={`employers[${i}].can_contact`}
                              label="MAY_CONTACT_COMPANY"
                              formik={form}
                            />
                            <BaseCheck
                              className="col-12 mt-2"
                              disabled={Boolean(entity?.is_hired)}
                              name={`employers[${i}].is_subject_to_fmcsrs`}
                              label="SUBJECT_TO_FMCSRS"
                              formik={form}
                            />
                            <BaseCheck
                              className="col-12 mt-2"
                              disabled={Boolean(entity?.is_hired)}
                              name={`employers[${i}].is_subject_to_drug_tests`}
                              label="JOB_DESIGNATED_AS_SATEFY_SENSITIVE"
                              formik={form}
                            />

                            {/* Reason for Leaving - show for all employers (past and current if they left) */}
                            {(!form.values.employers?.[i]?.is_current ||
                              form.values.employers?.[i]?.end_at) && (
                              <BaseTextArea
                                className="col-12 mt-2"
                                name={`employers[${i}].reason_for_leaving`}
                                label="REASON_FOR_LEAVING"
                                placeholder="Please explain why the applicant left this position..."
                                formik={form}
                                rows={3}
                              />
                            )}

                            <div style={{ display: 'flex', justifyContent: 'right' }}>
                              {(() => {
                                return renderSendBackgroundRequestButton(
                                  form,
                                  i,
                                  workHistoryMetaData,
                                  entity,
                                  isSubmitting,
                                  handleSendBackgroundRequest,
                                  t
                                );
                              })()}
                            </div>
                          </Row>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </>
              )}

              {!form.values?.employers?.length && <>{t('NONE')}</>}

              <BaseTextArea
                className="mt-3"
                label="EMPLOYMENT_GAP_DETAILS_LABEL"
                formik={form}
                name="employment_gap_details"
              />
              <div style={{ display: 'flex', justifyContent: 'right' }}>
                <Button
                  disabled={form.isSubmitting || isSubmitting}
                  style={{ marginTop: '3%' }}
                  type="submit"
                  className="theme-secondary-btn"
                >
                  {t('UPDATE')}
                </Button>
              </div>
            </ViewCard>
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
