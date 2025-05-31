import { useFormik } from 'formik';
import { useTranslation } from '../../../../hooks/use-translation';
import { Form, Row } from 'react-bootstrap';
import BaseSelect from '../../base-select';
import { DriverLicenseType } from '../../../../enums/users/driver-license-type.enum';
import { CdlDto } from '../../../../models/jot-form/short-form/cdl-experience.dto';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useContext, useEffect } from 'react';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { ApplicantExtras } from '../../../../enums/applicants/applicant-extras.enum';
import { ApplicantExtrasEntity } from '../../../../models/applicant';
import BaseRadio from '../../base-radio';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { FormActions } from '../form-buttons';
import { Input } from '../../../shared/dha';

export function CdlExperience() {
  const {
    state: { applicant, applicantExtras },
    method: { setApplicant, stepNext, stepBack, setApplicantExtras, updateApplicantExtras },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: new CdlDto(),
    validationSchema: CdlDto.yupSchema(),
    onSubmit: (values) => {
      const { license_type, years_cdl_experience, is_owner_operator, BUSINESS_NAME, DOT_NUMBER } =
        values;

      setApplicant({
        ...applicant,
        license_type,
        years_cdl_experience,
        is_owner_operator,
      });
      updateApplicantExtras(BUSINESS_NAME);
      updateApplicantExtras(DOT_NUMBER);
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    const { license_type, years_cdl_experience, is_owner_operator } = applicant;

    const apx_business_name = applicantExtras?.find((v) => v.type == ApplicantExtras.BUSINESS_NAME);
    const apx_dot_number = applicantExtras?.find((v) => v.type == ApplicantExtras.DOT_NUMBER);

    form.setValues({
      license_type: license_type || null,
      years_cdl_experience: years_cdl_experience || 0,
      is_owner_operator: is_owner_operator || null,
      BUSINESS_NAME: !!apx_business_name?.type
        ? apx_business_name
        : new ApplicantExtrasEntity(ApplicantExtras.BUSINESS_NAME),
      DOT_NUMBER: !!apx_dot_number?.type
        ? apx_dot_number
        : new ApplicantExtrasEntity(ApplicantExtras.DOT_NUMBER),
    });

    // Validate form after initial value set
    form.validateForm();
  }, []);

  function onLicenseTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const licenseType = e.target.value;
    switch (licenseType) {
      case DriverLicenseType.CDL_CLASS_C:
        form.setValues(
          {
            ...form.values,
            license_type: licenseType,
            is_owner_operator: false,
          },
          true
        );
        break;
      case null:
        form.setValues(
          {
            ...form.values,
            license_type: licenseType,
            is_owner_operator: false,
            years_cdl_experience: null,
          },
          true
        );
        break;
      default:
        form.setValues(
          {
            ...form.values,
            license_type: licenseType,
          },
          true
        );
        break;
    }
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

  const shouldShowOwnerOperatorQuestion = () => {
    return (
      form.values.license_type &&
      form.values.license_type !== DriverLicenseType.NO_CDL &&
      form.values.license_type !== DriverLicenseType.CDL_CLASS_C
    );
  };

  const shouldShowBusinessFields = () => {
    return Boolean(form.values.is_owner_operator);
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
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
                  const value = parseFloat(e.target.value) || 0;
                  form.setFieldValue('years_cdl_experience', value);
                }}
                onBlur={form.handleBlur}
                required
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

          {shouldShowOwnerOperatorQuestion() && (
            <div className="my-4">
              <BaseRadio
                name={`is_owner_operator`}
                className="my-2"
                label={`is_owner_operator_question`}
                labelPrefix="BooleanType"
                enumType={BooleanType}
                required
                value={
                  form.values.is_owner_operator === true
                    ? BooleanType.YES
                    : form.values.is_owner_operator === false && BooleanType.NO
                }
                onChange={({ target: { value } }) => {
                  form.setFieldValue(
                    'is_owner_operator',
                    value === BooleanType.YES ? true : value === BooleanType.NO && false
                  );
                }}
              />
              {form.touched.is_owner_operator && form.errors.is_owner_operator && (
                <div className="invalid-feedback d-block">{form.errors.is_owner_operator}</div>
              )}
            </div>
          )}

          {shouldShowBusinessFields() && (
            <div className="mt-4" style={{ clear: 'both' }}>
              <div className="my-3">
                <Input
                  name="BUSINESS_NAME.value"
                  label={t('BUSINESS_NAME')}
                  placeholder={t('BUSINESS_NAME')}
                  value={form.values.BUSINESS_NAME?.value || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={
                    form.touched.BUSINESS_NAME?.value && form.errors.BUSINESS_NAME?.value
                      ? String(form.errors.BUSINESS_NAME.value)
                      : undefined
                  }
                  icon={<span>🏢</span>}
                  helperText="Enter your business or company name"
                />
              </div>

              <div className="my-3">
                <Input
                  name="DOT_NUMBER.value"
                  label={t('DOT_NUMBER')}
                  placeholder={t('DOT_NUMBER')}
                  value={form.values.DOT_NUMBER?.value || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={
                    form.touched.DOT_NUMBER?.value && form.errors.DOT_NUMBER?.value
                      ? String(form.errors.DOT_NUMBER.value)
                      : undefined
                  }
                  icon={<span>🔢</span>}
                  helperText="Enter your DOT number (Department of Transportation)"
                />
              </div>
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
