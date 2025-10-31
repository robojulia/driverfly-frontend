import { useFormik } from "formik";
import { useEffect, useState } from "react";
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
import ViewCard from "../../view-details/view-card";
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

  const form = useFormik({
    initialValues: new ApplicantEntity(),
    validationSchema: ApplicantEntity.yupSchemaForApplicantBasicDetailsForm(),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      values.extras = values.extras?.filter((v) => v.value != undefined || v.value != null);
      if ("jobs" in values) delete values.jobs;
      try {
        if (entity?.id) {
          values = await applicantApi.update(entity.id, { ...values } as ApplicantEntity);
        } else {
          values = await applicantApi.create(values);
        }
        formSuccess(t, entity?.id ? "update" : "create", "APPLICANT");
        setEntity(values);
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

    if (!!entity?.id) {
      form.setValues({ ...entity, extras });
    } else {
      await form.setValues({ ...new ApplicantEntity(), type: ApplicantType.COMPANY, extras });
    }
  }, [entity]);

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
    <Form onSubmit={form.handleSubmit} className={className} onReset={form.handleReset}>
      {/* Basic Information */}
      <Row>
        <Col md="12" className="p-2 mt-2">
          <ViewCard title="Basic Information">
            <Row className="mb-2">
              <Col md="6" className="px-2">
                <BaseSelect
                  className="col-12 my-2"
                  readOnly={Boolean(isSuperAdmin) || Boolean(isCompanyAdmin) || Boolean(entity?.is_hired)}
                  label="ASSIGNED_RECRUITER"
                  name="assignedUserId"
                  displayPlaceholder
                  options={companyUsers}
                  valueKey="id"
                  createLabel={(c) => `${c.name} (#${c.id}) `}
                  formik={form}
                />
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="FIRST_NAME" required name="first_name" placeholder="ENTER_FIRST_NAME" formik={form} />
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="LAST_NAME" required name="last_name" placeholder="ENTER_LAST_NAME" formik={form} />
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="BIRTHDATE" type="date" name="birthdate" placeholder="MM/DD/YYYY" formik={form} max={OldThan18Year} />
                <BaseInputPhone className="col-12" readOnly={Boolean(entity?.is_hired)} label="PHONE" name="phone" required placeholder="ENTER_PHONE" formik={form} />
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="EMAIL" type="email" name="email" placeholder="ENTER_EMAIL" formik={form} />
              </Col>
              <Col md="6" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="driver's_license_number" name="license_number" placeholder="ENTER_DRIVER_LICENSE" formik={form} onChange={handleLicenseNumberChange} />
                <Row className="px-3">
                  <BaseInput className="col-6" readOnly={Boolean(entity?.is_hired)} label="expiration_date" name="license_expiry" min={new Date(current_date.getFullYear(), current_date.getMonth() + 6, current_date.getDate()).toLocaleString("en-US", { timeZone: "America/New_York" }).split("T")[0]} type="date" placeholder="expiration_date" formik={form} />
                  <StateSelect className="col-6" readOnly={Boolean(entity?.is_hired)} label="state_issued" name="license_state" placeholder="SELECT_ISSUE_STATE" formik={form} />
                </Row>
                <div className="col-12 my-3">
                  <label>{t("SOCIAL_SECURITY_NUMBER")}</label>
                  <SSNDisplay applicantId={entity?.id} last4={(entity as any)?.ssn_last4} className="mt-1" />
                </div>
              </Col>
            </Row>
          </ViewCard>
        </Col>
      </Row>

      {/* Current Address */}
      <Row>
        <Col md="12" className="p-2">
          <ViewCard title="Current Address">
            <Row>
              <Col md="6" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="ADDRESS_LINE_1" name="address_1" placeholder="ENTER_ADDRESS_LINE1" formik={form} />
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="ADDRESS_LINE_2" name="address_2" placeholder="ENTER_ADDRESS_LINE2" formik={form} />
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} label="CITY" name="city" placeholder="ENTER_CITY" formik={form} />
              </Col>
              <Col md="6" className="px-2">
                <Row className="px-3">
                  <StateSelect className="col-6" readOnly={Boolean(entity?.is_hired)} label="STATE" name="state" placeholder="SELECT_STATE" formik={form} />
                  <BaseInput className="col-6" readOnly={Boolean(entity?.is_hired)} label="ZIP_CODE" name="zip_code" placeholder="ENTER_ZIP_CODE" formik={form} />
                </Row>
              </Col>
            </Row>
          </ViewCard>
        </Col>
      </Row>

      {/* Licensing & Certification */}
      <Row>
        <Col md="12" className="p-2">
          <ViewCard title="Licensing & Certification">
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

            <Row className="px-3">
              <BaseSelect className="col-12" readOnly={Boolean(entity?.is_hired)} label="HIGHEST_DEGREE" name="highest_degree" placeholder="SELECT_HIGHEST_DEGREE" formik={form} labelPrefix="EducationLevel" enumType={EducationLevel} />
            </Row>

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
          </ViewCard>
        </Col>
      </Row>

      {/* Optional custom content inserted immediately after Licensing & Certification */}
      {props?.afterLicensing && (
        <Row>
          <Col md="12" className="p-2">
            {props.afterLicensing}
          </Col>
        </Row>
      )}

      {/* Preferences */}
      <Row>
        <Col md="12" className="p-2">
          <ViewCard title="Preferences">
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
          </ViewCard>
        </Col>
      </Row>

      {/* Emergency Contact */}
      <Row>
        <Col md="12" className="p-2">
          <ViewCard title="Emergency Contact Information">
            <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} name={`emergency_contact_name`} label="NAME" placeholder="ENTER_EMERGENCY_CONTACT" formik={form} />
            <BaseInputPhone className="col-12" readOnly={Boolean(entity?.is_hired)} name={`emergency_contact_number`} label="PHONE" placeholder="PHONE" formik={form} />
            <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} name={`emergency_contact_relationship`} label="RELATIONSHIP" placeholder="ENTER_EMERGENCY_CONTACT_RELATIONSHIP" formik={form} />
          </ViewCard>
        </Col>
      </Row>

      {/* Notes */}
      <Row>
        <Col md="12" className="p-2">
          <ViewCard title="Notes">
            <div className="col-12 mt-2">
              <BaseTextArea readOnly={Boolean(entity?.is_hired)} name="remarks" placeholder="Add a remark" formik={form} />
            </div>
          </ViewCard>
        </Col>
      </Row>

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


