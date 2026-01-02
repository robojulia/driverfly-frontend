import { useFormik } from "formik";
import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { toast } from "react-toastify";

import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { LicenseRestrictions } from "../../../enums/applicants/applicant-license-restrictions-type.enum";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";
import { ApplicantEntryMode } from "../../../enums/applicants/applicant-entry-mode.enum";
import { HearAboutUsType } from "../../../enums/jotform/hear-about-type.enum";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { JobSchedule } from "../../../enums/jobs/job-schedule.enum";
import { JobEmploymentType } from "../../../enums/jobs/job-employment-type.enum";
import { Status } from "../../../enums/status.enum";
import { DriverEndorsement } from "../../../enums/users/driver-endorsement.enum";
import { DriverLicenseType } from "../../../enums/users/driver-license-type.enum";
import { EducationLevel } from "../../../enums/users/education-level.enum";
import { VehicleTransmissionType } from "../../../enums/vehicles/vehicle-transmission-type.enum";
import { useAuth } from "../../../hooks/use-auth";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantExtrasEntity } from "../../../models/applicant";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { CdlExtras } from "../../../models/jot-form/long-form/cdl-object/index.dto";
import { UserEntity } from "../../../models/user/user.entity";
import { ReferralSourceEntity } from "../../../models/referral-source/referral-source.entity";
import ApplicantApi from "../../../pages/api/applicant";
import UserApi from "../../../pages/api/user";
import { ReferralSourceApi } from "../../../pages/api/referral-source";
import CompanyApi from "../../../pages/api/company";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { focusOnErrorField } from "../../../utils/form-error";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import Section from "../../view-details/section";
import BaseCheck from "../base-check";
import BaseCheckList from "../base-check-list";
import BaseInput from "../base-input";
import BaseInputPhone from "../base-input-phone";
import BaseSelect from "../base-select";
import BaseTextArea from "../base-text-area";
import StateSelect from "../state-select";
import CountryStateSelect from "../country-state-select";
import stateList from "../../../utils/stateList";
import provinceList from "../../../utils/provinceList";
import mexicoStateList from "../../../utils/mexicoStateList";
import { BaseFormProps } from "./base-form-props";

export interface ApplicantBasicDetailsFormNewProps extends BaseFormProps<ApplicantEntity> {
  isSubmitting: boolean;
  setIsSubmitting(value: boolean): void;
  afterLicensing?: React.ReactNode;
  hideActions?: boolean;
  showLicensing?: boolean;
  showPreferences?: boolean;
}

