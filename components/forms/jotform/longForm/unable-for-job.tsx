import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import * as yup from 'yup';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { ApplicantExtras } from '../../../../enums/applicants/applicant-extras.enum';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantExtrasEntity } from '../../../../models/applicant/applicant-extras.entity';
import { UnableForJobDto } from '../../../../models/jot-form/long-form/unable-for-job.dto';
import ApplicantApi from '../../../../pages/api/applicant';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { RadioGroup } from '../../../shared/dha';
import BaseTextArea from '../../base-text-area';

export function UnableForJob() {
  const {
    state: { applicant, applicantExtras, steps },
    method: { updateApplicantExtras, setApplicantExtras, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isValid, setIsValid] = useState(false);

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

  // Enhanced validation schema
  const validationSchema = yup.object({
    is_unable_to_perform: yup
      .boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select whether you can perform the essential job functions',
        (value) => value !== null
      ),
    REASON_FOR_UNABLE_TO_PERFORM_JOB: yup.object().when('is_unable_to_perform', {
      is: true,
      then: (schema) =>
        schema.shape({
          value: yup.string().required('Please explain your limitations or accommodations needed'),
        }),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const form = useFormik({
    initialValues: {
      is_unable_to_perform: null as boolean | null,
      REASON_FOR_UNABLE_TO_PERFORM_JOB: new ApplicantExtrasEntity(
        ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
      ),
    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log('Submitting unable for job form with values:', values);

      if (values.is_unable_to_perform) {
        // If they cannot perform the job, save the extra with the reason
        const { REASON_FOR_UNABLE_TO_PERFORM_JOB } = values;
        updateApplicantExtras(REASON_FOR_UNABLE_TO_PERFORM_JOB);

        // Save form data on submit
        saveFormData({
          applicant,
          applicantExtras: [
            ...(applicantExtras?.filter(
              (v) => v?.type !== ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
            ) || []),
            REASON_FOR_UNABLE_TO_PERFORM_JOB,
          ],
        });
      } else {
        // If they can perform the job, remove the extra completely
        const filteredExtras =
          applicantExtras?.filter(
            (v) => v?.type !== ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
          ) || [];

        setApplicantExtras(filteredExtras);

        // Save form data on submit
        saveFormData({
          applicant,
          applicantExtras: filteredExtras,
        });
      }

      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    const apx = applicantExtras?.find(
      (v) => v.type == ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
    );

    form.setValues({
      ...form.values,
      REASON_FOR_UNABLE_TO_PERFORM_JOB: !!apx?.type
        ? apx
        : new ApplicantExtrasEntity(ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB),
      is_unable_to_perform: !!apx?.value && apx.value.trim() !== '',
    });
  }, [applicantExtras]);

  // Custom form validity check
  const checkFormValidity = () => {
    // The question must be answered
    const questionAnswered = form.values.is_unable_to_perform !== null;

    // If they are unable to perform job, explanation is required
    let explanationValid = true;
    if (form.values.is_unable_to_perform === true) {
      const explanationValue = form.values.REASON_FOR_UNABLE_TO_PERFORM_JOB?.value;
      explanationValid = !!(explanationValue && explanationValue.trim().length > 0);
    }

    // Check if there are any validation errors
    const hasNoErrors = Object.keys(form.errors).length === 0;

    const isValid = questionAnswered && explanationValid && hasNoErrors;

    // Debug logging to see what's happening
    console.log('Form validation debug:', {
      questionAnswered,
      is_unable_to_perform: form.values.is_unable_to_perform,
      explanation_value: form.values.REASON_FOR_UNABLE_TO_PERFORM_JOB?.value,
      explanationValid,
      hasNoErrors,
      formErrors: form.errors,
      isValid,
    });

    return isValid;
  };

  // Update validity state whenever form values or errors change
  useEffect(() => {
    const newIsValid = checkFormValidity();
    if (newIsValid !== isValid) {
      console.log('Updating isValid state from', isValid, 'to', newIsValid);
      setIsValid(newIsValid);
    }
  }, [form.values, form.errors, form.touched]);

  // Helper functions for radio group values
  const getCanPerformJobValue = () => {
    if (form.values.is_unable_to_perform === false) return BooleanType.YES;
    if (form.values.is_unable_to_perform === true) return BooleanType.NO;
    return undefined;
  };

  // Handle radio group changes
  const handleCanPerformJobChange = (value: string) => {
    const canPerform = value === BooleanType.YES;
    const unableToPerform = !canPerform;

    form.setFieldValue('is_unable_to_perform', unableToPerform);
    form.setFieldTouched('is_unable_to_perform', true);

    // If they can perform the job, remove the extra completely
    if (canPerform) {
      const filtered_extras = applicantExtras?.filter(
        (v) => v?.type != ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
      );
      setApplicantExtras(filtered_extras);
      form.setFieldValue('REASON_FOR_UNABLE_TO_PERFORM_JOB.value', '');
    }

    // Force validation to run immediately
    setTimeout(() => {
      form.validateForm();
    }, 0);
  };

  const handleNext = () => {
    // Mark all fields as touched to show validation errors
    form.setFieldTouched('is_unable_to_perform', true);
    if (form.values.is_unable_to_perform === true) {
      form.setFieldTouched('REASON_FOR_UNABLE_TO_PERFORM_JOB.value', true);
    }

    // Validate the form
    form.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0 && isValid) {
        const syntheticEvent = {
          preventDefault: () => {},
          target: {},
        } as any;
        form.handleSubmit(syntheticEvent);
      }
    });
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
        {t('DISABLE_FOR_JOB')}
      </h1>

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
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#1a2b3c' }}>
          🏢 Job Performance & Accommodations
        </p>
        <p style={{ margin: 0 }}>
          We need to understand if you can perform the essential functions of this job. If you need
          reasonable accommodations, please let us know so we can ensure a supportive work
          environment.
        </p>
      </div>

      <Form
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
        className={`${styles.align__text_left} ${styles.formStep}`}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Can Perform Job Question */}
          <div className="my-4">
            <RadioGroup
              name="is_unable_to_perform"
              label={t('CAN_PERFORM_JOB_FUNCTIONS')}
              enumType={BooleanType}
              value={getCanPerformJobValue()}
              onChange={handleCanPerformJobChange}
              required
              error={
                form.touched.is_unable_to_perform && form.errors.is_unable_to_perform
                  ? String(form.errors.is_unable_to_perform)
                  : undefined
              }
              labelPrefix="BooleanType"
              columns={2}
              variant="card"
              helperText="Select whether you can perform the essential functions of this job with or without reasonable accommodations"
            />
          </div>

          {/* Explanation Section */}
          {form.values.is_unable_to_perform === true && (
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
                <BaseTextArea
                  name="REASON_FOR_UNABLE_TO_PERFORM_JOB.value"
                  label={t('EXPLAIN_LIMITATIONS')}
                  placeholder="Please describe your limitations and any reasonable accommodations you may need..."
                  formik={form}
                  rows={4}
                />
                <small className="text-muted">
                  Include details about specific limitations and what accommodations would help you
                  succeed in this role
                </small>
              </div>
            </div>
          )}
        </div>

        <FormActions
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={form.isSubmitting}
          isValid={isValid}
          nextButtonText={t('NEXT')}
          backButtonText={t('BACK')}
        />
      </Form>
    </>
  );
}
