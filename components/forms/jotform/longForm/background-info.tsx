import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { useAsyncFormSave } from '../../../../hooks/use-async-form-save';
import { BackgroundInfoDto } from '../../../../models/jot-form/long-form/background-info.dto';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { Input, DateInput, Select } from '../../../shared/dha';
import stateList from '../../../../utils/stateList';

// Custom hook to detect screen size
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

export function BackgroundInfo() {
  const {
    state: { applicant, applicantExtras, steps },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(false);
  const isSmallScreen = useScreenSize();

  // Initialize async form saving
  const { saveFormData } = useAsyncFormSave(applicant?.id, steps);

  // Create responsive state list
  const responsiveStateList = isSmallScreen
    ? stateList.map((state) => ({ ...state, label: state.value }))
    : stateList;

  // Calculate max date (18 years ago from today)
  const getMaxBirthdate = () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return eighteenYearsAgo.toISOString().split('T')[0];
  };

  const form = useFormik({
    initialValues: new BackgroundInfoDto(),
    validationSchema: BackgroundInfoDto.yupSchema(),
    onSubmit: (values) => {
      const { birthdate, city, state, zip_code, address_1, address_2 } = values;
      const updatedApplicant = {
        ...applicant,
        birthdate,
        city,
        state,
        zip_code,
        address_1,
        address_2,
      };

      setApplicant(updatedApplicant);

      // Save form data on submit
      saveFormData({ applicant: updatedApplicant, applicantExtras });

      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Check if all required fields are filled in
  useEffect(() => {
    const requiredFields = ['birthdate', 'city', 'state', 'zip_code', 'address_1'];
    const hasAllRequiredFields = requiredFields.every((field) => !!form.values[field]);
    const hasNoErrors = Object.keys(form.errors).length === 0;
    setIsFormValid(hasAllRequiredFields && hasNoErrors && form.dirty);
  }, [form.values, form.errors, form.dirty]);

  useEffect(() => {
    const { birthdate, city, state, zip_code, address_1, address_2 } = applicant;

    form.setValues({
      address_1: address_1 || '',
      address_2: address_2 || '',
      birthdate: birthdate || '',
      city: city || '',
      state: state || '',
      zip_code: zip_code || '',
    });
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
        {t('BACKGROUND_INFO')}
      </h1>

      <div className={styles.formInfoBox}>
        <p>{t('BACKGROUND_INFO_HELP_TEXT')}</p>
      </div>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.formStep}>
        <div className={styles.formContainerPadded}>
          <div className={styles.marginBottomLarge}>
            <DateInput
              name="birthdate"
              label={t('birthdate')}
              placeholder={t('birthdate')}
              value={form.values.birthdate || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
              max={getMaxBirthdate()}
              error={
                form.touched.birthdate && form.errors.birthdate
                  ? String(form.errors.birthdate)
                  : undefined
              }
            />
          </div>

          <div className={styles.marginBottomMedium}>
            <h3 className={styles.formSectionHeading}>{t('FULL_ADDRESS_QUES')}</h3>
          </div>

          {/* Address Line 1 - Full width */}
          <div className={styles.marginBottomMedium}>
            <Input
              name="address_1"
              label={t('ADDRESS_LINE_1')}
              placeholder={t('ADDRESS_LINE_1')}
              value={form.values.address_1 || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
              error={
                form.touched.address_1 && form.errors.address_1
                  ? String(form.errors.address_1)
                  : undefined
              }
              autoComplete="address-line1"
            />
          </div>

          {/* Address Line 2 - Full width */}
          <div className={styles.marginBottomMedium}>
            <Input
              name="address_2"
              label={t('ADDRESS_LINE_2')}
              placeholder={t('ADDRESS_LINE_2')}
              value={form.values.address_2 || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={
                form.touched.address_2 && form.errors.address_2
                  ? String(form.errors.address_2)
                  : undefined
              }
              autoComplete="address-line2"
              helperText="Optional - Apartment, suite, unit, etc."
            />
          </div>

          {/* City and State - Side by side on larger screens */}
          <div className={styles.formGridEvenColumns}>
            <Input
              name="city"
              label={t('city')}
              placeholder={t('city')}
              value={form.values.city || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
              error={form.touched.city && form.errors.city ? String(form.errors.city) : undefined}
              autoComplete="address-level2"
            />

            <Select
              name="state"
              label={t('state')}
              placeholder="CHOOSE_STATE"
              options={responsiveStateList}
              value={form.values.state || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
              error={
                form.touched.state && form.errors.state ? String(form.errors.state) : undefined
              }
            />
          </div>

          {/* ZIP Code - Constrained width */}
          <div className={styles.constrainedWidth}>
            <Input
              name="zip_code"
              label={t('zip_code')}
              placeholder={t('zip_code')}
              type="number"
              value={form.values.zip_code || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
              error={
                form.touched.zip_code && form.errors.zip_code
                  ? String(form.errors.zip_code)
                  : undefined
              }
              autoComplete="postal-code"
              helperText="5-digit ZIP code"
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
