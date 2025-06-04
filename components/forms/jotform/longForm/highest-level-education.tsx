import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { EducationLevel } from '../../../../enums/users/education-level.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { HighestLevelEducationDto } from '../../../../models/jot-form/long-form/highest-level-education.dto';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { Select } from '../../../shared/dha';

export function HighestLevelEducation() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(false);

  // Convert enum to options array
  const educationOptions = Object.entries(EducationLevel).map(([key, value]) => ({
    value: value,
    label: t(`EducationLevel.${value}`),
  }));

  const form = useFormik({
    initialValues: new HighestLevelEducationDto(),
    validationSchema: HighestLevelEducationDto.yupSchema(),
    onSubmit: (values) => {
      const { highest_degree } = values;
      try {
        setApplicant({
          ...applicant,
          highest_degree,
        });
        stepNext();
      } catch (error) {
        console.log(error);
      }
    },
    onReset: (values) => {
      stepBack();
    },
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Check if form is valid
  useEffect(() => {
    const hasRequiredFields = !!form.values.highest_degree;
    const hasNoErrors = Object.keys(form.errors).length === 0;
    setIsFormValid(hasRequiredFields && hasNoErrors && form.dirty);
  }, [form.values, form.errors, form.dirty]);

  useEffect(() => {
    const { highest_degree } = applicant;
    form.setValues({
      ...form.values,
      highest_degree: highest_degree || null,
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
        {t('TELL_ABOUT_YOUR_EDUCATION')}
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
        <p style={{ margin: 0 }}>Please select your highest level of education completed.</p>
      </div>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.formStep}>
        <div style={{ maxWidth: '100%', margin: '0', padding: '0 1rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <Select
              name="highest_degree"
              label={t('EDUCATION_HIGHEST_LEVEL')}
              placeholder={t('CHOOSE')}
              options={educationOptions}
              value={form.values.highest_degree || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
              error={
                form.touched.highest_degree && form.errors.highest_degree
                  ? String(form.errors.highest_degree)
                  : undefined
              }
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
