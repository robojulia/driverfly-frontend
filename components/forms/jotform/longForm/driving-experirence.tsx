import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { useAsyncFormSave } from '../../../../hooks/use-async-form-save';
import { DrivingExperienceDto } from '../../../../models/jot-form/long-form/driving-experience.dto';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { getCDLFormat } from '../../../../utils/cdl-formats';
import { FormActions } from '../form-buttons';
import { Input, Select, MaskedInput } from '../../../shared/dha';
import stateList from '../../../../utils/stateList';

// Custom hook to detect screen size for responsive state list
const useScreenSize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isSmallScreen;
};

export function DrivingExperience() {
  const {
    state: { applicant, applicantExtras, steps },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const current_date = new Date();
  const [isFormValid, setIsFormValid] = useState(false);
  const isSmallScreen = useScreenSize();

  // Initialize async form saving
  const { saveFormData } = useAsyncFormSave(applicant?.id, steps);

  // Create responsive state list
  const responsiveStateList = isSmallScreen
    ? stateList.map((state) => ({ ...state, label: state.value }))
    : stateList;

  // Track the license issuing state to manage the CDL input mask
  const [selectedIssuedState, setSelectedIssuedState] = useState<string>(
    applicant?.license_state || ''
  );

  // Get the CDL format based on the selected state
  const cdlFormat = getCDLFormat(selectedIssuedState);

  // Helper function to format date for date input
  const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  // Initialize the form
  const form = useFormik({
    initialValues: {
      license_number: applicant?.license_number || '',
      license_expiry: formatDateForInput(applicant?.license_expiry),
      license_state: applicant?.license_state || '',
    },
    validationSchema: DrivingExperienceDto.yupSchema(),
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const updatedApplicant = {
        ...applicant,
        license_number: values.license_number,
        license_expiry: values.license_expiry,
        license_state: values.license_state,
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

  // Check if form is valid
  useEffect(() => {
    const requiredFields = ['license_number', 'license_expiry', 'license_state'];
    const hasAllRequiredFields = requiredFields.every((field) => !!form.values[field]);
    const hasNoErrors = Object.keys(form.errors).length === 0;

    // For prefilled forms, allow proceeding if all fields are filled correctly
    // Only require dirty state if starting from empty form
    const isEmpty = requiredFields.every((field) => !form.initialValues[field]);
    const isValid = hasAllRequiredFields && hasNoErrors && (form.dirty || !isEmpty);

    // Debug logging to understand validation state
    console.log('Form validation state:', {
      hasAllRequiredFields,
      hasNoErrors,
      isEmpty,
      dirty: form.dirty,
      isValid,
      values: form.values,
      errors: form.errors,
      initialValues: form.initialValues,
    });

    setIsFormValid(isValid);
  }, [form.values, form.errors, form.dirty, form.initialValues]);

  // Handle issuing state change
  const handleIssuedStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;

    // If the state has changed, update and clear CDL number
    if (newState !== selectedIssuedState) {
      // Update the state in our local state
      setSelectedIssuedState(newState);

      // Update form values
      form.setFieldValue('license_state', newState);
      form.setFieldValue('license_number', '');
    } else {
      // Just update the form value
      form.setFieldValue('license_state', newState);
    }
  };

  // Handle license number input - convert to uppercase
  const handleLicenseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseValue = e.target.value.toUpperCase();
    form.setFieldValue('license_number', uppercaseValue);
  };

  // Initialize form with applicant data when component mounts
  useEffect(() => {
    if (applicant) {
      // Set issuing state first for proper CDL format
      if (applicant.license_state) {
        setSelectedIssuedState(applicant.license_state);
      }

      // Set form values and mark as touched to ensure validation runs
      const newValues = {
        license_number: applicant.license_number || '',
        license_expiry: formatDateForInput(applicant.license_expiry),
        license_state: applicant.license_state || '',
      };

      form.setValues(newValues);

      // If we have prefilled data, mark the fields as touched to trigger validation
      if (applicant.license_number || applicant.license_expiry || applicant.license_state) {
        form.setTouched({
          license_number: true,
          license_expiry: true,
          license_state: true,
        });
      }
    }
  }, [applicant]);

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
        {t('DRVING_EXPERIENCE')}
      </h1>

      <div
        style={{
          maxWidth: '100%',
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
          Please provide your Commercial Driver&apos;s License (CDL) information.
        </p>
      </div>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.formStep}>
        <div style={{ maxWidth: '100%', margin: '0', padding: '0 1rem' }}>
          {/* State Issued and CDL Number - Side by side on larger screens */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <Select
              name="license_state"
              label={t('state_issued')}
              placeholder={t('ISSUANCE_STATE')}
              options={responsiveStateList}
              value={form.values.license_state || ''}
              onChange={handleIssuedStateChange}
              onBlur={form.handleBlur}
              required
              error={
                form.touched.license_state && form.errors.license_state
                  ? String(form.errors.license_state)
                  : undefined
              }
              helperText="Select the state where your CDL was issued"
            />

            <MaskedInput
              name="license_number"
              label={t('CDL_NUMBER')}
              placeholder={cdlFormat.placeholder}
              mask={cdlFormat.mask}
              value={form.values.license_number || ''}
              onChange={handleLicenseNumberChange}
              onBlur={form.handleBlur}
              required
              disabled={!selectedIssuedState}
              error={
                form.touched.license_number && form.errors.license_number
                  ? String(form.errors.license_number)
                  : undefined
              }
              helperText={t(cdlFormat.description)}
            />
          </div>

          {/* Expiration Date */}
          <div style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
            <Input
              name="license_expiry"
              label={t('expiration_date')}
              placeholder={t('expiration_date')}
              type="date"
              value={form.values.license_expiry || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
              error={
                form.touched.license_expiry && form.errors.license_expiry
                  ? t('LICENSE_HAS_EXPIRED')
                  : undefined
              }
              helperText="Enter the expiration date of your CDL"
            />
          </div>
        </div>

        <FormActions
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={form.isSubmitting}
          isValid={isFormValid}
          nextButtonText={t('NEXT')}
          backButtonText={t('BACK')}
        />
      </Form>
    </>
  );
}
