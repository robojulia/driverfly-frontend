import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { Form, Row } from 'react-bootstrap';
import jotformContext from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { WorkedBeforeDto } from '../../../../models/jot-form/long-form/worked-before.dto';
import ApplicantApi from '../../../../pages/api/applicant';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { FormActions } from '../form-buttons';
import { Input, RadioGroup } from '../../../shared/dha';
import { ApplicationCompletionChecklist } from '../../../applicants/application-completion-checker';

export function WorkedBefore() {
  const {
    state: { applicant, steps, isEditingExistingApplicant },
    method: { setApplicant, stepNext, stepBack },
  } = useContext(jotformContext);

  const { t } = useTranslation();

  // Check if this is a returning applicant to the same company
  const isReturningApplicant = isEditingExistingApplicant && applicant?.already_applied_to_company === true;

  // Save form data function
  const saveFormData = async (formData: any) => {
    if (!applicant?.id || steps <= 9) return;

    try {
      const applicantApi = new ApplicantApi();
      await applicantApi.jotform.update(applicant.id, formData);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const form = useFormik({
    initialValues: {
      ...new WorkedBeforeDto(),
      already_applied_to_company: applicant.already_applied_to_company ?? null,
      already_worked_to_company: applicant.already_worked_to_company ?? null,
      already_worked_start_date: applicant.already_worked_start_date ?? null,
      already_worked_end_date: applicant.already_worked_end_date ?? null,
    },
    validationSchema: WorkedBeforeDto.yupSchema(),
    validateOnMount: true,
    validateOnChange: true,
    onSubmit: (values) => {
      // For returning applicants, ensure already_applied_to_company is set to true
      const updatedApplicant = {
        ...applicant,
        ...values,
        ...(isReturningApplicant && { already_applied_to_company: true })
      };

      setApplicant(updatedApplicant);

      // Save form data on submit
      saveFormData({
        applicant: updatedApplicant,
      });

      stepNext();
    },
    onReset: () => {
      stepBack();
    },
  });

  // Initialize with applicant values once on component mount
  useEffect(() => {
    if (applicant) {
      form.setValues({
        ...form.values,
        already_applied_to_company:
          isReturningApplicant
            ? true // For returning applicants, always set to true
            : applicant.already_applied_to_company !== undefined
            ? applicant.already_applied_to_company
            : null,
        already_worked_to_company:
          applicant.already_worked_to_company !== undefined
            ? applicant.already_worked_to_company
            : null,
        already_worked_start_date: applicant.already_worked_start_date ?? null,
        already_worked_end_date: applicant.already_worked_end_date ?? null,
      });

      // Validate form after setting values
      setTimeout(() => {
        form.validateForm();
      }, 0);
    }
  }, []);

  // Helper functions for radio group values
  const getAppliedBeforeValue = () => {
    if (form.values.already_applied_to_company === true) return BooleanType.YES;
    if (form.values.already_applied_to_company === false) return BooleanType.NO;
    return undefined;
  };

  const getWorkedBeforeValue = () => {
    if (form.values.already_worked_to_company === true) return BooleanType.YES;
    if (form.values.already_worked_to_company === false) return BooleanType.NO;
    return undefined;
  };

  // Handle radio group changes
  const handleAppliedBeforeChange = (value: string) => {
    let newValue: boolean | null = null;
    if (value === BooleanType.YES) {
      newValue = true;
    } else if (value === BooleanType.NO) {
      newValue = false;
      // Reset dependent fields when "No" is selected
      form.setFieldValue('already_worked_to_company', false);
      form.setFieldValue('already_worked_start_date', null);
      form.setFieldValue('already_worked_end_date', null);
    }
    form.setFieldValue('already_applied_to_company', newValue);
  };

  const handleWorkedBeforeChange = (value: string) => {
    let newValue: boolean | null = null;
    if (value === BooleanType.YES) {
      newValue = true;
    } else if (value === BooleanType.NO) {
      newValue = false;
      // Clear date fields when "No" is selected
      form.setFieldValue('already_worked_start_date', null);
      form.setFieldValue('already_worked_end_date', null);
    }
    form.setFieldValue('already_worked_to_company', newValue);
  };

  // Format date for input
  const formatDateForInput = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Get max date (today)
  const getMaxDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleNext = () => {
    const syntheticEvent = {
      preventDefault: () => {},
      target: {},
    } as any;
    form.handleSubmit(syntheticEvent);
  };

  const handleBack = () => {
    const syntheticEvent = {
      preventDefault: () => {},
      target: {},
    } as any;
    form.handleReset(syntheticEvent);
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {isReturningApplicant ? t('UPDATE_YOUR_APPLICATION') : t('WORKED_BEFORE')}
      </h1>

      {isReturningApplicant ? (
        <>
          {/* Show completion checklist for returning applicants */}
          <ApplicationCompletionChecklist applicant={applicant} isSameCompany={true} />

          {/* Contextual message for this specific section */}
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto 2rem auto',
              padding: '1rem',
              backgroundColor: '#e7f3ff',
              border: '1px solid #2196F3',
              borderRadius: '8px',
              color: '#004085',
              fontSize: '0.95rem',
              lineHeight: '1.5',
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>For this section:</strong> Please confirm if you have previously worked for{' '}
              <strong>{applicant?.company?.name}</strong> (as an employee). This is different from just applying.
            </p>
          </div>
        </>
      ) : (
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto 2rem auto',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e0e5eb',
            borderRadius: '8px',
            color: '#667788',
            fontSize: '0.95rem',
            lineHeight: '1.5',
          }}
        >
          <p style={{ margin: 0 }}>
            Please let us know if you have previously applied to or worked with{' '}
            <strong>{applicant?.company?.name}</strong>. This helps us better understand your
            background and experience with our company.
          </p>
        </div>
      )}

      <Form
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
        className={`${styles.align__text_left} ${styles.formStep}`}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* First Question: Applied Before - Only show for non-returning applicants who haven't answered yet */}
          {!isReturningApplicant && form.values.already_applied_to_company === null && (
            <div className="my-4">
              <RadioGroup
                name="already_applied_to_company"
                label={t('APPLIED_HERE_BEFORE')}
                enumType={BooleanType}
                value={getAppliedBeforeValue()}
                onChange={handleAppliedBeforeChange}
                required
                error={
                  form.touched.already_applied_to_company && form.errors.already_applied_to_company
                    ? String(form.errors.already_applied_to_company)
                    : undefined
                }
                labelPrefix="BooleanType"
                columns={2}
                variant="card"
                helperText="Select 'Yes' if you have previously submitted an application to this company"
              />
            </div>
          )}

          {/* Second Question: Worked Before (conditional) */}
          {(form.values.already_applied_to_company === true || isReturningApplicant) && (
            <div className="my-4">
              <RadioGroup
                name="already_worked_to_company"
                label={t('WORKED_HERE_BEFORE')}
                enumType={BooleanType}
                value={getWorkedBeforeValue()}
                onChange={handleWorkedBeforeChange}
                required
                error={
                  form.touched.already_worked_to_company && form.errors.already_worked_to_company
                    ? String(form.errors.already_worked_to_company)
                    : undefined
                }
                labelPrefix="BooleanType"
                columns={2}
                variant="card"
                helperText="Select 'Yes' if you were previously employed by this company"
              />
            </div>
          )}

          {/* Date Range (conditional) */}
          {form.values.already_worked_to_company === true && (
            <div className="my-4">
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              >
                <h6 style={{ marginBottom: '1rem', color: '#495057' }}>
                  Employment Period Details
                </h6>
                <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '1rem' }}>
                  Please provide the dates when you worked for {applicant?.company?.name}
                </p>

                <Row className="g-3">
                  <div className="col-md-6">
                    <Input
                      name="already_worked_start_date"
                      type="date"
                      label={t('FROM')}
                      placeholder="Select start date"
                      value={formatDateForInput(form.values.already_worked_start_date)}
                      onChange={(e) => {
                        const value = e.target.value ? new Date(e.target.value) : null;
                        form.setFieldValue('already_worked_start_date', value);
                      }}
                      onBlur={form.handleBlur}
                      required
                      max={getMaxDate()}
                      error={
                        form.touched.already_worked_start_date &&
                        form.errors.already_worked_start_date
                          ? String(form.errors.already_worked_start_date)
                          : undefined
                      }
                      icon={<span>📅</span>}
                      helperText="When did you start working here?"
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      name="already_worked_end_date"
                      type="date"
                      label={t('TO')}
                      placeholder="Select end date"
                      value={formatDateForInput(form.values.already_worked_end_date)}
                      onChange={(e) => {
                        const value = e.target.value ? new Date(e.target.value) : null;
                        form.setFieldValue('already_worked_end_date', value);
                      }}
                      onBlur={form.handleBlur}
                      required
                      max={getMaxDate()}
                      min={formatDateForInput(form.values.already_worked_start_date)}
                      error={
                        form.touched.already_worked_end_date && form.errors.already_worked_end_date
                          ? String(form.errors.already_worked_end_date)
                          : undefined
                      }
                      icon={<span>📅</span>}
                      helperText="When did you stop working here?"
                    />
                  </div>
                </Row>
              </div>
            </div>
          )}
        </div>

        <FormActions
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={form.isSubmitting}
          isValid={form.isValid && !form.isValidating}
          nextButtonText={t('NEXT')}
          backButtonText={t('BACK')}
        />
      </Form>
    </>
  );
}
