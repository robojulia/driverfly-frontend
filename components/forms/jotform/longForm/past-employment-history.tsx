import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form, Button as BootstrapButton } from 'react-bootstrap';
import { DashCircle, PlusCircle, Search } from 'react-bootstrap-icons';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantEmployerEntity } from '../../../../models/applicant';
import { PastEmploymentHistoryDto } from '../../../../models/jot-form/long-form/past-employment-history/index.dto';
import { PastEmploymentPageDto } from '../../../../models/jot-form/long-form/past-employment-page.dto';
import styles from '../../../../styles/digitalhiringapp.module.css';
import {
  Input,
  Checkbox,
  RadioGroup,
  DhaPhoneInput,
  Select,
  Button,
  TextArea,
} from '../../../shared/dha';
import stateList from '../../../../utils/stateList';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { FormActions } from '../form-buttons';
import CompanyLookupModal from '../../../modals/company-lookup-modal';

export function PastEmploymentHistory() {
  const {
    state: { applicant, steps },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(false);
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [lookupEmployerIndex, setLookupEmployerIndex] = useState<number | null>(null);

  function updateApplicat({
    employers: past_employers,
    is_previous_employed,
    employment_gap_details,
  }: PastEmploymentPageDto) {
    const all_employers: ApplicantEmployerEntity[] = is_previous_employed ? past_employers : [];
    const current_employer: ApplicantEmployerEntity = applicant?.employers?.find(
      (v) => !!v.is_current
    );
    if (current_employer) all_employers.push(current_employer);

    setApplicant({
      ...applicant,
      employers: all_employers,
      employment_gap_details,
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
            employer.start_at &&
            employer.end_at
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

    // Ensure can_contact and title are properly initialized for existing employers
    const normalizedEmployers =
      employers?.map((emp) => ({
        ...emp,
        title: emp.title || 'Driver',
        can_contact: emp.can_contact !== undefined ? emp.can_contact : null,
      })) || [];

    form.setValues({
      ...form.values,
      employers: normalizedEmployers,
      is_previous_employed: null,
      employment_gap_details: applicant.employment_gap_details || '',
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

  const getMinDate = () => {
    return '1970-01-01';
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
        title: 'Driver',
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

  const handleOpenLookup = (index: number) => {
    setLookupEmployerIndex(index);
    setShowLookupModal(true);
  };

  const handleSelectCompany = (company: any) => {
    if (lookupEmployerIndex === null) return;

    const address = company.phy_street || '';
    const city = company.phy_city || '';
    const state = company.phy_state || '';
    const zipCode = company.phy_zip || '';
    const phone = company.phone || '';
    const email = company.email_address || '';

    form.setFieldValue(`employers[${lookupEmployerIndex}].name`, company.legal_name || company.dba_name || '');
    if (address) form.setFieldValue(`employers[${lookupEmployerIndex}].address`, address);
    if (city) form.setFieldValue(`employers[${lookupEmployerIndex}].city`, city);
    if (state) form.setFieldValue(`employers[${lookupEmployerIndex}].state`, state);
    if (zipCode) form.setFieldValue(`employers[${lookupEmployerIndex}].zip_code`, zipCode);
    if (phone) form.setFieldValue(`employers[${lookupEmployerIndex}].phone`, phone);
    if (email) form.setFieldValue(`employers[${lookupEmployerIndex}].email`, email);
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
                    <div>
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
                      <BootstrapButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleOpenLookup(i)}
                        disabled={!form.values.employers?.[i]?.name?.trim()}
                        className="company-lookup-btn"
                        style={{ marginTop: '0.5rem', width: '100%' }}
                      >
                        <Search style={{ marginRight: '0.5rem' }} />
                        Lookup Company
                      </BootstrapButton>
                    </div>

                    <Input
                      name={`employers[${i}].title`}
                      label={t('PREVIOUS_COMPANY_ROLE')}
                      placeholder={t('PREVIOUS_COMPANY_ROLE')}
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
                      error={getFieldError(`employers[${i}].email`)}
                      autoComplete="email"
                    />
                  </div>

                  {/* Phone Number */}
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
                    {/* Empty space next to phone number */}
                    <div></div>
                  </div>

                  {/* Employment Dates */}
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
                      name={`employers[${i}].start_at`}
                      label={t('START_DATE')}
                      type="date"
                      value={form.values.employers?.[i]?.start_at || ''}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      required
                      min={getMinDate()}
                      max={getMaxDate()}
                      error={getFieldError(`employers[${i}].start_at`)}
                      helperText={t('EMPLOYMENT_HISTORY_DATE_NOTE')}
                    />

                    <Input
                      name={`employers[${i}].end_at`}
                      label={t('END_DATE')}
                      type="date"
                      value={form.values.employers?.[i]?.end_at || ''}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      required
                      min={getMinDate()}
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

                  {/* Reason for Leaving */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <TextArea
                      name={`employers[${i}].reason_for_leaving`}
                      label={t('REASON_FOR_LEAVING')}
                      placeholder="Please explain why you left this position..."
                      value={form.values.employers?.[i]?.reason_for_leaving || ''}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      rows={3}
                      error={getFieldError(`employers[${i}].reason_for_leaving`) || undefined}
                      helperText="Provide a brief explanation for leaving this employer"
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
        .company-lookup-btn:hover:not(:disabled) {
          background-color: #17a2b8 !important;
          color: white !important;
          border-color: #17a2b8 !important;
        }
        .company-lookup-btn:active:not(:disabled),
        .company-lookup-btn:focus:not(:disabled) {
          background-color: #17a2b8 !important;
          color: white !important;
          border-color: #17a2b8 !important;
          box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5) !important;
        }
      `}</style>

      {/* Company Lookup Modal */}
      <CompanyLookupModal
        show={showLookupModal}
        onHide={() => {
          setShowLookupModal(false);
          setLookupEmployerIndex(null);
        }}
        onSelectCompany={handleSelectCompany}
        searchTerm={
          lookupEmployerIndex !== null
            ? form.values.employers?.[lookupEmployerIndex]?.name || ''
            : ''
        }
      />
    </>
  );
}