export function ApplicantBasicDetailsFormNew(props: ApplicantBasicDetailsFormNewProps) {
  let { className, entity, setEntity, isSubmitting, setIsSubmitting } = props;
  let { user, isSuperAdmin, isCompanyAdmin } = useAuth();
  const { t } = useTranslation();
  const current_date = new Date();

  const applicantApi = new ApplicantApi();

  const [companyUsers, setCompanyUsers] = useState<UserEntity[]>([]);
  const [referralSources, setReferralSources] = useState<ReferralSourceEntity[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [dotVerifyRaw, setDotVerifyRaw] = useState<any>(null);
  const [currentAge, setCurrentAge] = useState<string>('');

  const form = useFormik({
    initialValues: new ApplicantEntity(),
    enableReinitialize: false,
    validationSchema: ApplicantEntity.yupSchemaForApplicantBasicDetailsForm(),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      values.extras = values.extras?.filter((v) => v.value != undefined || v.value != null);
      if ("jobs" in values) delete values.jobs;
      // Strip non-persisted presentation-only fields AND preference fields (handled by preferences form)
      const { meta, routes, preferred_location, current_application_status, ...restValues } = (values as any) || {};
      const timestamp = new Date().toISOString();
      try {
        if (entity?.id) {
          values = await applicantApi.update(entity.id, { ...restValues } as ApplicantEntity);
        } else {
          values = await applicantApi.create(restValues as ApplicantEntity);
        }
        
        // Check if child toasts are suppressed by global save
        if (!(window as any).__SUPPRESS_CHILD_TOASTS__) {
          formSuccess(t, entity?.id ? "update" : "create", "APPLICANT");
        }
        
        // MERGE saved response with existing entity to preserve fields backend didn't return
        setEntity({ ...entity, ...values });
        setIsSubmitting(false);
      } catch (e) {
        setIsSubmitting(false);
        if (!globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast }))
          formFailed(t, entity?.id ? "update" : "create", "APPLICANT");
      }
    },
  });

  // No referral creation modal in the new layout

  useEffectAsync(async () => {
    // Only initialize form once to prevent overwriting user changes
    if (initialized && entity?.id) return;
    
    // No referral creation modal in the new layout
    let extras: ApplicantExtrasEntity[] = entity?.extras || [];

    extras = extras.filter(Boolean);
    if (!extras?.find((v) => v.type == ApplicantExtras.BUSINESS_NAME))
      extras?.push({ ...new ApplicantExtrasEntity(), type: ApplicantExtras.BUSINESS_NAME });
    if (!extras?.find((v) => v.type == ApplicantExtras.DOT_NUMBER))
      extras?.push({ ...new ApplicantExtrasEntity(), type: ApplicantExtras.DOT_NUMBER });
    if (!extras?.find((v) => v.type == ApplicantExtras.CDL_NUMBER))
      extras?.push({ ...new ApplicantExtrasEntity(), type: ApplicantExtras.CDL_NUMBER });

    // Extract meta fields from extras into a meta object for easier form handling
    const meta = {
      middle_name: extras?.find((e) => e.type === ApplicantExtras.MIDDLE_NAME)?.value || '',
      suffix: extras?.find((e) => e.type === ApplicantExtras.SUFFIX)?.value || '',
      alternative_phone: extras?.find((e) => e.type === ApplicantExtras.ALTERNATIVE_PHONE)?.value || '',
      marital_status: extras?.find((e) => e.type === ApplicantExtras.MARITAL_STATUS)?.value || '',
      race: extras?.find((e) => e.type === ApplicantExtras.RACE)?.value || '',
      citizenship_status: extras?.find((e) => e.type === ApplicantExtras.CITIZENSHIP_STATUS)?.value || '',
      country: extras?.find((e) => e.type === ApplicantExtras.COUNTRY)?.value || '',
      ethnicity: extras?.find((e) => e.type === ApplicantExtras.ETHNICITY)?.value || '',
      gender: extras?.find((e) => e.type === ApplicantExtras.GENDER)?.value || '',
      veteran_status: extras?.find((e) => e.type === ApplicantExtras.VETERAN_STATUS)?.value || '',
      age: '', // Calculated field, not saved
    };

    if (!!entity?.id) {
      // If entity has ssn_last4 but no full ssn, show masked SSN
      const ssnDisplay = entity?.ssn ||
        ((entity as any)?.ssn_last4 ? `XXX-XX-${String((entity as any).ssn_last4).slice(-4)}` : '');

      // Derive entry_mode from existing data if not explicitly set
      let entryMode = entity?.entry_mode;
      if (!entryMode) {
        // Try to determine entry_mode from other fields for legacy data
        if (entity?.is_automated_recruiting_lead) {
          entryMode = ApplicantEntryMode.AUTO_RECRUITING_LEAD;
        } else if (entity?.integration_source) {
          // If imported from an ATS integration
          entryMode = ApplicantEntryMode.ATS_IMPORT;
        } else if (entity?.type === 'DHA' || ((entity as any)?.last_completed_step !== undefined && (entity as any)?.last_completed_step !== null)) {
          // If type is DHA or they have a last_completed_step, they went through the digital hiring app (long form)
          entryMode = ApplicantEntryMode.DIGITAL_HIRING_APP;
        } else if (entity?.type === 'DIRECT_JOB_APPLY') {
          // If they directly applied on a job (short form)
          entryMode = ApplicantEntryMode.SHORT_FORM_APPLICATION;
        } else if (entity?.type === 'COMPANY') {
          // If type is COMPANY, they were manually added or uploaded by company
          // Check if they have minimal data (suggesting bulk upload) vs full data (manual entry)
          const hasMinimalData = !entity?.license_number && !entity?.years_cdl_experience;
          entryMode = hasMinimalData ? ApplicantEntryMode.COMPANY_UPLOADED : ApplicantEntryMode.MANUALLY_ADDED;
        } else {
          // Default to MANUALLY_ADDED for other legacy records
          entryMode = ApplicantEntryMode.MANUALLY_ADDED;
        }
      }

      form.resetForm({
        values: {
          ...entity,
          ssn: ssnDisplay,
          extras,
          meta,
          entry_mode: entryMode,
          referralSourceId: entity?.referralSource?.id || entity?.referralSourceId
        } as any
      });
      setInitialized(true);
    } else {
      await form.resetForm({
        values: {
          ...new ApplicantEntity(),
          type: null,
          entry_mode: ApplicantEntryMode.MANUALLY_ADDED,
          extras,
          meta
        } as any
      });
    }
  }, [entity?.id, initialized]);

  useEffectAsync(async () => {
    const userApi = new UserApi();
    const data = await userApi.list();
    setCompanyUsers(data?.filter((u) => u.status == Status.ACTIVE));

    const referralSourceApi = new ReferralSourceApi();
    const referralData = await referralSourceApi.list();
    setReferralSources(referralData?.filter((r) => r.status == Status.ACTIVE) || []);
  }, []);

  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD (prevents future dates)

  useEffect(() => focusOnErrorField(form), [form.submitCount]);

  // Keep a ref to always have the latest form instance
  const formRef = useRef(form);
  formRef.current = form;

  // Register getter function that returns CURRENT form values when called
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Register validation function
      (window as any).__applicantFormValidation = (window as any).__applicantFormValidation || {};
      (window as any).__applicantFormValidation['basic-details'] = () => {
        // Return current validation errors from formik
        return formRef.current.errors;
      };

      // Register dirty state function
      (window as any).__applicantFormDirty = (window as any).__applicantFormDirty || {};
      (window as any).__applicantFormDirty['basic-details'] = () => {
        return formRef.current.dirty;
      };

      // Register reset dirty function
      (window as any).__applicantFormResetDirty = (window as any).__applicantFormResetDirty || {};
      (window as any).__applicantFormResetDirty['basic-details'] = () => {
        formRef.current.resetForm({ values: formRef.current.values });
      };

      // Register error setter function
      (window as any).__applicantFormSetErrors = (window as any).__applicantFormSetErrors || {};
      (window as any).__applicantFormSetErrors['basic-details'] = (errors: Record<string, string>) => {
        // Set errors and mark fields as touched
        formRef.current.setErrors(errors);
        const touched: Record<string, boolean> = {};
        Object.keys(errors).forEach(key => {
          touched[key] = true;
        });
        formRef.current.setTouched(touched);
      };

      (window as any).__applicantFormRegistry = (window as any).__applicantFormRegistry || {};
      (window as any).__applicantFormRegistry['basic-details'] = () => {
        console.log('BasicDetailsForm getter called, current city:', formRef.current.values.city);

        // Convert meta fields back into extras format
        const currentExtras = (formRef.current.values.extras || []).filter((e: any) =>
          // Remove old meta field entries so we can add fresh ones
          // Also remove DOT_NUMBER and BUSINESS_NAME (handled by licensing form)
          ![
            ApplicantExtras.MIDDLE_NAME,
            ApplicantExtras.SUFFIX,
            ApplicantExtras.ALTERNATIVE_PHONE,
            ApplicantExtras.AUTHORIZED_TO_WORK,
            ApplicantExtras.MARITAL_STATUS,
            ApplicantExtras.RACE,
            ApplicantExtras.CITIZENSHIP_STATUS,
            ApplicantExtras.COUNTRY,
            ApplicantExtras.ETHNICITY,
            ApplicantExtras.GENDER,
            ApplicantExtras.VETERAN_STATUS,
            ApplicantExtras.DOT_NUMBER,
            ApplicantExtras.BUSINESS_NAME,
          ].includes(e.type)
        );

        // Add meta fields to extras
        const meta = (formRef.current.values as any).meta || {};
        if (meta.middle_name) currentExtras.push({ type: ApplicantExtras.MIDDLE_NAME, value: meta.middle_name } as any);
        if (meta.suffix) currentExtras.push({ type: ApplicantExtras.SUFFIX, value: meta.suffix } as any);
        if (meta.alternative_phone) currentExtras.push({ type: ApplicantExtras.ALTERNATIVE_PHONE, value: meta.alternative_phone } as any);
        if (meta.marital_status) currentExtras.push({ type: ApplicantExtras.MARITAL_STATUS, value: meta.marital_status } as any);
        if (meta.race) currentExtras.push({ type: ApplicantExtras.RACE, value: meta.race } as any);
        if (meta.citizenship_status) currentExtras.push({ type: ApplicantExtras.CITIZENSHIP_STATUS, value: meta.citizenship_status } as any);
        if (meta.country) currentExtras.push({ type: ApplicantExtras.COUNTRY, value: meta.country } as any);
        if (meta.ethnicity) currentExtras.push({ type: ApplicantExtras.ETHNICITY, value: meta.ethnicity } as any);
        if (meta.gender) currentExtras.push({ type: ApplicantExtras.GENDER, value: meta.gender } as any);
        if (meta.veteran_status) currentExtras.push({ type: ApplicantExtras.VETERAN_STATUS, value: meta.veteran_status } as any);

        // Add DOT_NUMBER and BUSINESS_NAME to extras (from this form)
        const dotNumberIdx = formRef.current.values.extras?.findIndex((v: any) => v.type === ApplicantExtras.DOT_NUMBER);
        const businessNameIdx = formRef.current.values.extras?.findIndex((v: any) => v.type === ApplicantExtras.BUSINESS_NAME);

        if (dotNumberIdx !== -1 && formRef.current.values.extras?.[dotNumberIdx]?.value) {
          currentExtras.push({
            type: ApplicantExtras.DOT_NUMBER,
            value: formRef.current.values.extras[dotNumberIdx].value,
            id: formRef.current.values.extras[dotNumberIdx].id,
          } as any);
        }
        if (businessNameIdx !== -1 && formRef.current.values.extras?.[businessNameIdx]?.value) {
          currentExtras.push({
            type: ApplicantExtras.BUSINESS_NAME,
            value: formRef.current.values.extras[businessNameIdx].value,
            id: formRef.current.values.extras[businessNameIdx].id,
          } as any);
        }

        // Return ONLY fields managed by this form (CDL fields are handled by licensing form)
        const ssnFormValue = formRef.current.values.ssn || '';
        // Extract digits from formatted SSN (removes hyphens and X's)
        const ssnDigits = ssnFormValue.replace(/\D/g, '');
        // Only include SSN if user entered a complete 9-digit SSN
        // This prevents accidentally clearing existing SSN when form only has ssn_last4
        const ssn = ssnDigits && ssnDigits.length === 9 ? ssnDigits : undefined;
        const ssn_last4 = ssn && ssn.length >= 4 ? ssn.slice(-4) : undefined;

        const formData: any = {
          first_name: formRef.current.values.first_name,
          last_name: formRef.current.values.last_name,
          phone: formRef.current.values.phone,
          email: formRef.current.values.email,
          address_1: formRef.current.values.address_1,
          address_2: formRef.current.values.address_2,
          city: formRef.current.values.city,
          state: formRef.current.values.state,
          zip_code: formRef.current.values.zip_code,
          birthdate: formRef.current.values.birthdate,
          assignedUserId: formRef.current.values.assignedUserId,
          type: formRef.current.values.type,
          referralSourceId: formRef.current.values.referralSourceId,
          current_application_status: formRef.current.values.current_application_status,
          employment_type: formRef.current.values.employment_type,
          is_owner_operator: formRef.current.values.is_owner_operator,
          authorized_to_work_in_us: formRef.current.values.authorized_to_work_in_us,
          highest_degree: formRef.current.values.highest_degree,
          extras: currentExtras,
        };

        // Only add SSN fields if user entered a complete SSN
        if (ssn) {
          formData.ssn = ssn;
          formData.ssn_last4 = ssn_last4;
        }

        console.log('Basic Details Form Registry - SSN value:', formData.ssn);
        console.log('Basic Details Form Registry - SSN last4:', formData.ssn_last4);
        console.log('Basic Details Form Registry - Full data:', formData);

        return formData;
      };
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__applicantFormValidation?.['basic-details'];
        delete (window as any).__applicantFormDirty?.['basic-details'];
        delete (window as any).__applicantFormResetDirty?.['basic-details'];
        delete (window as any).__applicantFormSetErrors?.['basic-details'];
        delete (window as any).__applicantFormRegistry?.['basic-details'];
      }
    };
  }, []);

  const handleLicenseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseValue = e.target.value.toUpperCase();
    form.setFieldValue(e.target.name, uppercaseValue);
  };

  // Auto-set entry_mode to AUTO_RECRUITING_LEAD when is_automated_recruiting_lead is true
  useEffect(() => {
    if (form.values?.is_automated_recruiting_lead && form.values?.entry_mode !== ApplicantEntryMode.AUTO_RECRUITING_LEAD) {
      form.setFieldValue('entry_mode', ApplicantEntryMode.AUTO_RECRUITING_LEAD);
    } else if (!form.values?.is_automated_recruiting_lead && form.values?.entry_mode === ApplicantEntryMode.AUTO_RECRUITING_LEAD) {
      form.setFieldValue('entry_mode', ApplicantEntryMode.MANUALLY_ADDED);
    }
  }, [form.values?.is_automated_recruiting_lead]);

  // Clear citizenship_status when authorized_to_work_in_us is false
  useEffect(() => {
    const values = form.values as any;
    if (values?.authorized_to_work_in_us === false && values?.meta?.citizenship_status) {
      form.setFieldValue('meta.citizenship_status', '');
    }
  }, [form.values?.authorized_to_work_in_us]);

  // Clear state/province when country changes to avoid invalid combinations
  useEffect(() => {
    const values = form.values as any;
    if (values?.meta?.country && values?.state) {
      // Only clear if the state value doesn't match the new country's format
      const country = values.meta.country;
      const state = values.state;

      // Check if the current state is valid for the selected country
      let isValidForCountry = false;
      if (country === 'Canada') {
        isValidForCountry = provinceList.some(p => p.value === state);
      } else if (country === 'Mexico') {
        isValidForCountry = mexicoStateList.some(s => s.value === state);
      } else {
        isValidForCountry = stateList.some(s => s.value === state);
      }

      // If not valid, clear the state field
      if (!isValidForCountry) {
        form.setFieldValue('state', '');
      }
    }
  }, [(form.values as any)?.meta?.country]);

  // Calculate age from birthdate
  const calculateAge = (birthdate: string | Date | null | undefined): string => {
    if (!birthdate) return '';
    const birthDate = new Date(birthdate);
    if (isNaN(birthDate.getTime())) return '';

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 0 ? String(age) : '';
  };

  // Update age dynamically based on birthdate - updates every minute
  useEffect(() => {
    const updateAge = () => {
      const values = form.values as any;
      if (values?.birthdate) {
        const newAge = calculateAge(values.birthdate);
        setCurrentAge(newAge);
      } else {
        setCurrentAge('');
      }
    };

    // Initial calculation
    updateAge();

    // Update age every minute to keep it current
    const interval = setInterval(updateAge, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval);
  }, [form.values?.birthdate]);

  return (
    <Form onSubmit={form.handleSubmit} className={className} onReset={form.handleReset} data-applicant-edit-form>
      {/* Basic Information - Combined Section */}
      <Row>
        <Col md="12" className="p-2 mt-2">
          <div className="df-modern-section">
          <Section title="Basic Information">
            {/* Name fields */}
            <Row className="mb-2">
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="First Name" required name="first_name" placeholder="John" formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Middle Name" name="meta.middle_name" placeholder="Michael" formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Last Name" required name="last_name" placeholder="Doe" formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Suffix" name="meta.suffix" placeholder="Jr., Sr., III" formik={form} />
              </Col>
            </Row>
            
            {/* SSN, Phone, Alternative Phone, Email */}
            <Row className="mb-2">
              <Col md="3" className="px-2">
                <div className="col-12">
                  <label>{t("Social Security Number")}:</label>
                  <div className="d-flex align-items-center gap-2">
                    <div className="flex-grow-1">
                      <BaseInput
                        className="w-100"
                        readOnly={Boolean(entity?.is_hired) || (Boolean((entity as any)?.ssn_last4) && !(form.values as any).ssnEditMode)}
                        name="ssn"
                        placeholder={(form.values as any).ssnEditMode ? "XXX-XX-XXXX" : ""}
                        formik={form}
                        maxLength={11}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const digitsOnly = inputValue.replace(/\D/g, '').slice(0, 9);

                          // Format the value for display
                          let formattedValue = '';
                          if (digitsOnly.length <= 3) {
                            formattedValue = digitsOnly;
                          } else if (digitsOnly.length <= 5) {
                            formattedValue = digitsOnly.slice(0, 3) + '-' + digitsOnly.slice(3);
                          } else {
                            formattedValue = digitsOnly.slice(0, 3) + '-' + digitsOnly.slice(3, 5) + '-' + digitsOnly.slice(5);
                          }

                          // Store the formatted value in formik (for display)
                          form.setFieldValue('ssn', formattedValue);
                        }}
                      />
                    </div>
                    {/* Show Change/Cancel button if SSN exists */}
                    {(entity as any)?.ssn_last4 && !Boolean(entity?.is_hired) && (
                      <Button
                        type="button"
                        variant={(form.values as any).ssnEditMode ? "secondary" : "outline-primary"}
                        size="sm"
                        style={{ whiteSpace: 'nowrap', minWidth: '80px' }}
                        onClick={() => {
                          if ((form.values as any).ssnEditMode) {
                            // Cancel editing - restore masked SSN
                            const ssnLast4 = (entity as any)?.ssn_last4;
                            form.setFieldValue('ssn', `XXX-XX-${String(ssnLast4).slice(-4)}`);
                            form.setFieldValue('ssnEditMode', false);
                          } else {
                            // Enable editing - clear the field
                            form.setFieldValue('ssn', '');
                            form.setFieldValue('ssnEditMode', true);
                          }
                        }}
                      >
                        {(form.values as any).ssnEditMode ? t('Cancel') : t('Change')}
                      </Button>
                    )}
                  </div>
                  {(form.values as any).ssnEditMode && (
                    <small className="text-muted">
                      Enter the complete 9-digit SSN to replace the existing one
                    </small>
                  )}
                </div>
              </Col>
              <Col md="3" className="px-2">
                <div style={{ maxWidth: '100%' }}>
                  <BaseInputPhone className="col-12" readOnly={Boolean(entity?.is_hired)} label="Phone Number" required name="phone" placeholder="(555) 987-6543" formik={form} />
                </div>
              </Col>
              <Col md="3" className="px-2">
                <div style={{ maxWidth: '100%' }}>
                  <BaseInputPhone className="col-12" readOnly={Boolean(entity?.is_hired)} label="Alternative Phone Number" name="meta.alternative_phone" placeholder="(555) 987-6543" formik={form} />
                </div>
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Email" type="email" name="email" placeholder="john.doe@example.com" formik={form} />
              </Col>
            </Row>

            {/* Country, Street Address, Address Line 2, City */}
            <Row className="mb-2">
              <Col md="3" className="px-2">
                <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="Country" name="meta.country" placeholder="Select country" options={["United States","Canada","Mexico"]} formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Street Address" name="address_1" placeholder="120 Folsom St." formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Address Line 2" name="address_2" placeholder="Apt, Suite, Unit, etc." formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="City" name="city" placeholder="Atlanta" formik={form} />
              </Col>
            </Row>

            {/* State/Province, Zip Code, Date of Birth, Age */}
            <Row className="mb-2">
              <Col md="3" className="px-2">
                <CountryStateSelect
                  className="col-12"
                  readOnly={Boolean(entity?.is_hired)}
                  label={(form.values as any)?.meta?.country === 'Canada' ? 'Province' : 'State'}
                  name="state"
                  placeholder={(form.values as any)?.meta?.country === 'Canada' ? 'Select province' : 'Select state'}
                  country={(form.values as any)?.meta?.country}
                  formik={form}
                />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Zip Code" name="zip_code" placeholder="83202" formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Date of Birth" type="date" name="birthdate" placeholder="mm / dd / yyyy" formik={form} max={todayFormatted} />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput
                  className="col-12"
                  label="Age"
                  type="number"
                  name="meta.age"
                  value={currentAge}
                  readOnly={Boolean(form.values?.birthdate) || Boolean(entity?.is_hired)}
                  formik={!form.values?.birthdate ? form : undefined}
                  placeholder={!form.values?.birthdate ? "Enter age" : ""}
                />
              </Col>
            </Row>

            {/* Entry Mode, Auto Recruiting Lead, Lead Type, Referral Source */}
            <Row className="mb-2">
              <Col md="3" className="px-2">
                <BaseSelect
                  className="col-12"
                  readOnly
                  label="Entry Mode"
                  name="entry_mode"
                  placeholder="Select entry mode"
                  labelPrefix="ApplicantEntryMode"
                  enumType={ApplicantEntryMode}
                  formik={form}
                />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput
                  className="col-12"
                  readOnly
                  label="Auto Recruiting Lead"
                  name="auto_recruiting_lead_display"
                  value={form.values?.is_automated_recruiting_lead ? "Yes" : "No"}
                  formik={undefined}
                />
              </Col>
              <Col md="3" className="px-2">
                <BaseSelect
                  className="col-12"
                  readOnly={Boolean(entity?.is_hired)}
                  label="Lead Type"
                  name="type"
                  placeholder="Select lead type"
                  labelPrefix="HearAboutUsType"
                  enumType={HearAboutUsType}
                  formik={form}
                />
              </Col>
              <Col md="3" className="px-2">
                <BaseSelect
                  className="col-12"
                  readOnly={Boolean(entity?.is_hired)}
                  label="Referral Source"
                  name="referralSourceId"
                  placeholder="Select referral source"
                  options={referralSources?.map((r) => ({ label: r.name, value: r.id }))}
                  formik={form}
                />
              </Col>
            </Row>

            {/* Status, Assigned Recruiter, Authorized to work, Citizenship Status (conditional) */}
            <Row className="mb-2">
              <Col md="3" className="px-2">
                {form.values?.id && (
                  <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} name="current_application_status" placeholder="Select status" label="Status" labelPrefix="ApplicantStatus" enumType={ApplicantStatus} formik={form} style={{ backgroundColor: '#83e0de' }} />
                )}
              </Col>
              <Col md="3" className="px-2">
                <BaseSelect
                  className="col-12"
                  readOnly={Boolean(entity?.is_hired)}
                  label="Assigned Recruiter"
                  name="assignedUserId"
                  placeholder="Select recruiter"
                  options={companyUsers?.map((u) => ({ label: `${u.first_name} ${u.last_name}`, value: u.id }))}
                  formik={form}
                />
              </Col>
              <Col md="3" className="px-2">
                <BaseSelect
                  className="col-12"
                  readOnly={Boolean(entity?.is_hired)}
                  label="Authorized to work in the US?"
                  name="authorized_to_work_in_us"
                  placeholder="Select"
                  options={[
                    { label: "Yes", value: "true" },
                    { label: "No", value: "false" }
                  ]}
                  formik={form}
                  onChange={(e) => {
                    // Convert string to boolean
                    const boolValue = e.target.value === "true" ? true : e.target.value === "false" ? false : null;
                    form.setFieldValue("authorized_to_work_in_us", boolValue);
                  }}
                />
              </Col>
              {form.values?.authorized_to_work_in_us === true && (
                <Col md="3" className="px-2">
                  <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="Citizenship Status" name="meta.citizenship_status" placeholder="Select" options={["U.S. Citizen","Permanent Resident","Work Visa","Other"]} formik={form} />
                </Col>
              )}
            </Row>

            {/* Owner Operator and Employment Type Section */}
            <Row className="mb-2">
              <Col md="6" className="px-2">
                <BaseCheck className="col-12 mt-2" disabled={Boolean(entity?.is_hired)} label="OWNER_OPERATOR" name="is_owner_operator" formik={form} />
              </Col>
              {!form.values.is_owner_operator && (
                <Col md="6" className="px-2">
                  <BaseCheckList
                    className="col-12"
                    disabled={Boolean(entity?.is_hired)}
                    label="EMPLOYMENT_TYPE"
                    name="employment_type"
                    cols={1}
                    labelPrefix="JobEmploymentType"
                    options={Object.entries(JobEmploymentType)
                      .filter(([key, value]) => value !== JobEmploymentType.OWNER_OPERATOR)
                      .map(([key, value]) => ({ value, label: value }))}
                    formik={form}
                  />
                </Col>
              )}
            </Row>
            {Boolean(form.values.is_owner_operator) && (
              <>
                <Row className="mb-2">
                  <Col md="6" className="px-2">
                    <BaseInput readOnly={Boolean(entity?.is_hired)} className="col-12" label="BUSINESS_NAME" placeholder="Business Name (Optional)" name={`extras[${form.values?.extras?.findIndex((v) => v.type == ApplicantExtras.BUSINESS_NAME)}].value`} formik={form} />
                  </Col>
                  <Col md="6" className="px-2">
                    <div>
                      <label>
                        {t('DOT_NUMBER')}:
                      </label>
                      <br />
                      <div className="d-flex align-items-center gap-2" style={{ marginTop: '0.5rem' }}>
                        <div className="flex-grow-1">
                          <BaseInput
                            readOnly={Boolean(entity?.is_hired)}
                            className=""
                            name={`extras[${form.values?.extras?.findIndex((v) => v.type == ApplicantExtras.DOT_NUMBER)}].value`}
                            formik={form}
                          />
                        </div>
                        <Button
                          type="button"
                          className="btn theme-general-btn"
                          style={{ whiteSpace: 'nowrap', height: '44px' }}
                          onClick={async () => {
                            try {
                              const companyApi = new CompanyApi();
                              const dot_number = form.values.extras?.find((e: any) => e.type === ApplicantExtras.DOT_NUMBER)?.value;
                              const business_name = form.values.extras?.find((e: any) => e.type === ApplicantExtras.BUSINESS_NAME)?.value;
                              const tokens = await companyApi.dotVerify({
                                dot_number,
                                email: form.values.email,
                                phone: form.values.phone,
                                address_1: form.values.address_1 || (form.values as any).street,
                                city: form.values.city,
                                state: form.values.state,
                                zip_code: form.values.zip_code,
                                business_name,
                              });
                              setDotVerifyRaw(tokens);
                              const newTokens = Array.isArray(tokens) && tokens.length ? tokens[0] : [];
                              const others = (form.values.extras || []).filter((e: any) => e.type !== ApplicantExtras.DOT_VERIFICATION_RESULTS);
                              const updated = { type: ApplicantExtras.DOT_VERIFICATION_RESULTS, value: newTokens } as any;
                              const newExtras = [...others, updated];
                              const saved = await applicantApi.update(
                                entity?.id,
                                {
                                  first_name: form.values.first_name,
                                  last_name: form.values.last_name,
                                  extras: newExtras,
                                } as any,
                              );
                              setEntity?.({ ...entity, ...saved });

                              // Check if records array is empty
                              const data: any = (tokens as any)?.records ?? tokens;
                              const records: any[] = Array.isArray(data) ? data : (data ? [data] : []);
                              const validRecords = records.filter(rec => rec && Object.keys(rec || {}).length > 0);

                              if (records.length === 0 || validRecords.length === 0) {
                                toast.info("DOT lookup completed, but no records were found for this DOT number.");
                              } else {
                                toast.success("DOT Number Lookup Successful");
                              }
                            } catch (e) {
                              toast.error("Failed to refresh DOT verification");
                            }
                          }}
                        >
                          Lookup
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
                {(() => {
                  const dot_number = form.values.extras?.find((e: any) => e.type === ApplicantExtras.DOT_NUMBER)?.value;
                  if (!dot_number) return null;
                  const tokens: string[] =
                    (form.values.extras?.find((e: any) => e.type === ApplicantExtras.DOT_VERIFICATION_RESULTS)?.value as string[]) || [];
                  if (!tokens.length && !dotVerifyRaw) return null;

                  const checks = [
                    { key: "EMAIL", label: "Email" },
                    { key: "PHONE", label: "Phone" },
                    { key: "STREET_ADDRESS", label: "Street address" },
                    { key: "CITY", label: "City" },
                    { key: "STATE", label: "State" },
                    { key: "ZIP_CODE", label: "ZIP code" },
                  ];
                  const getStatus = (k: string): boolean | null => {
                    if (tokens.includes(`${k}_SUCCESS`)) return true;
                    if (tokens.includes(`${k}_FAIL`)) return false;
                    return null;
                  };
                  const formatCountry = (value?: string) => {
                    if (!value) return value;
                    const raw = String(value).trim();
                    const normalized = raw.toUpperCase().replace(/\./g, '');
                    if (normalized === 'US' || normalized === 'USA' || normalized === 'UNITED STATES' || normalized === 'UNITED STATES OF AMERICA') {
                      return 'United States of America';
                    }
                    return raw.toUpperCase();
                  };
                  const formatPhone = (value?: string) => {
                    if (!value) return value;
                    const raw = String(value);
                    const digitsOnly = raw.replace(/\D/g, '');
                    const normalized = digitsOnly.length === 11 && digitsOnly.startsWith('1') ? digitsOnly.slice(1) : digitsOnly;
                    if (normalized.length === 10) {
                      const area = normalized.slice(0, 3);
                      const exchange = normalized.slice(3, 6);
                      const line = normalized.slice(6);
                      return `(${area}) ${exchange}-${line}`;
                    }
                    if (normalized.length === 7) {
                      return `${normalized.slice(0, 3)}-${normalized.slice(3)}`;
                    }
                    return raw;
                  };
                  const join = (parts: Array<string | undefined | null>, sep: string) =>
                    parts.filter((p) => Boolean(p && String(p).trim().length)).map((p) => String(p)).join(sep);
                  const toTitleCase = (value?: string) => {
                    if (!value) return value;
                    const cased = String(value)
                      .toLowerCase()
                      .replace(/\b([a-z])(\w*)/g, (_: any, a: string, b: string) => a.toUpperCase() + b);
                    return cased.replace(/ Llc\b/g, ' LLC');
                  };

                  return (
                    <Row className="mb-2">
                      <Col md="12" className="px-2">
                        <div className="mt-3" style={{ borderTop: '1px solid #dee2e6', paddingTop: '1rem' }}>
                          <div className="fw-semibold mb-2">DOT Lookup Results</div>
                          <div className="d-flex justify-content-between align-items-start flex-wrap">
                            {tokens.length > 0 && (
                              <div className="mb-2" style={{ minWidth: 240 }}>
                                {checks.map(({ key, label }) => {
                                  const status = getStatus(key);
                                  return (
                                    <div key={key} className="d-flex align-items-center mb-1">
                                      <div style={{ width: 140 }}>{label}</div>
                                      {status === true && (
                                        <span className="badge bg-success">Match</span>
                                      )}
                                      {status === false && (
                                        <span className="badge bg-danger">No match</span>
                                      )}
                                      {status === null && (
                                        <span className="badge bg-secondary">Unknown</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            {dotVerifyRaw && (
                              <div style={{ flex: 1, minWidth: 280 }} className="text-start">
                                {(() => {
                                  const data: any = (dotVerifyRaw as any)?.records ?? dotVerifyRaw;
                                  const records: any[] = Array.isArray(data) ? data : (data ? [data] : []);
                                  if (records.length === 0) {
                                    return (
                                      <div className="text-muted">
                                        No records found for this DOT number.
                                      </div>
                                    );
                                  }
                                  const validRecords = records.filter(rec => rec && Object.keys(rec || {}).length > 0);
                                  if (validRecords.length === 0) {
                                    return (
                                      <div className="text-muted">
                                        No records found for this DOT number.
                                      </div>
                                    );
                                  }
                                  return (
                                    <div>
                                      {validRecords.map((rec: any, idx: number) => {
                                        const phyCityStateZip = join([
                                          toTitleCase(rec?.phy_city),
                                          join([String(rec?.phy_state || '').toUpperCase(), rec?.phy_zip], ' '),
                                        ], ', ');
                                        const mailingCityStateZip = join([
                                          toTitleCase(rec?.carrier_mailing_city),
                                          join([String(rec?.carrier_mailing_state || '').toUpperCase(), rec?.carrier_mailing_zip], ' '),
                                        ], ', ');
                                        const phyStreet = toTitleCase(rec?.phy_street);
                                        const phyCountryDisplay = formatCountry(rec?.phy_country);
                                        const addressString = join([
                                          phyStreet,
                                          phyCityStateZip,
                                          phyCountryDisplay,
                                        ], ', ');
                                        const mailingStreet = toTitleCase(rec?.carrier_mailing_street);
                                        const mailingCountryDisplay = formatCountry(rec?.carrier_mailing_country);
                                        const mailingAddressString = join([
                                          mailingStreet,
                                          mailingCityStateZip,
                                          mailingCountryDisplay,
                                        ], ', ');
                                        const areAddressesIdentical = Boolean(addressString) && Boolean(mailingAddressString) && addressString === mailingAddressString;
                                        return (
                                          <div key={idx} className="mb-2">
                                            <div className="fw-semibold">Company Name</div>
                                            <div className="mb-1">{toTitleCase(rec?.legal_name) ?? ''}</div>
                                            <div className="fw-semibold">Address</div>
                                            <div className="mb-1">
                                              {phyStreet && <div>{phyStreet}</div>}
                                              {phyCityStateZip && <div>{phyCityStateZip}</div>}
                                              {phyCountryDisplay && <div>{phyCountryDisplay}</div>}
                                            </div>
                                            {!areAddressesIdentical && mailingAddressString && (
                                              <>
                                                <div className="fw-semibold">Mailing Address</div>
                                                <div className="mb-1">
                                                  {mailingStreet && <div>{mailingStreet}</div>}
                                                  {mailingCityStateZip && <div>{mailingCityStateZip}</div>}
                                                  {mailingCountryDisplay && <div>{mailingCountryDisplay}</div>}
                                                </div>
                                              </>
                                            )}
                                            <div className="fw-semibold">Phone</div>
                                            <div className="mb-1">{formatPhone(rec?.phone) ?? ''}</div>
                                            <div className="fw-semibold">Email Address</div>
                                            <div>{rec?.email_address ?? ''}</div>
                                            {idx < validRecords.length - 1 && <hr className="my-2" />}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  );
                })()}
              </>
            )}
          </Section>
          </div>
        </Col>
      </Row>

      {/* Demographic Information */}
      <Row>
        <Col md="12" className="p-2">
          <div className="df-modern-section">
          <Section title="Demographic Information">
            <Row>
              <Col md="3" className="px-2">
                <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="Marital Status" name="meta.marital_status" placeholder="Select" options={["Single","Married","Divorced","Widowed"]} formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="Ethnicity" name="meta.ethnicity" placeholder="Select" options={["White","Black or African American","Asian","American Indian or Alaska Native","Native Hawaiian or Other Pacific Islander","Other"]} formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="Gender" name="meta.gender" placeholder="Select" options={["Male","Female","Non-binary","Prefer not to say"]} formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="Veteran Status" name="meta.veteran_status" placeholder="Select" options={["Yes","No","Prefer not to say"]} formik={form} />
              </Col>
            </Row>
            <Row>
              <Col md="3" className="px-2">
                <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="HIGHEST_DEGREE" name="highest_degree" placeholder="SELECT_HIGHEST_DEGREE" formik={form} labelPrefix="EducationLevel" enumType={EducationLevel} />
              </Col>
            </Row>
          </Section>
          </div>
        </Col>
      </Row>

      

      {/* Licensing & Certification (optional) */}
      {props?.showLicensing !== false && (
      <Row>
        <Col md="12" className="p-2">
          <Section title="Licensing & Certification">
            <Row className="px-3">
              <BaseSelect className="col-6" readOnly={Boolean(entity?.is_hired)} required={Boolean(form.values?.license_number)} label="CDL_TYPE" name="license_type" displayPlaceholder placeholder="SELECT_CDL_TYPE" labelPrefix="DriverLicenseType" enumType={DriverLicenseType} formik={form} />
              <BaseInput className="col-6" readOnly={Boolean(entity?.is_hired)} label="years_cdl_experience" name="years_cdl_experience" type="number" placeholder="ENTER_YEARS_OF_CDL" formik={form} />
            </Row>
            <Row className="px-3">
              <BaseCheck className="col-12 mt-2" disabled={Boolean(entity?.is_hired)} label="OWNER_OPERATOR" name="is_owner_operator" formik={form} />
            </Row>
            {Boolean(form.values.is_owner_operator) && (
              <Row className="px-3">
                <BaseInput readOnly={Boolean(entity?.is_hired)} className="col-6" label="BUSINESS_NAME" name={`extras[${form.values?.extras?.findIndex((v) => v.type == ApplicantExtras.BUSINESS_NAME)}].value`} formik={form} />
                <BaseInput readOnly={Boolean(entity?.is_hired)} className="col-6" name={`extras[${form.values?.extras?.findIndex((v) => v.type == ApplicantExtras.DOT_NUMBER)}].value`} label="DOT_NUMBER" formik={form} />
              </Row>
            )}

            <Row className="px-3">
              <BaseCheckList className="col-12" disabled={Boolean(entity?.is_hired)} label="ENDORSEMENTS" name="endorsements" labelPrefix="DriverEndorsement" enumType={DriverEndorsement} formik={form} cols="2" />
              {form.values?.endorsements?.includes(DriverEndorsement.OTHER) && (
                <BaseInput readOnly={Boolean(entity?.is_hired)} className="col-12" label="OTHER_ENDORSEMENTS" required name="endorsements_other" displayPlaceholder formik={form} />
              )}
            </Row>

            {/* Highest degree moved to Demographic Information */}

            <Row className="px-3">
              <BaseCheckList disabled={Boolean(entity?.is_hired)} className="col-12 p-1 " label="License_Restrictions" name="license_restrictions" labelPrefix="LicenseRestrictions" enumType={LicenseRestrictions} formik={form} cols="2" />
              {form.values?.license_restrictions?.includes(LicenseRestrictions.OTHER) && (
                <BaseInput readOnly={Boolean(entity?.is_hired)} className="col-12" label="OTHER_LICENSE_RESTRICTIONS" required name="license_restrictions_other" displayPlaceholder formik={form} />
              )}
            </Row>

            {/* Additional CDL numbers */}
            <Row className="px-3">
              {form.values?.extras?.find((v) => v.type == ApplicantExtras.CDL_NUMBER)?.value?.map((item, i) => (
                <div key={i} className={`my-1 col-12`}>
                  <div className="Row horizontalRow"></div>
                  <div className=" d-flex justify-content-start align-items-end">
                    <BaseInput
                      name={`extras[${form.values?.extras?.findIndex((v) => v.type == ApplicantExtras.CDL_NUMBER)}].value[${i}].license_number`}
                      className="col-11"
                      placeholder="ENTER_ADDITIONAL_LICENSE"
                      label="ADDTIONAL_LICENSE_NUMBER"
                      required
                      formik={form}
                      readOnly={Boolean(entity?.is_hired)}
                      onChange={handleLicenseNumberChange}
                    />
                    <div>
                      <a
                        href="#"
                        onClick={() => {
                          const extras = form.values?.extras || [];
                          form.setValues({
                            ...form.values,
                            extras: extras?.map((v) =>
                              v.type == ApplicantExtras.CDL_NUMBER
                                ? { ...v, value: [...v?.value?.filter((_, index) => index !== i)] }
                                : v
                            ),
                          });
                        }}
                      >
                        <DashCircle color="red" />
                      </a>
                    </div>
                  </div>
                  <Row className="px-3">
                    <BaseInput readOnly={Boolean(entity?.is_hired)} className="col-6" type="date" name={`extras[${form.values?.extras?.findIndex((v) => v.type == ApplicantExtras.CDL_NUMBER)}].value[${i}].date`} placeholder="expiration_date" label="expiration_date" required formik={form} />
                    <StateSelect readOnly={Boolean(entity?.is_hired)} className="col-6" name={`extras[${form.values?.extras?.findIndex((v) => v.type == ApplicantExtras.CDL_NUMBER)}].value[${i}].state`} placeholder="SELECT_ISSUE_STATE" label="state_issued" required formik={form} />
                  </Row>
                </div>
              ))}
              {!Boolean(entity?.is_hired) && (
                <Row className="my-3 px-4">
                  <Button
                    className="ml-3 float-end"
                    size="sm"
                    onClick={() => {
                      const extras = form.values?.extras || [];
                      form.setValues({
                        ...form.values,
                        extras: extras?.map((v) =>
                          v.type == ApplicantExtras.CDL_NUMBER ? { ...v, value: [...(v.value || []), new CdlExtras()] } : v
                        ),
                      });
                    }}
                  >
                    <PlusCircle className="me-2" /> {t("ADD_ANOTHER_LICENSE")}
                  </Button>
                </Row>
              )}
            </Row>
          </Section>
        </Col>
      </Row>
      )}

      {/* Optional custom content inserted immediately after Licensing & Certification */}
      {props?.afterLicensing && (
        <Row>
          <Col md="12" className="p-2">
            {props.afterLicensing}
          </Col>
        </Row>
      )}

      {/* Preferences (optional) */}
      {props?.showPreferences !== false && (
        <Row>
          <Col md="12" className="p-2">
            <Section title="Preferences">
              <Row className="px-3">
                <BaseCheck className="col-12 mt-2" disabled={Boolean(entity?.is_hired)} label="AUTHORIZED_TO_WORK_IN_THE_US" name="authorized_to_work_in_us" formik={form} />
                <BaseCheckList className="col-12 mt-2" disabled={Boolean(entity?.is_hired)} label="PREFERRED_LOCATION" name="preferred_location" formik={form} labelPrefix="JobGeography" enumType={JobGeography} />
                <BaseCheckList className="col-12 mt-2" disabled={Boolean(entity?.is_hired)} label="ROUTE_TYPE" name={`routes`} formik={form} labelPrefix="JobSchedule" enumType={JobSchedule} />
                {form.values?.id && (
                  <BaseSelect className="col-12 mt-2" readOnly={Boolean(entity?.is_hired)} name={`current_application_status`} required placeholder="APPLICANT_CURRENT_STATUS" label="APPLICANT_CURRENT_STATUS" labelPrefix="ApplicantStatus" enumType={ApplicantStatus} formik={form} />
                )}
              </Row>
            </Section>
          </Col>
        </Row>
      )}

      <Row>
        <Col md="12" className="p-2">
          {!props?.hideActions && (
            <div style={{ display: "flex", justifyContent: "right" }}>
              <Button disabled={form.isSubmitting || isSubmitting} type="submit" className="theme-secondary-btn">
                {t("UPDATE")}
              </Button>
            </div>
          )}
        </Col>
      </Row>
      {/* Referral Source UI omitted */}
    </Form>
  );
}


