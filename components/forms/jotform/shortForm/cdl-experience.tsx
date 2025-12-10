import { useFormik } from 'formik';
import { useTranslation } from '../../../../hooks/use-translation';
import { Form, Row } from 'react-bootstrap';
import BaseSelect from '../../base-select';
import { DriverLicenseType } from '../../../../enums/users/driver-license-type.enum';
import { CdlDto } from '../../../../models/jot-form/short-form/cdl-experience.dto';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useContext, useEffect } from 'react';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { Input } from '../../../shared/dha';

export function CdlExperience() {
  const {
    state: { applicant, applicantExtras },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: new CdlDto(),
    validationSchema: CdlDto.yupSchema(),
    onSubmit: (values) => {
      const { license_type, years_cdl_experience } = values;

      setApplicant({
        ...applicant,
        license_type,
        years_cdl_experience,
      });

      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    const { license_type, years_cdl_experience } = applicant;

    // Set individual field values and reset form state to clear any validation errors
    form.setFieldValue('license_type', license_type || null, false);
    form.setFieldValue('years_cdl_experience', years_cdl_experience || null, false);
    form.setTouched({}, false);
    form.setErrors({});

    // Validate form after initial value set with a small delay to ensure state is updated
    setTimeout(() => {
      form.validateForm();
    }, 0);
  }, [applicant, applicantExtras]);

  function onLicenseTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const licenseType = e.target.value;
    form.setFieldValue('license_type', licenseType);
  }

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

  const getExperienceLabel = () => {
    return form.values.license_type !== DriverLicenseType.NO_CDL
      ? t('years_cdl_experience')
      : t('years__driving_experience');
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('cdl_experince')}
      </h1>

      <Form
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
        className={`${styles.align__text_left} ${styles.formStep}`}
      >
        <div style={{ maxWidth: '600px', margin: '0' }}>
          <Row className={`${styles.bold} my-3`}>
            <BaseSelect
              className="col-12"
              label="TYPE_CDL_CLASS"
              placeholder="SELECT_ONE_PLACEHOLDER"
              name="license_type"
              required
              labelPrefix="DriverLicenseType"
              enumType={DriverLicenseType}
              formik={form}
              onChange={onLicenseTypeChange}
            />
          </Row>

          {!!form.values.license_type && (
            <div className="my-3">
              <Input
                name="years_cdl_experience"
                type="number"
                label={getExperienceLabel()}
                placeholder={t('PLACEHOLDER_FOR_DIGITS')}
                value={form.values.years_cdl_experience?.toString() || ''}
                onChange={(e) => {
                  let value = parseFloat(e.target.value) || 0;
                  value = Math.min(Math.max(value, 0), 99); // Cap at 99
                  form.setFieldValue('years_cdl_experience', value);
                }}
                onBlur={form.handleBlur}
                required
                min="0"
                max="99"
                error={
                  form.touched.years_cdl_experience && form.errors.years_cdl_experience
                    ? String(form.errors.years_cdl_experience)
                    : undefined
                }
                icon={<span>🚛</span>}
                helperText="Enter your years of experience (e.g., 2.5 for 2 years and 6 months)"
              />
            </div>
          )}
        </div>

        <FormActions
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={form.isSubmitting}
          isValid={form.isValid && !form.isValidating && Object.keys(form.errors).length === 0}
          nextButtonText={t('NEXT')}
          backButtonText={t('BACK')}
        />
      </Form>
    </>
  );
}
