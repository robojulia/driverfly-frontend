import { useFormik } from "formik";
import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { toast } from "react-toastify";

import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { LicenseRestrictions } from "../../../enums/applicants/applicant-license-restrictions-type.enum";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";
import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { JobSchedule } from "../../../enums/jobs/job-schedule.enum";
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
import ApplicantApi from "../../../pages/api/applicant";
import UserApi from "../../../pages/api/user";
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
import { BaseFormProps } from "./base-form-props";
import SSNDisplay from "../../shared/SSNDisplay";
import { JobCapability } from "./job-capability";

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
  // Referral source UI intentionally omitted in the new layout
  const [canPerformJob, setCanPerformJob] = useState<boolean>(true);
  const [jobLimitationIndex, setJobLimitationIndex] = useState<number>(-1);
  const [initialized, setInitialized] = useState(false);

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

    const jobCapabilityExtra = entity?.extras?.find((v) => v.type == ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB);
    if (jobCapabilityExtra && !extras.find((v) => v.type == ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB)) {
      extras.push(jobCapabilityExtra);
    }

    // Extract meta fields from extras into a meta object for easier form handling
    const meta = {
      middle_name: extras?.find((e) => e.type === ApplicantExtras.MIDDLE_NAME)?.value || '',
      suffix: extras?.find((e) => e.type === ApplicantExtras.SUFFIX)?.value || '',
      alternative_phone: extras?.find((e) => e.type === ApplicantExtras.ALTERNATIVE_PHONE)?.value || '',
      authorized_to_work: extras?.find((e) => e.type === ApplicantExtras.AUTHORIZED_TO_WORK)?.value || '',
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
      form.setValues({ ...entity, extras, meta } as any);
      setInitialized(true);
    } else {
      await form.setValues({ ...new ApplicantEntity(), type: ApplicantType.COMPANY, extras, meta } as any);
    }
  }, [entity?.id, initialized]);

  useEffectAsync(async () => {
    const userApi = new UserApi();
    const data = await userApi.list();
    setCompanyUsers(data?.filter((u) => u.status == Status.ACTIVE));
  }, []);

  const today = new Date();
  const OldThan18Year = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toLocaleString("en-US", { timeZone: "America/New_York" })
    .split("T")[0];

  useEffect(() => focusOnErrorField(form), [form.submitCount]);

  // Keep a ref to always have the latest form instance
  const formRef = useRef(form);
  formRef.current = form;

  // Register getter function that returns CURRENT form values when called
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
        if (meta.authorized_to_work) currentExtras.push({ type: ApplicantExtras.AUTHORIZED_TO_WORK, value: meta.authorized_to_work } as any);
        if (meta.marital_status) currentExtras.push({ type: ApplicantExtras.MARITAL_STATUS, value: meta.marital_status } as any);
        if (meta.race) currentExtras.push({ type: ApplicantExtras.RACE, value: meta.race } as any);
        if (meta.citizenship_status) currentExtras.push({ type: ApplicantExtras.CITIZENSHIP_STATUS, value: meta.citizenship_status } as any);
        if (meta.country) currentExtras.push({ type: ApplicantExtras.COUNTRY, value: meta.country } as any);
        if (meta.ethnicity) currentExtras.push({ type: ApplicantExtras.ETHNICITY, value: meta.ethnicity } as any);
        if (meta.gender) currentExtras.push({ type: ApplicantExtras.GENDER, value: meta.gender } as any);
        if (meta.veteran_status) currentExtras.push({ type: ApplicantExtras.VETERAN_STATUS, value: meta.veteran_status } as any);
        
        // Return ONLY fields managed by this form (CDL fields are handled by licensing form)
        return {
          first_name: formRef.current.values.first_name,
          last_name: formRef.current.values.last_name,
          phone: formRef.current.values.phone,
          email: formRef.current.values.email,
          address_1: formRef.current.values.address_1,
          city: formRef.current.values.city,
          state: formRef.current.values.state,
          zip_code: formRef.current.values.zip_code,
          birthdate: formRef.current.values.birthdate,
          extras: currentExtras,
        };
      };
    }
  }, []);

  const handleLicenseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseValue = e.target.value.toUpperCase();
    form.setFieldValue(e.target.name, uppercaseValue);
  };

  const handleCanPerformJobChange = (canPerform: boolean) => {
    setCanPerformJob(canPerform);
    const extrasArray = [...(form.values?.extras || [])];
    const currentExtraIndex = form.values?.extras?.findIndex((v) => v.type === ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB);

    if (canPerform) {
      if (currentExtraIndex !== -1) {
        const filteredExtras = extrasArray.filter((_, index) => index !== currentExtraIndex);
        form.setFieldValue("extras", filteredExtras);
        setJobLimitationIndex(-1);
      }
    } else {
      if (currentExtraIndex !== -1) {
        setJobLimitationIndex(currentExtraIndex);
      } else {
        const newExtra = new ApplicantExtrasEntity(ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB);
        extrasArray.push(newExtra);
        form.setFieldValue("extras", extrasArray);
        setJobLimitationIndex(extrasArray.length - 1);
      }
    }
  };

  useEffect(() => {
    const extraIndex = form.values?.extras?.findIndex((v) => v.type === ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB);
    setJobLimitationIndex(extraIndex);
    const hasLimitation = extraIndex !== -1 && form.values?.extras[extraIndex]?.value;
    setCanPerformJob(!hasLimitation);
  }, [form.values?.extras]);

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
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Middle Name" name="meta.middle_name" />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Last Name" required name="last_name" placeholder="Doe" formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Suffix" name="meta.suffix" />
              </Col>
            </Row>
            
            {/* SSN, Phone, Alternative Phone, Email */}
            <Row className="mb-2">
              <Col md="3" className="px-2">
                <div className="col-12">
                  <label>
                    {t("Social Security Number")}:
                  </label>
                  <br />
                  <SSNDisplay applicantId={entity?.id} last4={(entity as any)?.ssn_last4} />
                </div>
              </Col>
              <Col md="3" className="px-2">
                <div style={{ maxWidth: '100%' }}>
                  <BaseInputPhone className="col-12" readOnly={Boolean(entity?.is_hired)} label="Phone Number" name="phone" placeholder="(555) 987-6543" formik={form} />
                </div>
              </Col>
              <Col md="3" className="px-2">
                <div style={{ maxWidth: '100%' }}>
                  <BaseInputPhone className="col-12" readOnly={Boolean(entity?.is_hired)} label="Alternative Phone Number" name="meta.alternative_phone" placeholder="(555) 987-6543" />
                </div>
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Email" type="email" name="email" placeholder="john.doe@example.com" formik={form} />
              </Col>
            </Row>

            {/* Street Address, City, State, Zip */}
            <Row className="mb-2">
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Street Address" name="address_1" placeholder="120 Folsom St." formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="City" name="city" placeholder="Atlanta" formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <StateSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="State" name="state" placeholder="Select state" formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Zip Code" name="zip_code" placeholder="83202" formik={form} />
              </Col>
            </Row>

            {/* Date of Birth, Age, Authorized to work */}
            <Row className="mb-2">
              <Col md="3" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="Date of Birth" type="date" name="birthdate" placeholder="mm / dd / yyyy" formik={form} max={OldThan18Year} />
              </Col>
              <Col md="3" className="px-2">
                <BaseInput className="col-12" label="Age" type="number" name="meta.age" value={(function(){
                  const v:any = form?.values as any; const d = v?.birthdate ? new Date(v.birthdate as any) : null; if(!d||isNaN(d as any)) return ""; const today = new Date(); let age = today.getFullYear()-d.getFullYear(); const m=today.getMonth()-d.getMonth(); if(m<0 || (m===0 && today.getDate()<d.getDate())) age--; return String(age);
                })()} readOnly />
              </Col>
              <Col md="3" className="px-2">
                <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="Authorized to work in the US?" name="meta.authorized_to_work" placeholder="Select" options={["Yes","No"]} formik={form} />
              </Col>
            </Row>

            {/* Fourth row - Additional fields */}
            <Row className="mb-2">
              <Col md="3" className="px-2">
                <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="Marital Status" name="meta.marital_status" placeholder="Select" options={["Single","Married","Divorced","Widowed"]} formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="Race" name="meta.race" placeholder="Select" options={["White","Black or African American","Asian","American Indian or Alaska Native","Native Hawaiian or Other Pacific Islander","Other"]} formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="Citizenship Status" name="meta.citizenship_status" placeholder="Select" options={["U.S. Citizen","Permanent Resident","Work Visa","Other"]} formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="Country" name="meta.country" placeholder="Select country" options={["United States","Canada","Mexico"]} formik={form} />
              </Col>
            </Row>
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
                <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="Ethnicity" name="meta.ethnicity" placeholder="Select" options={["Hispanic or Latino","Not Hispanic or Latino"]} formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="Gender" name="meta.gender" placeholder="Select" options={["Male","Female","Non-binary","Prefer not to say"]} formik={form} />
              </Col>
              <Col md="3" className="px-2">
                <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="Veteran Status" name="meta.veteran_status" placeholder="Select" options={["Yes","No","Prefer not to say"]} formik={form} />
              </Col>
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
                    <PlusCircle /> {t("ADD_ANOTHER_LICENSE")}
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

              {/* Job Capability Component */}
              <Row className="px-3">
                <JobCapability
                  canPerformJob={canPerformJob}
                  onCanPerformJobChange={handleCanPerformJobChange}
                  reasonIndex={jobLimitationIndex}
                  formik={form}
                  disabled={Boolean(entity?.is_hired)}
                />
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


