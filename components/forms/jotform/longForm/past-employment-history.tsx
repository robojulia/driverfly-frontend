import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { DashCircle, PlusCircle } from 'react-bootstrap-icons';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantEmployerEntity } from '../../../../models/applicant';
import { PastEmploymentHistoryDto } from '../../../../models/jot-form/long-form/past-employment-history/index.dto';
import { PastEmploymentPageDto } from '../../../../models/jot-form/long-form/past-employment-page.dto';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { Input, Checkbox, RadioGroup, DhaPhoneInput, Select, Button } from '../../../shared/dha';
import stateList from '../../../../utils/stateList';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { FormActions } from '../form-buttons';

export function PastEmploymentHistory() {
  const {
    state: { applicant, steps },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(false);

  function updateApplicat({
    employers: past_employers,
    is_previous_employed,
  }: PastEmploymentPageDto) {
    const all_employers: ApplicantEmployerEntity[] = is_previous_employed ? past_employers : [];
    const current_employer: ApplicantEmployerEntity = applicant?.employers?.find(
      (v) => !!v.is_current
    );
    if (current_employer) all_employers.push(current_employer);

    setApplicant({
      ...applicant,
      employers: all_employers,
    });
  }

  const form = useFormik({
    initialValues: new PastEmploymentPageDto(),
    validationSchema: PastEmploymentPageDto.yupSchema(),
    onSubmit: (values: PastEmploymentPageDto) => {
      updateApplicat(values);
      stepNext();
    },
    onReset: (values: PastEmploymentPageDto) => {
      updateApplicat(values);
      stepBack();
    },
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Check if form is valid
  useEffect(() => {
    const hasNoErrors = Object.keys(form.errors).length === 0;

    if (form.values.is_previous_employed) {
      // If previously employed, must have at least one employer with all required fields
      const hasValidEmployers =
        form.values.employers?.length > 0 &&
        form.values.employers.every(
          (employer) =>
            employer.can_contact !== null &&
            employer.can_contact !== undefined &&
            employer.name &&
            employer.title &&
            employer.manager_name &&
            employer.email &&
            employer.start_at &&
            employer.end_at &&
            employer.address &&
            employer.zip_code &&
            employer.city &&
            employer.state
        );
      setIsFormValid(hasNoErrors && hasValidEmployers);
    } else {
      // If not previously employed, form is valid if employment status is explicitly set to false
      setIsFormValid(hasNoErrors && form.values.is_previous_employed === false);
    }
  }, [form.values, form.errors]);

  useEffect(() => {
    const employers: PastEmploymentHistoryDto[] = applicant.employers?.filter(
      (v) => !!!v.is_current
    ) as PastEmploymentHistoryDto[];

    // Ensure can_contact is properly initialized for existing employers
    const normalizedEmployers =
      employers?.map((emp) => ({
        ...emp,
        can_contact: emp.can_contact !== undefined ? emp.can_contact : null,
      })) || [];

    form.setValues({
      ...form.values,
      employers: normalizedEmployers,
      is_previous_employed: !!employers?.length,
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

  const addEmployer = () => {
    form.setFieldValue('employers', [
      ...(form.values?.employers || []),
      {
        ...new PastEmploymentHistoryDto(),
        is_subject_to_fmcsrs: true,
        is_subject_to_drug_tests: true,
        is_current: false,
        can_contact: null,
      },
    ]);
  };

  const removeEmployer = (index: number) => {
    form.setValues({
      ...form.values,
      employers: form.values?.employers?.filter((v, idx) => index !== idx),
    });
  };

  // Helper function to safely get nested form errors
  const getFieldError = (fieldPath: string): string | undefined => {
    const pathParts = fieldPath.split('.');
    let error: any = form.errors;
    let touched: any = form.touched;

    for (const part of pathParts) {
      if (part.includes('[') && part.includes(']')) {
        const [field, indexStr] = part.split('[');
        const index = parseInt(indexStr.replace(']', ''));
        error = error?.[field]?.[index];
        touched = touched?.[field]?.[index];
      } else {
        error = error?.[part];
        touched = touched?.[part];
      }
    }

    return touched && error ? String(error) : undefined;
  };

  const notPreviouslyEmployedValue =
    form.values.is_previous_employed === false ? BooleanType.NO : undefined;

  // Helper functions for contact authorization radio groups
  const getCanContactValue = (index: number) => {
    if (form.values.employers?.[index]?.can_contact === true) return BooleanType.YES;
    if (form.values.employers?.[index]?.can_contact === false) return BooleanType.NO;
    return undefined;
  };

  const handleCanContactChange = (index: number, value: string) => {
    const canContact = value === BooleanType.YES;
    form.setFieldValue(`employers[${index}].can_contact`, canContact);
    form.setFieldTouched(`employers[${index}].can_contact`, true);

    // Force validation to run immediately
    setTimeout(() => {
      form.validateForm();
    }, 0);
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('PAST_EMPLOYMENT_HISTORY')}
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
          📋 {t('PAST_EMPLOYMENT_REQUIREMENTS')}
        </p>
        <p style={{ margin: '0 0 1rem 0' }}>{t('HONEST_ABOUT_PAST_EMPLOYMENT')}</p>
      </div>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.formStep}>
        <div style={{ maxWidth: '100%', margin: '0', padding: '0 1rem' }}>
          {/* Previous Employment Question */}
          <div style={{ marginBottom: '2rem' }}>
            <RadioGroup
              name="is_previous_employed"
              label={t('PREVIOUSLY_EMPLOYED')}
              options={employmentStatusOptions}
              value={
                form.values.is_previous_employed === true
                  ? BooleanType.YES
                  : notPreviouslyEmployedValue
              }
              onChange={(value) => {
                form.setFieldValue(
                  'is_previous_employed',
                  value === BooleanType.YES ? true : value === BooleanType.NO ? false : undefined
                );
              }}
              required
              error={
                form.touched.is_previous_employed && form.errors.is_previous_employed
                  ? String(form.errors.is_previous_employed)
                  : undefined
              }
              variant="card"
              columns={2}
              labelPrefix="BooleanType"
            />
          </div>

          {/* Past Employment Details */}
          {form.values.is_previous_employed && (
            <>
              {form.values.employers?.map((entity, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #e0e5eb',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
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
                        {t('PAST_EMPLOYER')} #{i + 1}
                      </h3>
                    </div>
                    {form.values.employers?.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<DashCircle />}
                        onClick={() => removeEmployer(i)}
                      >
                        {t('REMOVE')}
                      </Button>
                    )}
                  </div>

                  {/* Contact Authorization */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <RadioGroup
                      name={`employers[${i}].can_contact`}
                      label={t('CONTACT_AUTHORIZATION')}
                      enumType={BooleanType}
                      value={getCanContactValue(i)}
                      onChange={(value) => handleCanContactChange(i, value)}
                      required
                      error={getFieldError(`employers[${i}].can_contact`)}
                      variant="card"
                      columns={2}
                      labelPrefix="BooleanType"
                      helperText="We need permission to contact this employer for verification"
                    />
                  </div>

                  {/* Company Name and Position */}
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
                      name={`employers[${i}].name`}
                      label={t('PREVIOUS_COMPANY_NAME')}
                      placeholder={t('PREVIOUS_COMPANY_NAME')}
                      value={form.values.employers?.[i]?.name || ''}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      required
                      error={getFieldError(`employers[${i}].name`)}
                      autoComplete="organization"
                    />

                    <Input
                      name={`employers[${i}].title`}
                      label={t('PREVIOUS_COMPANY_TITLE')}
                      placeholder={t('PREVIOUS_COMPANY_TITLE')}
                      value={form.values.employers?.[i]?.title || ''}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      required
                      error={getFieldError(`employers[${i}].title`)}
                      autoComplete="organization-title"
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
                      name={`employers[${i}].manager_name`}
                      label={t('PREVIOUS_MANAGER_NAME')}
                      placeholder={t('PREVIOUS_MANAGER_NAME')}
                      value={form.values.employers?.[i]?.manager_name || ''}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      required
                      error={getFieldError(`employers[${i}].manager_name`)}
                      autoComplete="name"
                    />

                    <Input
                      name={`employers[${i}].email`}
                      label={t('PREVIOUS_COMPANY_EMAIL')}
                      type="email"
                      placeholder="Email Address"
                      value={form.values.employers?.[i]?.email || ''}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      required
                      error={getFieldError(`employers[${i}].email`)}
                      autoComplete="email"
                    />
                  </div>

                  {/* Phone and Employment Dates */}
                  <div
                    className="employment-form-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <DhaPhoneInput
                      name={`employers[${i}].phone`}
                      label={t('PREVIOUS_COMPANY_PHONE_NUMBER')}
                      placeholder="Phone Number"
                      value={form.values.employers?.[i]?.phone || ''}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      autoComplete="tel"
                      helperText="Company contact number"
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <Input
                        name={`employers[${i}].start_at`}
                        label={t('START_DATE')}
                        type="date"
                        value={form.values.employers?.[i]?.start_at || ''}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        required
                        max={getMaxDate()}
                        error={getFieldError(`employers[${i}].start_at`)}
                        helperText={t('EMPLOYMENT_HISTORY_DATE_NOTE')}
                      />
                    </div>
                  </div>

                  {/* End Date - Full width */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <Input
                      name={`employers[${i}].end_at`}
                      label={t('END_DATE')}
                      type="date"
                      value={form.values.employers?.[i]?.end_at || ''}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      required
                      max={getMaxDate()}
                      error={getFieldError(`employers[${i}].end_at`)}
                      helperText="Last day of employment"
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
                      name={`employers[${i}].address`}
                      label={t('ADDRESS_LINE_1')}
                      placeholder={t('ADDRESS_LINE_1')}
                      value={form.values.employers?.[i]?.address || ''}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      required
                      error={getFieldError(`employers[${i}].address`)}
                      autoComplete="address-line1"
                    />

                    <Input
                      name={`employers[${i}].address_2`}
                      label={t('ADDRESS_LINE_2')}
                      placeholder={t('ADDRESS_LINE_2')}
                      value={form.values.employers?.[i]?.address_2 || ''}
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
                      name={`employers[${i}].zip_code`}
                      label={t('zip_code')}
                      placeholder="Zip Code"
                      value={form.values.employers?.[i]?.zip_code || ''}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      required
                      error={getFieldError(`employers[${i}].zip_code`)}
                      autoComplete="postal-code"
                    />

                    <Input
                      name={`employers[${i}].city`}
                      label={t('City')}
                      placeholder="City"
                      value={form.values.employers?.[i]?.city || ''}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      required
                      error={getFieldError(`employers[${i}].city`)}
                      autoComplete="address-level2"
                    />

                    <Select
                      name={`employers[${i}].state`}
                      label={t('STATE')}
                      placeholder="STATE"
                      value={form.values.employers?.[i]?.state || ''}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      required
                      error={getFieldError(`employers[${i}].state`)}
                      options={stateList}
                    />
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
                      name={`employers[${i}].is_subject_to_fmcsrs`}
                      label={t('FMCR_QUESTION')}
                      checked={Boolean(form.values.employers?.[i]?.is_subject_to_fmcsrs)}
                      onChange={(e) => {
                        form.setFieldValue(
                          `employers[${i}].is_subject_to_fmcsrs`,
                          e.target.checked
                        );
                      }}
                      onBlur={form.handleBlur}
                    />

                    <Checkbox
                      name={`employers[${i}].is_subject_to_drug_tests`}
                      label={t('JOB_DESIGNATED_CURRENT_COMPANY')}
                      checked={Boolean(form.values.employers?.[i]?.is_subject_to_drug_tests)}
                      onChange={(e) => {
                        form.setFieldValue(
                          `employers[${i}].is_subject_to_drug_tests`,
                          e.target.checked
                        );
                      }}
                      onBlur={form.handleBlur}
                    />
                  </div>
                </div>
              ))}

              {/* Add Employer Button */}
              {form.values.employers?.length < 12 && (
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                  <Button
                    variant="outline"
                    size="lg"
                    icon={<PlusCircle />}
                    onClick={addEmployer}
                    fullWidth
                  >
                    {t('ADD_PAST_EMPLOYMENT_HISTORY')}
                  </Button>
                </div>
              )}

              {/* Employment Gap Details */}
              <div style={{ marginBottom: '2rem' }}>
                <Input
                  name="employment_gap_details"
                  label={t('EMPLOYMENT_GAP_DETAILS_LABEL')}
                  placeholder="Describe any gaps in employment..."
                  value={form.values.employment_gap_details || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  helperText="Explain any periods of unemployment between jobs"
                />
              </div>
            </>
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
