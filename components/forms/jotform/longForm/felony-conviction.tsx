import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import * as yup from 'yup';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { FelonyConvictionDto } from '../../../../models/jot-form/long-form/felony-conviction.dto';
import ApplicantApi from '../../../../pages/api/applicant';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { RadioGroup } from '../../../shared/dha';
import BaseTextArea from '../../base-text-area';

export function FelonyConviction() {
  const {
    state: { applicant, steps },
    method: { setApplicant, stepNext, stepBack },
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

  // Enhanced validation schema with conditional requirements
  const validationSchema = yup.object({
    is_convicted_felony: yup
      .boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select whether you have been convicted of a felony',
        (value) => value !== null
      ),
    criminal_history: yup.string().when('is_convicted_felony', {
      is: true,
      then: (schema) =>
        schema.test(
          'conditional-required',
          'Please provide details about your criminal history',
          function (value) {
            // Only require details if user said YES - but allow empty if they want to proceed
            const isConvictedFelony = this.parent.is_convicted_felony;
            return isConvictedFelony === true ? (value && value.trim().length > 0) || !value : true;
          }
        ),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const form = useFormik({
    initialValues: {
      is_convicted_felony: null as boolean | null,
      criminal_history: '',
    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      let { is_convicted_felony, criminal_history } = values;

      // Handle state persistence for radio button restoration
      if (is_convicted_felony === false) {
        // User said NO - clear details
        criminal_history = '';
      } else if (is_convicted_felony === true && !criminal_history) {
        // User said YES but provided no details - save marker for state restoration
        criminal_history = '__YES_NO_DETAILS__';
      }

      const updatedApplicant = {
        ...applicant,
        criminal_history,
        is_convicted_felony,
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

  // Initialize form with applicant data once on mount
  useEffect(() => {
    if (applicant) {
      const existingIsConvictedFelony = (applicant as any)?.is_convicted_felony;
      const existingCriminalHistory = applicant?.criminal_history || '';

      // Enhanced state detection for form restoration
      let isConvictedFelonyState: boolean | null = null;

      // Felony conviction state detection
      if (existingIsConvictedFelony === true || existingIsConvictedFelony === false) {
        isConvictedFelonyState = existingIsConvictedFelony;
      } else if (existingCriminalHistory === '__YES_NO_DETAILS__') {
        isConvictedFelonyState = true;
      } else if (existingIsConvictedFelony !== undefined && existingIsConvictedFelony !== null) {
        isConvictedFelonyState = existingIsConvictedFelony;
      }

      form.setValues({
        ...form.values,
        is_convicted_felony: isConvictedFelonyState,
        criminal_history:
          existingCriminalHistory === '__YES_NO_DETAILS__' ? '' : existingCriminalHistory, // Clean up marker for display
      });

      // Validate form after setting values
      setTimeout(() => {
        form.validateForm();
      }, 0);
    }
  }, [applicant]);

  // Custom form validity check - more lenient, allows progression without details
  const checkFormValidity = () => {
    // The question must be answered
    const questionAnswered = form.values.is_convicted_felony !== null;

    // Check if there are any validation errors
    const hasNoErrors = Object.keys(form.errors).length === 0;

    // Basic requirement: question answered, no validation errors
    // Details are now optional - users can proceed and fill later
    return questionAnswered && hasNoErrors;
  };

  // Helper function to determine if criminal history should be required (have started filling)
  const isCriminalHistoryRequired = () => {
    return (
      form.values.is_convicted_felony === true &&
      form.values.criminal_history &&
      form.values.criminal_history.trim().length > 0
    );
  };

  // Update validity state whenever form values or errors change
  useEffect(() => {
    const newIsValid = checkFormValidity();
    if (newIsValid !== isValid) {
      setIsValid(newIsValid);
    }
  }, [form.values, form.errors, form.touched]);

  // Helper functions for radio group values
  const getFelonyConvictionValue = () => {
    if (form.values.is_convicted_felony === true) return BooleanType.YES;
    if (form.values.is_convicted_felony === false) return BooleanType.NO;
    return undefined;
  };

  // Handle radio group changes
  const handleFelonyConvictionChange = (value: string) => {
    const hasConviction = value === BooleanType.YES;

    form.setFieldValue('is_convicted_felony', hasConviction);
    form.setFieldTouched('is_convicted_felony', true);

    // If they don't have a conviction, clear the criminal history
    if (!hasConviction) {
      form.setFieldValue('criminal_history', '');
    }

    // Force validation to run immediately
    setTimeout(() => {
      form.validateForm();
    }, 0);
  };

  const handleNext = () => {
    // Mark all fields as touched to show validation errors
    form.setFieldTouched('is_convicted_felony', true);
    if (form.values.is_convicted_felony === true) {
      form.setFieldTouched('criminal_history', true);
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
        {t('FELONY_CONVICTION')}
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
          ⚖️ Criminal History & Background
        </p>
        <p style={{ margin: 0 }}>
          We are required to ask about criminal history as part of our background verification
          process. Having a criminal record does not automatically disqualify you from employment,
          and we consider each case individually in compliance with applicable laws.
        </p>
      </div>

      <Form
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
        className={`${styles.align__text_left} ${styles.formStep}`}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Felony Conviction Question */}
          <div className="my-4">
            <RadioGroup
              name="is_convicted_felony"
              label={t('EVER_FELONY_QUESTION')}
              enumType={BooleanType}
              value={getFelonyConvictionValue()}
              onChange={handleFelonyConvictionChange}
              required
              error={
                form.touched.is_convicted_felony && form.errors.is_convicted_felony
                  ? String(form.errors.is_convicted_felony)
                  : undefined
              }
              labelPrefix="BooleanType"
              columns={2}
              variant="card"
              helperText="Include all felony convictions, regardless of when they occurred"
            />
          </div>

          {/* Criminal History Details */}
          {form.values.is_convicted_felony === true && (
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
                  name="criminal_history"
                  label={t('PAST_CONVICTION')}
                  placeholder="Please provide details about your conviction(s), including dates, charges, and current status..."
                  formik={form}
                  rows={4}
                  required={isCriminalHistoryRequired()}
                />
                <small className="text-muted">
                  Include dates of conviction, nature of the charges, and any relevant
                  circumstances. This information helps us make fair hiring decisions in compliance
                  with applicable laws.
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
