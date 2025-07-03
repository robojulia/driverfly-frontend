import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import * as yup from 'yup';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { DrugTestDto } from '../../../../models/jot-form/long-form/drug-test.dto';
import ApplicantApi from '../../../../pages/api/applicant';
import BaseTextArea from '../../base-text-area';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { RadioGroup } from '../../../shared/dha';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';

export function DrugTest() {
  const {
    state: { applicant, applicantExtras, steps },
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
      console.log(`Saved step ${steps} for applicant ${applicant.id}`);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  // Enhanced validation schema with conditional requirements
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
      then: (schema) =>
        schema.test(
          'conditional-required',
          'Please provide details about your positive drug test',
          function (value) {
            // Only require details if user said YES - but allow empty if they want to proceed
            const positiveDrugTest = this.parent.positive_drug_test;
            return positiveDrugTest === true ? (value && value.trim().length > 0) || !value : true;
          }
        ),
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
      let { positive_drug_test_details, positive_drug_test } = values;

      // Handle state persistence for radio button restoration
      if (positive_drug_test === false) {
        // User said NO - clear details
        positive_drug_test_details = '';
      } else if (positive_drug_test === true && !positive_drug_test_details) {
        // User said YES but provided no details - save marker for state restoration
        positive_drug_test_details = '__YES_NO_DETAILS__';
      }

      const updatedApplicant = {
        ...applicant,
        positive_drug_test: positive_drug_test,
        positive_drug_test_details: positive_drug_test_details,
      };

      setApplicant(updatedApplicant);

      // Save form data on submit
      saveFormData({
        applicant: updatedApplicant,
      });

      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    const existingPositiveDrugTest = applicant?.positive_drug_test;
    const existingDrugTestDetails = applicant?.positive_drug_test_details || '';

    // Enhanced state detection for form restoration
    let positiveDrugTestState: boolean | null = null;

    // Drug test state detection
    if (existingPositiveDrugTest === true || existingPositiveDrugTest === false) {
      positiveDrugTestState = existingPositiveDrugTest;
    } else if (existingDrugTestDetails === '__YES_NO_DETAILS__') {
      positiveDrugTestState = true;
    } else if (existingPositiveDrugTest !== undefined && existingPositiveDrugTest !== null) {
      positiveDrugTestState = existingPositiveDrugTest;
    }

    form.setValues({
      ...form.values,
      positive_drug_test: positiveDrugTestState,
      positive_drug_test_details:
        existingDrugTestDetails === '__YES_NO_DETAILS__' ? '' : existingDrugTestDetails, // Clean up marker for display
    });
  }, [applicant]);

  // Custom form validity check - more lenient, allows progression without details
  const checkFormValidity = () => {
    // The question must be answered
    const questionAnswered = form.values.positive_drug_test !== null;

    // Check if there are any validation errors
    const hasNoErrors = Object.keys(form.errors).length === 0;

    // Basic requirement: question answered, no validation errors
    // Details are now optional - users can proceed and fill later
    return questionAnswered && hasNoErrors;
  };

  // Helper function to determine if drug test details should be required (have started filling)
  const isDrugTestDetailsRequired = () => {
    return (
      form.values.positive_drug_test === true &&
      form.values.positive_drug_test_details &&
      form.values.positive_drug_test_details.trim().length > 0
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
                  required={isDrugTestDetailsRequired()}
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
