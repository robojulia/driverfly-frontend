import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
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
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const current_date = new Date();
  const [isFormValid, setIsFormValid] = useState(false);
  const isSmallScreen = useScreenSize();

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

  // Initialize the form
  const form = useFormik({
    initialValues: {
      license_number: applicant?.license_number || '',
      state: applicant?.state || '',
      license_expiry: applicant?.license_expiry || '',
      license_state: applicant?.license_state || '',
    },
    validationSchema: DrivingExperienceDto.yupSchema(),
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      try {
        // Save form values to applicant context
        setApplicant({
          ...applicant,
          license_number: values.license_number,
          state: values.state,
          license_expiry: values.license_expiry,
          license_state: values.license_state,
        });
        stepNext();
      } catch (error) {
        console.error('Error submitting driving experience form:', error);
      }
    },
    onReset: () => {
      stepBack();
    },
  });

  // Check if form is valid
  useEffect(() => {
    const requiredFields = ['license_number', 'state', 'license_expiry', 'license_state'];
    const hasAllRequiredFields = requiredFields.every((field) => !!form.values[field]);
    const hasNoErrors = Object.keys(form.errors).length === 0;
    setIsFormValid(hasAllRequiredFields && hasNoErrors && form.dirty);
  }, [form.values, form.errors, form.dirty]);

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

      // Set form values
      form.setValues({
        license_number: applicant.license_number || '',
        state: applicant.state || '',
        license_expiry: applicant.license_expiry || '',
        license_state: applicant.license_state || '',
      });
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
          Please provide your Commercial Driver&apos;s License (CDL) information and current address
          details.
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

          {/* Current State and Expiration Date - Side by side on larger screens */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <Select
              name="state"
              label={t('CURRENT_STATE')}
              placeholder={t('STATE')}
              options={responsiveStateList}
              value={form.values.state || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
              error={
                form.touched.state && form.errors.state ? String(form.errors.state) : undefined
              }
              helperText="Select the state where you currently reside"
            />

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
                  ? String(form.errors.license_expiry)
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
