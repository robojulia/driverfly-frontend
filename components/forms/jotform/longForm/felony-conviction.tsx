import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import * as yup from 'yup';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { FelonyConvictionDto } from '../../../../models/jot-form/long-form/felony-conviction.dto';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { RadioGroup } from '../../../shared/dha';
import BaseTextArea from '../../base-text-area';

export function FelonyConviction() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isValid, setIsValid] = useState(false);

  // Enhanced validation schema
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
      then: (schema) => schema.required('Please provide details about your criminal history'),
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
      const { is_convicted_felony, criminal_history } = values;
      setApplicant({
        ...applicant,
        criminal_history,
        is_convicted_felony,
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
      form.setValues({
        ...form.values,
        is_convicted_felony: null,
        criminal_history: applicant.criminal_history || '',
      });

      // Validate form after setting values
      setTimeout(() => {
        form.validateForm();
      }, 0);
    }
  }, [applicant]);

  // Custom form validity check
  const checkFormValidity = () => {
    // The question must be answered
    const questionAnswered = form.values.is_convicted_felony !== null;

    // If they have been convicted, explanation is required
    let explanationValid = true;
    if (form.values.is_convicted_felony === true) {
      const criminalHistory = form.values.criminal_history;
      explanationValid = !!(criminalHistory && criminalHistory.trim().length > 0);
    }

    // Check if there are any validation errors
    const hasNoErrors = Object.keys(form.errors).length === 0;

    return questionAnswered && explanationValid && hasNoErrors;
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
