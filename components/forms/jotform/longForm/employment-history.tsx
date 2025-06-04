import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantEmployerEntity } from '../../../../models/applicant';
import { CurrentEmploymentHistoryPageDto } from '../../../../models/jot-form/long-form/current-employment-history-page.dto';
import { CurrentEmploymentHistoryDto } from '../../../../models/jot-form/long-form/current-emplyment-history/index.dto';
import { Input, Checkbox, RadioGroup, DhaPhoneInput, Select } from '../../../shared/dha';
import stateList from '../../../../utils/stateList';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { FormActions } from '../form-buttons';

export function EmploymentHistory() {
  const {
    state: { applicant, steps },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(false);

  const form = useFormik({
    initialValues: new CurrentEmploymentHistoryPageDto(),
    validationSchema: CurrentEmploymentHistoryPageDto.yupSchema(),
    onSubmit: (values) => {
      const { employer, is_current_employed } = values;

      const employers: ApplicantEmployerEntity[] = applicant?.employers?.filter(
        (v) => !!!v?.is_current
      );

      if (!!is_current_employed) employers.push(employer);

      setApplicant({
        ...applicant,
        employers,
      });
      stepNext();
      return;
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
    const hasNoErrors = Object.keys(form.errors).length === 0;

    if (form.values.is_current_employed) {
      console.log(form.values);
      // If currently employed, all required fields must be filled
      const requiredFieldsFilled = !!(
        form.values.employer?.can_contact &&
        form.values.employer?.name &&
        form.values.employer?.title &&
        form.values.employer?.start_at &&
        form.values.employer?.manager_name &&
        form.values.employer?.email &&
        form.values.employer?.address &&
        form.values.employer?.zip_code &&
        form.values.employer?.city &&
        form.values.employer?.state
      );
      setIsFormValid(hasNoErrors && requiredFieldsFilled);
    } else {
      // If not currently employed, form is valid if employment status is explicitly set to false
      setIsFormValid(hasNoErrors && form.values.is_current_employed === false);
    }
  }, [form.values, form.errors]);

  useEffect(() => {
    const employer: CurrentEmploymentHistoryDto = applicant.employers?.find(
      (v) => !!v?.is_current
    ) as CurrentEmploymentHistoryDto;

    form.setValues({
      ...form.values,
      employer: {
        ...employer,
        is_subject_to_fmcsrs: Boolean(employer) ? employer?.is_subject_to_fmcsrs : true,
        is_subject_to_drug_tests: Boolean(employer) ? employer?.is_subject_to_drug_tests : true,
        is_current: true,
      },
      is_current_employed: Boolean(employer),
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

  const getMaxDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const employmentStatusOptions = [
    { value: BooleanType.YES, label: 'YES' },
    { value: BooleanType.NO, label: 'NO' },
  ];

  const notCurrentEmployedValue =
    form.values.is_current_employed === false ? BooleanType.NO : undefined;

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('EMPLOYMENT_HISTORY')}
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
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#1a2b3c' }}>
          📋 {t('EMPLOYMENT_HISTORY_REQUIREMENTS')}
        </p>
        <p style={{ margin: '0 0 1rem 0' }}>
          {t(
            'EMPLOYMENT_HISTORY_NOTE_{number}',
            { number: applicant?.years_cdl_experience > 3 ? 10 : 3 },
            { translateProps: true }
          )}
        </p>
        <p style={{ margin: 0 }}>{t('HONEST_ABOUT_PAST_EMP')}</p>
      </div>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.formStep}>
        <div style={{ maxWidth: '100%', margin: '0', padding: '0 1rem' }}>
          {/* Employment Status Question */}
          <div style={{ marginBottom: '2rem' }}>
            <RadioGroup
              name="is_current_employed"
              label={t('CURRENTLY_EMPLYED_QUESTION')}
              options={employmentStatusOptions}
              value={
                form.values.is_current_employed === true ? BooleanType.YES : notCurrentEmployedValue
              }
              onChange={(value) => {
                form.setFieldValue(
                  'is_current_employed',
                  value === BooleanType.YES ? true : value === BooleanType.NO ? false : undefined
                );
              }}
              required
              error={
                form.touched.is_current_employed && form.errors.is_current_employed
                  ? String(form.errors.is_current_employed)
                  : undefined
              }
              variant="card"
              columns={2}
              labelPrefix="BooleanType"
            />
            <p style={{ marginTop: '1rem' }}>{t('CURRENT_EMPLOYED_NEXT_FORM')}</p>
          </div>

          {/* Current Employment Details */}
          {form.values.is_current_employed && (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #e0e5eb',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #e0e5eb',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#1a2b3c',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>🏢</span>
                    {t('CURRENT_EMPLOYER')}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: '#667788',
                      margin: '0.25rem 0 0 0',
                    }}
                  >
                    {t('NA')}
                  </p>
                </div>
              </div>

              {/* Contact Authorization */}
              <div style={{ marginBottom: '1.5rem' }}>
                <Checkbox
                  name="employer.can_contact"
                  label={t('CONATACT_AUTHORITY')}
                  checked={Boolean(form.values.employer?.can_contact)}
                  onChange={(e) => {
                    form.setFieldValue('employer.can_contact', e.target.checked);
                  }}
                  onBlur={form.handleBlur}
                  required
                  error={
                    form.touched.employer?.can_contact && form.errors.employer?.can_contact
                      ? String(form.errors.employer?.can_contact)
                      : undefined
                  }
                />
              </div>

              {/* Company Name and Position - Side by side on larger screens */}
              <div
                className="employment-form-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <Input
                  name="employer.name"
                  label={t('CURRENT_COMPANY_NAME')}
                  placeholder={t('CURRENT_COMPANY_NAME')}
                  value={form.values.employer?.name || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  required
                  error={
                    form.touched.employer?.name && form.errors.employer?.name
                      ? String(form.errors.employer?.name)
                      : undefined
                  }
                  autoComplete="organization"
                />

                <Input
                  name="employer.title"
                  label={t('CURRENT_COMPANY_POSITION')}
                  placeholder={t('CURRENT_COMPANY_POSITION')}
                  value={form.values.employer?.title || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  required
                  error={
                    form.touched.employer?.title && form.errors.employer?.title
                      ? String(form.errors.employer?.title)
                      : undefined
                  }
                  autoComplete="organization-title"
                />
              </div>

              {/* Start Date and Phone */}
              <div
                className="employment-form-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <Input
                  name="employer.start_at"
                  label={t('START_DATE')}
                  type="date"
                  value={form.values.employer?.start_at || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  required
                  max={getMaxDate()}
                  error={
                    form.touched.employer?.start_at && form.errors.employer?.start_at
                      ? String(form.errors.employer?.start_at)
                      : undefined
                  }
                  helperText={t('EMPLOYMENT_HISTORY_DATE_NOTE')}
                />

                <DhaPhoneInput
                  name="employer.phone"
                  label={t('CURRENT_COMPANY_NUMBER')}
                  placeholder="Phone Number"
                  value={form.values.employer?.phone || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  autoComplete="tel"
                  helperText="Company contact number"
                />
              </div>

              {/* Manager Name and Email */}
              <div
                className="employment-form-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <Input
                  name="employer.manager_name"
                  label={t('MANAGER_OR_REPRESENTATIVE')}
                  placeholder={t('MANAGER_OR_REPRESENTATIVE')}
                  value={form.values.employer?.manager_name || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  required
                  error={
                    form.touched.employer?.manager_name && form.errors.employer?.manager_name
                      ? String(form.errors.employer?.manager_name)
                      : undefined
                  }
                  autoComplete="name"
                />

                <Input
                  name="employer.email"
                  label={t('CURRENT_COMPANY_EMAIL')}
                  type="email"
                  placeholder="Email Address"
                  value={form.values.employer?.email || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  required
                  error={
                    form.touched.employer?.email && form.errors.employer?.email
                      ? String(form.errors.employer?.email)
                      : undefined
                  }
                  autoComplete="email"
                />
              </div>

              {/* Address Fields */}
              <div
                className="employment-form-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <Input
                  name="employer.address"
                  label={t('ADDRESS_LINE_1')}
                  placeholder={t('ADDRESS_LINE_1')}
                  value={form.values.employer?.address || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  required
                  error={
                    form.touched.employer?.address && form.errors.employer?.address
                      ? String(form.errors.employer?.address)
                      : undefined
                  }
                  autoComplete="address-line1"
                />

                <Input
                  name="employer.address_2"
                  label={t('ADDRESS_LINE_2')}
                  placeholder={t('ADDRESS_LINE_2')}
                  value={form.values.employer?.address_2 || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  autoComplete="address-line2"
                />
              </div>

              {/* Zip, City, and State */}
              <div
                className="employment-form-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <Input
                  name="employer.zip_code"
                  label={t('zip_code')}
                  placeholder="Zip Code"
                  value={form.values.employer?.zip_code || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  required
                  error={
                    form.touched.employer?.zip_code && form.errors.employer?.zip_code
                      ? String(form.errors.employer?.zip_code)
                      : undefined
                  }
                  autoComplete="postal-code"
                />

                <Input
                  name="employer.city"
                  label={t('City')}
                  placeholder="City"
                  value={form.values.employer?.city || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  required
                  error={
                    form.touched.employer?.city && form.errors.employer?.city
                      ? String(form.errors.employer?.city)
                      : undefined
                  }
                  autoComplete="address-level2"
                />

                <div style={{ position: 'relative' }}>
                  <Select
                    name="employer.state"
                    label={t('STATE')}
                    placeholder="STATE"
                    value={form.values.employer?.state || ''}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    required
                    error={
                      form.touched.employer?.state && form.errors.employer?.state
                        ? String(form.errors.employer?.state)
                        : undefined
                    }
                    options={stateList}
                  />
                </div>
              </div>

              {/* Compliance Checkboxes */}
              <div
                className="employment-form-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <Checkbox
                  name="employer.is_subject_to_fmcsrs"
                  label={t('FMCR_QUESTION')}
                  checked={Boolean(form.values.employer?.is_subject_to_fmcsrs)}
                  onChange={(e) => {
                    form.setFieldValue('employer.is_subject_to_fmcsrs', e.target.checked);
                  }}
                  onBlur={form.handleBlur}
                />

                <Checkbox
                  name="employer.is_subject_to_drug_tests"
                  label={t('JOB_DESIGNATED_CURRENT_COMPANY')}
                  checked={Boolean(form.values.employer?.is_subject_to_drug_tests)}
                  onChange={(e) => {
                    form.setFieldValue('employer.is_subject_to_drug_tests', e.target.checked);
                  }}
                  onBlur={form.handleBlur}
                />
              </div>
            </div>
          )}
        </div>

        <FormActions
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={form.isSubmitting}
          isValid={isFormValid}
          showBackButton={!!steps}
          nextButtonText={t('NEXT')}
          backButtonText={t('BACK')}
        />
      </Form>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .employment-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
