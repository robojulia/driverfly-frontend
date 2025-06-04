import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { BackgroundInfoDto } from '../../../../models/jot-form/long-form/background-info.dto';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { Input, Select } from '../../../shared/dha';
import stateList from '../../../../utils/stateList';

export function BackgroundInfo() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(false);

  const form = useFormik({
    initialValues: new BackgroundInfoDto(),
    validationSchema: BackgroundInfoDto.yupSchema(),
    onSubmit: (values) => {
      try {
        const { birthdate, city, state, zip_code, address_1, address_2 } = values;
        setApplicant({
          ...applicant,
          birthdate,
          city,
          state,
          zip_code,
          address_1,
          address_2,
        });
      } catch (error) {
        console.log(error);
      }
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
      ...form.values,
      address_1: address_1 || null,
      address_2: address_2 || null,
      birthdate: birthdate || null,
      city: city || null,
      state: state || null,
      zip_code: zip_code || null,
    });
  }, [applicant]);

  const today = new Date();
  const OldThan18Year = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];

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
        <p style={{ margin: 0 }}>{t('BACKGROUND_INFO_HELP_TEXT')}</p>
      </div>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.formStep}>
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <Input
              name="birthdate"
              label={t('birthdate')}
              placeholder={t('birthdate')}
              type="date"
              value={form.values.birthdate || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
              error={
                form.touched.birthdate && form.errors.birthdate
                  ? String(form.errors.birthdate)
                  : undefined
              }
              helperText="You must be at least 18 years old"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3
              style={{
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#1a2b3c',
                fontSize: '1.1rem',
              }}
            >
              {t('FULL_ADDRESS_QUES')}
            </h3>
          </div>

          {/* Address Line 1 - Full width */}
          <div style={{ marginBottom: '1.5rem' }}>
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
          <div style={{ marginBottom: '1.5rem' }}>
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
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
              options={stateList}
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
          <div
            style={{
              maxWidth: '300px',
              marginBottom: '1.5rem',
            }}
          >
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
