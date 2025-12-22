import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { toast } from "react-toastify";

import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { LicenseRestrictions } from "../../../enums/applicants/applicant-license-restrictions-type.enum";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";
import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { ApplicantEntryMode } from "../../../enums/applicants/applicant-entry-mode.enum";
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
import { ReferralSourceEntity } from "../../../models/referral-source/referral-source.entity";
import { UserEntity } from "../../../models/user/user.entity";
import ApplicantApi from "../../../pages/api/applicant";
import { ReferralSourceApi } from "../../../pages/api/referral-source";
import UserApi from "../../../pages/api/user";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { buildReferral } from "../../../utils/common";
import { focusOnErrorField } from "../../../utils/form-error";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import ViewSuggestedJobs from "../../applicants/view-suggested-jobs";
import ViewCard from "../../view-details/view-card";
import ViewModal from "../../view-details/view-modal";
import { ReferralSourceForm } from "../admin/referral-source-form";
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

export interface ApplicantBasicDetailsFormProps
  extends BaseFormProps<ApplicantEntity> {
  isSubmitting: boolean;
  setIsSubmitting(value: boolean): void;
}

export function ApplicantBasicDetailsForm(
  props: ApplicantBasicDetailsFormProps
) {
  let { className, entity, setEntity, isSubmitting, setIsSubmitting } = props;
  let { user, isSuperAdmin, isCompanyAdmin } = useAuth();
  const { t } = useTranslation();
  const current_date = new Date();

  const applicantApi = new ApplicantApi();
  const referralSourceApi = new ReferralSourceApi();

  const [companyUsers, setCompanyUsers] = useState<UserEntity[]>([]);
  const [referralSources, setReferralSources] = useState<
    ReferralSourceEntity[]
  >([]);
  const [canCreateReferral, setCanCreateReferral] = useState<boolean>();
  const [createReferral, setCreateReferral] = useState<boolean>(false);
  const [canPerformJob, setCanPerformJob] = useState<boolean>(true);
  const [jobLimitationIndex, setJobLimitationIndex] = useState<number>(-1);

  const form = useFormik({
    initialValues: new ApplicantEntity(),
    validationSchema: ApplicantEntity.yupSchemaForApplicantBasicDetailsForm(),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      values.extras = values.extras?.filter(
        (v) => v.value != undefined || v.value != null
      );
      if ("jobs" in values) delete values.jobs;
      try {
        if (entity?.id) {
          values = await applicantApi.update(entity.id, {
            ...values,
          } as ApplicantEntity);
        } else {
          values = await applicantApi.create(values);
        }

        formSuccess(t, entity?.id ? "update" : "create", "APPLICANT");
        setEntity(values);
        setIsSubmitting(false);
      } catch (e) {
        setIsSubmitting(false);
        if (
          !globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast })
        )
          formFailed(t, entity?.id ? "update" : "create", "APPLICANT");
      }
    },
  });

  const onReferralAdded = (referral: ReferralSourceEntity) => {
    form.setFieldValue(`referralSource.id`, referral.id);
    setReferralSources([...referralSources, referral]);
    setCreateReferral(false);
  };

  useEffectAsync(async () => {
    setCanCreateReferral(
      !!!entity?.referralSource?.id && !!user?.company_admin
    );
    let extras: ApplicantExtrasEntity[] = entity?.extras || [];

    extras = extras.filter(Boolean);
    if (!extras?.find((v) => v.type == ApplicantExtras.BUSINESS_NAME))
      extras?.push({
        ...new ApplicantExtrasEntity(),
        type: ApplicantExtras.BUSINESS_NAME,
      });
    if (!extras?.find((v) => v.type == ApplicantExtras.DOT_NUMBER))
      extras?.push({
        ...new ApplicantExtrasEntity(),
        type: ApplicantExtras.DOT_NUMBER,
      });
    if (!extras?.find((v) => v.type == ApplicantExtras.CDL_NUMBER))
      extras?.push({
        ...new ApplicantExtrasEntity(),
        type: ApplicantExtras.CDL_NUMBER,
      });

    // Ensure REASON_FOR_UNABLE_TO_PERFORM_JOB is properly handled
    const jobCapabilityExtra = entity?.extras?.find(
      (v) => v.type == ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
    );

    // Only include it if it exists and has a value
    if (
      jobCapabilityExtra &&
      !extras.find(
        (v) => v.type == ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
      )
    ) {
      extras.push(jobCapabilityExtra);
    }

    if (!!entity?.id) {
      form.setValues({
        ...entity,
        extras,
      });
    } else {
      await form.setValues({
        ...new ApplicantEntity(),
        type: ApplicantType.COMPANY,
        entry_mode: ApplicantEntryMode.MANUALLY_ADDED,
        extras,
      });
    }
  }, [entity]);

  useEffectAsync(async () => {
    const userApi = new UserApi();
    const data = await userApi.list();
    const ref_list = await referralSourceApi.list();
    setReferralSources(ref_list);
    setCompanyUsers(data?.filter((u) => u.status == Status.ACTIVE));
  }, []);

  const today = new Date();
  const OldThan18Year = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toLocaleString("en-US", { timeZone: "America/New_York" })
    .split("T")[0];

  useEffect(() => focusOnErrorField(form), [form.submitCount]);

  // Add a handler function to convert license numbers to uppercase
  const handleLicenseNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Convert input value to uppercase
    const uppercaseValue = e.target.value.toUpperCase();

    // Set the uppercase value in the form
    form.setFieldValue(e.target.name, uppercaseValue);
  };

  // Function to update the job capability state in the form
  const handleCanPerformJobChange = (canPerform: boolean) => {
    setCanPerformJob(canPerform);

    // Create a copy of the extras array to modify
    const extrasArray = [...(form.values?.extras || [])];
    const currentExtraIndex = form.values?.extras?.findIndex(
      (v) => v.type === ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
    );

    if (canPerform) {
      // User CAN perform the job
      if (currentExtraIndex !== -1) {
        // If the extra exists, remove it completely from the extras array
        const filteredExtras = extrasArray.filter(
          (_, index) => index !== currentExtraIndex
        );
        form.setFieldValue("extras", filteredExtras);
        setJobLimitationIndex(-1); // Reset the index since the extra is gone
      }
    } else {
      // User CANNOT perform the job
      if (currentExtraIndex !== -1) {
        // Extra exists, nothing to do here, just ensure the index is set
        setJobLimitationIndex(currentExtraIndex);
      } else {
        // Extra doesn't exist, create it
        const newExtra = new ApplicantExtrasEntity(
          ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
        );
        extrasArray.push(newExtra);
        form.setFieldValue("extras", extrasArray);

        // Update our state with the new index
        setJobLimitationIndex(extrasArray.length - 1);
      }
    }
  };

  // Update job capability states when form values change
  useEffect(() => {
    // Find the job capability extra
    const extraIndex = form.values?.extras?.findIndex(
      (v) => v.type === ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
    );

    // Update our state
    setJobLimitationIndex(extraIndex);

    // If we have a value, they cannot perform the job
    const hasLimitation =
      extraIndex !== -1 && form.values?.extras[extraIndex]?.value;
    setCanPerformJob(!hasLimitation);
  }, [form.values?.extras]);

  return (
    <Form
      onSubmit={form.handleSubmit}
      className={className}
      onReset={form.handleReset}
    >
      <Row>
        <Col md="12" className="p-2 mt-2">
          <ViewCard title="BASIC_DETAILS">
            <Row className="mb-2">
              <Col md="4" className="px-2">
                <BaseSelect
                  className="col-12 my-2"
                  readOnly={
                    Boolean(isSuperAdmin) ||
                    Boolean(isCompanyAdmin) ||
                    Boolean(entity?.is_hired)
                  }
                  label="ASSIGNED_RECRUITER"
                  name="assignedUserId"
                  displayPlaceholder
                  options={companyUsers}
                  valueKey="id"
                  createLabel={(c) => `${c.name} (#${c.id}) `}
                  formik={form}
                />
                <BaseInput
                  className="col-12"
                  readOnly={Boolean(entity?.is_hired)}
                  label="FIRST_NAME"
                  required
                  name="first_name"
                  placeholder="ENTER_FIRST_NAME"
                  formik={form}
                />
                <BaseInput
                  className="col-12"
                  readOnly={Boolean(entity?.is_hired)}
                  label="LAST_NAME"
                  required
                  name="last_name"
                  placeholder="ENTER_LAST_NAME"
                  formik={form}
                />
                <BaseInput
                  className="col-12"
                  readOnly={Boolean(entity?.is_hired)}
                  label="BIRTHDATE"
                  type="date"
                  name="birthdate"
                  placeholder="MM/DD/YYYY"
                  formik={form}
                  max={OldThan18Year}
                />
                <BaseInputPhone
                  className="col-12"
                  readOnly={Boolean(entity?.is_hired)}
                  label="PHONE"
                  name="phone"
                  required
                  placeholder="ENTER_PHONE"
                  formik={form}
                />
                <BaseInput
                  className="col-12"
                  readOnly={Boolean(entity?.is_hired)}
                  label="EMAIL"
                  type="email"
                  name="email"
                  placeholder="ENTER_EMAIL"
                  formik={form}
                />
                <BaseInput
                  className="col-12"
                  readOnly={Boolean(entity?.is_hired)}
                  label="ADDRESS_LINE_1"
                  name="address_1"
                  placeholder="ENTER_ADDRESS_LINE1"
                  formik={form}
                />
                <BaseInput
                  className="col-12"
                  readOnly={Boolean(entity?.is_hired)}
                  label="ADDRESS_LINE_2"
                  name="address_2"
                  placeholder="ENTER_ADDRESS_LINE2"
                  formik={form}
                />
                <BaseInput
                  className="col-12"
                  readOnly={Boolean(entity?.is_hired)}
                  label="CITY"
                  name="city"
                  placeholder="ENTER_CITY"
                  formik={form}
                />
                <Row className="px-3">
                  <StateSelect
                    className="col-6"
                    readOnly={Boolean(entity?.is_hired)}
                    label="STATE"
                    name="state"
                    placeholder="SELECT_STATE"
                    formik={form}
                  />
                  <BaseInput
                    className="col-6"
                    readOnly={Boolean(entity?.is_hired)}
                    label="ZIP_CODE"
                    name="zip_code"
                    placeholder="ENTER_ZIP_CODE"
                    formik={form}
                  />
                  <BaseCheck
                    readOnly
                    className="col-12 my-2"
                    disabled
                    label="AUTOMATED_RECRUITING_LEAD"
                    name={`is_automated_recruiting_lead`}
                    formik={form}
                  />
                  <BaseSelect
                    readOnly={Boolean(entity?.is_hired)}
                    className="col-12 p-0 px-lg-2"
                    label="LEAD_TYPE"
                    name="type"
                    formik={form}
                    displayPlaceholder
                    enumType={ApplicantType}
                    labelPrefix="ApplicantType"
                  />
                  <BaseSelect
                    readOnly
                    className="col-12 p-0 px-lg-2"
                    label="ENTRY_MODE"
                    name="entry_mode"
                    displayPlaceholder
                    formik={form}
                    placeholder="ENTRY_MODE"
                    enumType={ApplicantEntryMode}
                    labelPrefix="ApplicantEntryMode"
                  />
                  <BaseSelect
                    readOnly={Boolean(entity?.is_hired)}
                    className="col-12 p-0 px-lg-2"
                    label="REFERRAL_SOURCE"
                    name="referralSource.id"
                    displayPlaceholder
                    formik={form}
                    placeholder="SELECT_REFERREL_SOURCE"
                    valueKey="id"
                    createLabel={(v) => buildReferral(v)}
                    options={
                      !!referralSources?.length
                        ? referralSources.filter(
                            (v) =>
                              v.status == Status.ACTIVE ||
                              v.id == entity?.referralSource?.id
                          )
                        : referralSources
                    }
                    append={
                      !entity?.is_hired && (
                        <Button
                          variant="btn create_btn"
                          onClick={() => setCreateReferral(true)}
                        >
                          <PlusCircle /> {t("CREATE")}
                        </Button>
                      )
                    }
                  />
                </Row>
              </Col>
              <Col md="4" className="px-2">
                <BaseInput
                  readOnly={Boolean(entity?.is_hired)}
                  className="col-12"
                  label="driver's_license_number"
                  name="license_number"
                  placeholder="ENTER_DRIVER_LICENSE"
                  formik={form}
                  onChange={handleLicenseNumberChange}
                />
                <Row className="px-3">
                  <BaseInput
                    className="col-6"
                    readOnly={Boolean(entity?.is_hired)}
                    label="expiration_date"
                    name="license_expiry"
                    min={
                      new Date(
                        current_date.getFullYear(),
                        current_date.getMonth() + 6,
                        current_date.getDate()
                      )
                        .toLocaleString("en-US", {
                          timeZone: "America/New_York",
                        })
                        .split("T")[0]
                    }
                    type="date"
                    placeholder="expiration_date"
                    formik={form}
                  />
                  <StateSelect
                    className="col-6"
                    readOnly={Boolean(entity?.is_hired)}
                    label="state_issued"
                    name="license_state"
                    placeholder="SELECT_ISSUE_STATE"
                    formik={form}
                  />
                </Row>
                <div className="col-12 my-3">
                  <label>{t("SOCIAL_SECURITY_NUMBER")}</label>
                  <SSNDisplay applicantId={entity?.id} last4={(entity as any)?.ssn_last4} className="mt-1" />
                </div>
                <Row className="">
                  {form.values?.extras
                    ?.find((v) => v.type == ApplicantExtras.CDL_NUMBER)
                    ?.value?.map((entity, i) => (
                      <div key={i} className={`my-1`}>
                        <div className="Row horizontalRow"></div>
                        <div className=" d-flex justify-content-start align-items-end">
                          <BaseInput
                            name={`extras[${form.values?.extras?.findIndex(
                              (v) => v.type == ApplicantExtras.CDL_NUMBER
                            )}].value[${i}].license_number`}
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
                                  extras: extras?.map((item) =>
                                    item.type == ApplicantExtras.CDL_NUMBER
                                      ? {
                                          ...item,
                                          value: [
                                            ...item?.value?.filter(
                                              (val, index) => index !== i
                                            ),
                                          ],
                                        }
                                      : item
                                  ),
                                });
                              }}
                            >
                              <DashCircle color="red" />
                            </a>
                          </div>
                        </div>
                        <Row className="px-3">
                          <BaseInput
                            readOnly={Boolean(entity?.is_hired)}
                            className="col-6"
                            type="date"
                            name={`extras[${form.values?.extras?.findIndex(
                              (v) => v.type == ApplicantExtras.CDL_NUMBER
                            )}].value[${i}].date`}
                            placeholder="expiration_date"
                            label="expiration_date"
                            required
                            formik={form}
                          />
                          <StateSelect
                            readOnly={Boolean(entity?.is_hired)}
                            className="col-6"
                            name={`extras[${form.values?.extras?.findIndex(
                              (v) => v.type == ApplicantExtras.CDL_NUMBER
                            )}].value[${i}].state`}
                            placeholder="SELECT_ISSUE_STATE"
                            label="state_issued"
                            required
                            formik={form}
                          />
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
                            extras: extras?.map((item) =>
                              item.type == ApplicantExtras.CDL_NUMBER
                                ? {
                                    ...item,
                                    value: [
                                      ...(item.value || []),
                                      new CdlExtras(),
                                    ],
                                  }
                                : item
                            ),
                          });
                        }}
                      >
                        <PlusCircle /> {t("ADD_ANOTHER_LICENSE")}
                      </Button>
                    </Row>
                  )}
                </Row>

                <div className="Row horizontalRow"></div>
                <Row className="px-3">
                  <BaseSelect
                    className="col-6"
                    readOnly={Boolean(entity?.is_hired)}
                    required={Boolean(form.values?.license_number)}
                    label="CDL_TYPE"
                    name="license_type"
                    displayPlaceholder
                    placeholder="SELECT_CDL_TYPE"
                    labelPrefix="DriverLicenseType"
                    enumType={DriverLicenseType}
                    formik={form}
                  />
                  <BaseInput
                    className="col-6"
                    readOnly={Boolean(entity?.is_hired)}
                    label="years_cdl_experience"
                    name="years_cdl_experience"
                    type="number"
                    placeholder="ENTER_YEARS_OF_CDL"
                    formik={form}
                  />
                </Row>
                <BaseCheck
                  className="col-12 mt-2"
                  disabled={Boolean(entity?.is_hired)}
                  label="OWNER_OPERATOR"
                  name="is_owner_operator"
                  formik={form}
                />
                {Boolean(form.values.is_owner_operator) && (
                  <>
                    <BaseInput
                      readOnly={Boolean(entity?.is_hired)}
                      className="col-12"
                      label="BUSINESS_NAME"
                      name={`extras[${form.values?.extras?.findIndex(
                        (v) => v.type == ApplicantExtras.BUSINESS_NAME
                      )}].value`}
                      formik={form}
                    />
                    <BaseInput
                      readOnly={Boolean(entity?.is_hired)}
                      className="col-12"
                      name={`extras[${form.values?.extras?.findIndex(
                        (v) => v.type == ApplicantExtras.DOT_NUMBER
                      )}].value`}
                      label="DOT_NUMBER"
                      formik={form}
                    />
                  </>
                )}

                {/* Job Capability Component */}
                <JobCapability
                  canPerformJob={canPerformJob}
                  onCanPerformJobChange={handleCanPerformJobChange}
                  reasonIndex={jobLimitationIndex}
                  formik={form}
                  disabled={Boolean(entity?.is_hired)}
                />

                <BaseCheck
                  className="col-12 mt-2"
                  disabled={Boolean(entity?.is_hired)}
                  label="AUTHORIZED_TO_WORK_IN_THE_US"
                  name="authorized_to_work_in_us"
                  formik={form}
                />
                <BaseCheckList
                  className="col-12 mt-2"
                  disabled={Boolean(entity?.is_hired)}
                  label="PREFERRED_LOCATION"
                  name="preferred_location"
                  formik={form}
                  labelPrefix="JobGeography"
                  enumType={JobGeography}
                />
                <BaseCheckList
                  className="col-12 mt-2"
                  disabled={Boolean(entity?.is_hired)}
                  label="ROUTE_TYPE"
                  name={`routes`}
                  formik={form}
                  labelPrefix="JobSchedule"
                  enumType={JobSchedule}
                />

                {form.values?.id && (
                  <BaseSelect
                    className="col-12 mt-2"
                    readOnly={Boolean(entity?.is_hired)}
                    name={`current_application_status`}
                    required
                    placeholder="APPLICANT_CURRENT_STATUS"
                    label="APPLICANT_CURRENT_STATUS"
                    labelPrefix="ApplicantStatus"
                    enumType={ApplicantStatus}
                    formik={form}
                  />
                )}
                <div className="col-12 mt-2">
                  <label>{t("REMARKS")}</label>
                  <BaseTextArea
                    readOnly={Boolean(entity?.is_hired)}
                    name="remarks"
                    placeholder="Add a remark"
                    formik={form}
                  />
                </div>
              </Col>
              <Col md="4" className="px-2">
                <BaseCheckList
                  className="col-12"
                  disabled={Boolean(entity?.is_hired)}
                  label="TRANSMISSION_EXPERIENCE"
                  name="transmission_type"
                  labelPrefix="VehicleTransmissionType"
                  enumType={VehicleTransmissionType}
                  formik={form}
                  cols="2"
                />
                <BaseCheckList
                  className="col-12"
                  disabled={Boolean(entity?.is_hired)}
                  label="ENDORSEMENTS"
                  name="endorsements"
                  labelPrefix="DriverEndorsement"
                  enumType={DriverEndorsement}
                  formik={form}
                  cols="2"
                />
                {form.values?.endorsements?.includes(
                  DriverEndorsement.OTHER
                ) && (
                  <BaseInput
                    readOnly={Boolean(entity?.is_hired)}
                    className="col-12"
                    label="OTHER_ENDORSEMENTS"
                    required
                    name="endorsements_other"
                    displayPlaceholder
                    formik={form}
                  />
                )}
                <BaseSelect
                  className="col-12"
                  readOnly={Boolean(entity?.is_hired)}
                  label="HIGHEST_DEGREE"
                  name="highest_degree"
                  placeholder="SELECT_HIGHEST_DEGREE"
                  formik={form}
                  labelPrefix="EducationLevel"
                  enumType={EducationLevel}
                />
                <BaseCheckList
                  disabled={Boolean(entity?.is_hired)}
                  className="col-12 p-1 "
                  label="License_Restrictions"
                  name="license_restrictions"
                  labelPrefix="LicenseRestrictions"
                  enumType={LicenseRestrictions}
                  formik={form}
                  cols="2"
                />
                {form.values?.license_restrictions?.includes(
                  LicenseRestrictions.OTHER
                ) && (
                  <BaseInput
                    readOnly={Boolean(entity?.is_hired)}
                    className="col-12"
                    label="OTHER_LICENSE_RESTRICTIONS"
                    required
                    name="license_restrictions_other"
                    displayPlaceholder
                    formik={form}
                  />
                )}

                <Col xs="12" className="mt-2">
                  <ViewCard title="EMERGENCY_CONTACT">
                    <BaseInput
                      className="col-12"
                      readOnly={Boolean(entity?.is_hired)}
                      name={`emergency_contact_name`}
                      label="NAME"
                      placeholder="ENTER_EMERGENCY_CONTACT"
                      formik={form}
                    />

                    <BaseInputPhone
                      className="col-12"
                      readOnly={Boolean(entity?.is_hired)}
                      name={`emergency_contact_number`}
                      label="PHONE"
                      placeholder="PHONE"
                      formik={form}
                    />
                    <BaseInput
                      className="col-12"
                      readOnly={Boolean(entity?.is_hired)}
                      name={`emergency_contact_relationship`}
                      label="RELATIONSHIP"
                      placeholder="ENTER_EMERGENCY_CONTACT_RELATIONSHIP"
                      formik={form}
                    />
                  </ViewCard>
                </Col>
              </Col>
              <ViewModal
                title={t(
                  "CREATE_{name}",
                  { name: "REFERRAL_SOURCE" },
                  { translateProps: true }
                )}
                show={createReferral}
                onCloseClick={() => setCreateReferral(false)}
              >
                <ReferralSourceForm onSaveComplete={onReferralAdded} />
              </ViewModal>
            </Row>
            <div style={{ display: "flex", justifyContent: "right" }}>
              <Button
                disabled={form.isSubmitting || isSubmitting}
                type="submit"
                className="theme-secondary-btn"
              >
                {t("UPDATE")}
              </Button>
            </div>
          </ViewCard>
        </Col>
      </Row>
    </Form>
  );
}
