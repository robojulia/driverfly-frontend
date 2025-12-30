import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form, Button as BootstrapButton, Row } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { useAsyncFormSave } from '../../../../hooks/use-async-form-save';
import { ApplicantEmployerEntity } from '../../../../models/applicant';
import { CurrentEmploymentHistoryPageDto } from '../../../../models/jot-form/long-form/current-employment-history-page.dto';
import { CurrentEmploymentHistoryDto } from '../../../../models/jot-form/long-form/current-emplyment-history/index.dto';
import { Input, Checkbox, RadioGroup, DhaPhoneInput, Select, TextArea } from '../../../shared/dha';
import stateList from '../../../../utils/stateList';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { FormActions } from '../form-buttons';
import CompanyLookupModal from '../../../modals/company-lookup-modal';
import { Search } from 'react-bootstrap-icons';

export function EmploymentHistory() {
  const {
    state: { applicant, steps },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(false);
  const [showLookupModal, setShowLookupModal] = useState(false);

  // Initialize async form saving
  const { saveFormData } = useAsyncFormSave(applicant?.id, steps);

  const form = useFormik({
    initialValues: {
      ...new CurrentEmploymentHistoryPageDto(),
      already_applied_to_company: applicant?.already_applied_to_company ?? null,
      already_worked_to_company: applicant?.already_worked_to_company ?? null,
      already_worked_start_date: applicant?.already_worked_start_date ?? null,
      already_worked_end_date: applicant?.already_worked_end_date ?? null,
    },
    validationSchema: CurrentEmploymentHistoryPageDto.yupSchema(),
    onSubmit: (values) => {
      const { employer, is_current_employed, already_applied_to_company, already_worked_to_company, already_worked_start_date, already_worked_end_date } = values;

      const employers: ApplicantEmployerEntity[] = applicant?.employers?.filter(
        (v) => !!!v?.is_current
      );

      if (!!is_current_employed) employers.push(employer);

      const updatedApplicant = {
        ...applicant,
        employers,
        already_applied_to_company,
        already_worked_to_company,
        already_worked_start_date,
        already_worked_end_date,
      };

      setApplicant(updatedApplicant);

      // Save form data on submit
      saveFormData({
        applicant: updatedApplicant,
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
      // If currently employed, all required fields must be filled
      const requiredFieldsFilled = !!(
        form.values.employer?.can_contact !== null &&
        form.values.employer?.can_contact !== undefined &&
        form.values.employer?.name &&
        form.values.employer?.title &&
        form.values.employer?.start_at
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
        title: employer?.title || 'Driver',
        is_subject_to_fmcsrs: Boolean(employer) ? employer?.is_subject_to_fmcsrs : true,
        is_subject_to_drug_tests: Boolean(employer) ? employer?.is_subject_to_drug_tests : true,
        is_current: true,
        can_contact:
          Boolean(employer) && employer?.can_contact !== undefined ? employer?.can_contact : null,
      },
      is_current_employed: Boolean(employer),
      already_applied_to_company: applicant?.already_applied_to_company !== undefined ? applicant?.already_applied_to_company : null,
      already_worked_to_company: applicant?.already_worked_to_company !== undefined ? applicant?.already_worked_to_company : null,
      already_worked_start_date: applicant?.already_worked_start_date ?? null,
      already_worked_end_date: applicant?.already_worked_end_date ?? null,
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

  const notCurrentEmployedValue =
    form.values.is_current_employed === false ? BooleanType.NO : undefined;

  // Helper functions for contact authorization radio group
  const getCanContactValue = () => {
    if (form.values.employer?.can_contact === true) return BooleanType.YES;
    if (form.values.employer?.can_contact === false) return BooleanType.NO;
    return undefined;
  };

  const handleCanContactChange = (value: string) => {
    const canContact = value === BooleanType.YES;
    form.setFieldValue('employer.can_contact', canContact);
    form.setFieldTouched('employer.can_contact', true);

    // Force validation to run immediately (like in unable-for-job component)
    setTimeout(() => {
      form.validateForm();
    }, 0);
  };

  const handleSelectCompany = (company: any) => {
    const address = company.phy_street || '';
    const city = company.phy_city || '';
    const state = company.phy_state || '';
    const zipCode = company.phy_zip || '';
    const phone = company.phone || '';
    const email = company.email_address || '';

    form.setFieldValue('employer.name', company.legal_name || company.dba_name || '');
    if (address) form.setFieldValue('employer.address', address);
    if (city) form.setFieldValue('employer.city', city);
    if (state) form.setFieldValue('employer.state', state);
    if (zipCode) form.setFieldValue('employer.zip_code', zipCode);
    if (phone) form.setFieldValue('employer.phone', phone);
    if (email) form.setFieldValue('employer.email', email);
  };

  // Helper functions for company history questions
  const getAppliedBeforeValue = () => {
    if (form.values.already_applied_to_company === true) return BooleanType.YES;
    if (form.values.already_applied_to_company === false) return BooleanType.NO;
    return undefined;
  };

  const getWorkedBeforeValue = () => {
    if (form.values.already_worked_to_company === true) return BooleanType.YES;
    if (form.values.already_worked_to_company === false) return BooleanType.NO;
    return undefined;
  };

  const handleAppliedBeforeChange = (value: string) => {
    let newValue: boolean | null = null;
    if (value === BooleanType.YES) {
      newValue = true;
    } else if (value === BooleanType.NO) {
      newValue = false;
      // Reset dependent fields when "No" is selected
      form.setFieldValue('already_worked_to_company', false);
      form.setFieldValue('already_worked_start_date', null);
      form.setFieldValue('already_worked_end_date', null);
    }
    form.setFieldValue('already_applied_to_company', newValue);
  };

  const handleWorkedBeforeChange = (value: string) => {
    let newValue: boolean | null = null;
    if (value === BooleanType.YES) {
      newValue = true;
    } else if (value === BooleanType.NO) {
      newValue = false;
      // Clear date fields when "No" is selected
      form.setFieldValue('already_worked_start_date', null);
      form.setFieldValue('already_worked_end_date', null);
    }
    form.setFieldValue('already_worked_to_company', newValue);
  };

  const formatDateForInput = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

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
          {/* Company History Questions */}
          <div
            style={{
              maxWidth: '800px',
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
              Please let us know if you have previously applied to or worked with{' '}
              <strong>{applicant?.company?.name}</strong>. This helps us better understand your
              background and experience with our company.
            </p>
          </div>

          {/* First Question: Applied Before */}
          <div style={{ marginBottom: '2rem' }}>
            <RadioGroup
              name="already_applied_to_company"
              label={t('APPLIED_HERE_BEFORE')}
              enumType={BooleanType}
              value={getAppliedBeforeValue()}
              onChange={handleAppliedBeforeChange}
              required
              error={
                form.touched.already_applied_to_company && form.errors.already_applied_to_company
                  ? String(form.errors.already_applied_to_company)
                  : undefined
              }
              labelPrefix="BooleanType"
              columns={2}
              variant="card"
              helperText="Select 'Yes' if you have previously submitted an application to this company"
            />
          </div>

          {/* Second Question: Worked Before (conditional) */}
          {form.values.already_applied_to_company === true && (
            <div style={{ marginBottom: '2rem' }}>
              <RadioGroup
                name="already_worked_to_company"
                label={t('WORKED_HERE_BEFORE')}
                enumType={BooleanType}
                value={getWorkedBeforeValue()}
                onChange={handleWorkedBeforeChange}
                required
                error={
                  form.touched.already_worked_to_company && form.errors.already_worked_to_company
                    ? String(form.errors.already_worked_to_company)
                    : undefined
                }
                labelPrefix="BooleanType"
                columns={2}
                variant="card"
                helperText="Select 'Yes' if you were previously employed by this company"
              />
            </div>
          )}

          {/* Date Range (conditional) */}
          {form.values.already_worked_to_company === true && (
            <div style={{ marginBottom: '2rem' }}>
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              >
                <h6 style={{ marginBottom: '1rem', color: '#495057' }}>
                  Employment Period Details
                </h6>
                <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '1rem' }}>
                  Please provide the dates when you worked for {applicant?.company?.name}
                </p>

                <Row className="g-3">
                  <div className="col-md-6">
                    <Input
                      name="already_worked_start_date"
                      type="date"
                      label={t('FROM')}
                      placeholder="Select start date"
                      value={formatDateForInput(form.values.already_worked_start_date)}
                      onChange={(e) => {
                        const value = e.target.value ? new Date(e.target.value) : null;
                        form.setFieldValue('already_worked_start_date', value);
                      }}
                      onBlur={form.handleBlur}
                      required
                      max={getMaxDate()}
                      error={
                        form.touched.already_worked_start_date &&
                        form.errors.already_worked_start_date
                          ? String(form.errors.already_worked_start_date)
                          : undefined
                      }
                      icon={<span>📅</span>}
                      helperText="When did you start working here?"
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      name="already_worked_end_date"
                      type="date"
                      label={t('TO')}
                      placeholder="Select end date"
                      value={formatDateForInput(form.values.already_worked_end_date)}
                      onChange={(e) => {
                        const value = e.target.value ? new Date(e.target.value) : null;
                        form.setFieldValue('already_worked_end_date', value);
                      }}
                      onBlur={form.handleBlur}
                      required
                      max={getMaxDate()}
                      min={formatDateForInput(form.values.already_worked_start_date)}
                      error={
                        form.touched.already_worked_end_date && form.errors.already_worked_end_date
                          ? String(form.errors.already_worked_end_date)
                          : undefined
                      }
                      icon={<span>📅</span>}
                      helperText="When did you stop working here?"
                    />
                  </div>
                </Row>
              </div>
            </div>
          )}

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
                <RadioGroup
                  name="employer.can_contact"
                  label={t('CONATACT_AUTHORITY')}
                  enumType={BooleanType}
                  value={getCanContactValue()}
                  onChange={handleCanContactChange}
                  required
                  error={
                    form.touched.employer?.can_contact && form.errors.employer?.can_contact
                      ? String(form.errors.employer?.can_contact)
                      : undefined
                  }
                  variant="card"
                  columns={2}
                  labelPrefix="BooleanType"
                  helperText="We need permission to contact your current employer for verification"
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
                <div>
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
                  <BootstrapButton
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setShowLookupModal(true)}
                    disabled={!form.values.employer?.name?.trim()}
                    className="company-lookup-btn"
                    style={{ marginTop: '0.5rem', width: '100%' }}
                  >
                    <Search style={{ marginRight: '0.5rem' }} />
                    Lookup Company
                  </BootstrapButton>
                </div>

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
                  min={getMinDate()}
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

              {/* Reason for Leaving (only show if no longer current or if they indicated they're leaving) */}
              {(!form.values.employer?.is_current || form.values.employer?.end_at) && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <TextArea
                    name="employer.reason_for_leaving"
                    label={t('REASON_FOR_LEAVING')}
                    placeholder="Please explain why you left this position..."
                    value={form.values.employer?.reason_for_leaving || ''}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    rows={3}
                    error={
                      form.touched.employer?.reason_for_leaving &&
                      form.errors.employer?.reason_for_leaving
                        ? String(form.errors.employer.reason_for_leaving)
                        : undefined
                    }
                    helperText="Provide a brief explanation for leaving this employer"
                  />
                </div>
              )}
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
        onHide={() => setShowLookupModal(false)}
        onSelectCompany={handleSelectCompany}
        searchTerm={form.values.employer?.name || ''}
      />
    </>
  );
}
