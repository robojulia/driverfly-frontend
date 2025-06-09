import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import * as yup from 'yup';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { DrugTestDto } from '../../../../models/jot-form/long-form/drug-test.dto';
import BaseTextArea from '../../base-text-area';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { RadioGroup } from '../../../shared/dha';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';

export function DrugTest() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isValid, setIsValid] = useState(false);

  // Enhanced validation schema
  const validationSchema = yup.object({
    positive_drug_test: yup
      .boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select whether you have ever had a positive drug test',
        (value) => value !== null
      ),
    positive_drug_test_details: yup.string().when('positive_drug_test', {
      is: true,
      then: (schema) => schema.required('Please provide details about your positive drug test'),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const form = useFormik({
    initialValues: {
      positive_drug_test: null as boolean | null,
      positive_drug_test_details: '',
    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const { positive_drug_test_details, positive_drug_test } = values;
      setApplicant({
        ...applicant,
        positive_drug_test: positive_drug_test,
        positive_drug_test_details: positive_drug_test_details,
      });
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    form.setValues({
      ...form.values,
      positive_drug_test: applicant?.positive_drug_test || null,
      positive_drug_test_details: applicant?.positive_drug_test_details || '',
    });
  }, [applicant]);

  // Custom form validity check
  const checkFormValidity = () => {
    // The question must be answered
    const questionAnswered = form.values.positive_drug_test !== null;

    // If they had a positive test, explanation is required
    let explanationValid = true;
    if (form.values.positive_drug_test === true) {
      const details = form.values.positive_drug_test_details;
      explanationValid = !!(details && details.trim().length > 0);
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
  const getDrugTestValue = () => {
    if (form.values.positive_drug_test === true) return BooleanType.YES;
    if (form.values.positive_drug_test === false) return BooleanType.NO;
    return undefined;
  };

  // Handle radio group changes
  const handleDrugTestChange = (value: string) => {
    const hasPositiveTest = value === BooleanType.YES;

    form.setFieldValue('positive_drug_test', hasPositiveTest);
    form.setFieldTouched('positive_drug_test', true);

    // If they don't have a positive test, clear the details
    if (!hasPositiveTest) {
      form.setFieldValue('positive_drug_test_details', '');
    }

    // Force validation to run immediately
    setTimeout(() => {
      form.validateForm();
    }, 0);
  };

  const handleNext = () => {
    // Mark all fields as touched to show validation errors
    form.setFieldTouched('positive_drug_test', true);
    if (form.values.positive_drug_test === true) {
      form.setFieldTouched('positive_drug_test_details', true);
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
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t('DRUG_TEST')}</h1>

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
          🧪 Drug Testing History
        </p>
        <p style={{ margin: 0 }}>
          We are required to ask about previous drug testing results as part of our safety and
          compliance procedures. This information helps us ensure a safe work environment for all
          employees and comply with transportation regulations.
        </p>
      </div>

      <Form
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
        className={`${styles.align__text_left} ${styles.formStep}`}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Drug Test Question */}
          <div className="my-4">
            <RadioGroup
              name="positive_drug_test"
              label={t('DRUG_TEST_TESTIMONY_QUESTION')}
              enumType={BooleanType}
              value={getDrugTestValue()}
              onChange={handleDrugTestChange}
              required
              error={
                form.touched.positive_drug_test && form.errors.positive_drug_test
                  ? String(form.errors.positive_drug_test)
                  : undefined
              }
              labelPrefix="BooleanType"
              columns={2}
              variant="card"
              helperText="Include all drug tests administered by employers, DOT, or other agencies"
            />
          </div>

          {/* Drug Test Details */}
          {form.values.positive_drug_test === true && (
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
                  name="positive_drug_test_details"
                  label={t('PLEASE_EXPLAIN')}
                  placeholder="Please provide details about the positive drug test, including dates, circumstances, and any follow-up actions taken..."
                  formik={form}
                  rows={4}
                />
                <small className="text-muted">
                  Include when the test occurred, the substance involved, and any rehabilitation or
                  treatment completed. This information helps us understand your commitment to
                  safety.
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
