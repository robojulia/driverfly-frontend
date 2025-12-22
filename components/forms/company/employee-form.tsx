import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";

import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useUnsavedChangesWarning } from "../../../hooks/use-unsaved-changes-warning";
import { Button, Col, Row } from "react-bootstrap";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { JobEquipmentType } from "../../../enums/jobs/job-equipment-type.enum";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { DriverEndorsement } from "../../../enums/users/driver-endorsement.enum";
import { DriverLicenseType } from "../../../enums/users/driver-license-type.enum";
import { EducationLevel } from "../../../enums/users/education-level.enum";
import { VehicleTransmissionType } from "../../../enums/vehicles/vehicle-transmission-type.enum";
import { useAuth } from "../../../hooks/use-auth";
import { useTranslation } from "../../../hooks/use-translation";
import { CompanyManagerEntity } from "../../../models/company/company-manager.entity";
import { EmployeeEquipmentEntity } from "../../../models/employee/employee-equipment.entity";
import { EmployeeEntity } from "../../../models/employee/employee.entity";
import { UserEntity } from "../../../models/user/user.entity";
import CompanyApi from "../../../pages/api/company";
import EmployeeApi from "../../../pages/api/employee";
import UserApi from "../../../pages/api/user";
import EntityForm from "../../layouts/page/entity-form";
import ViewCard from "../../view-details/view-card";
import BaseCheck from "../base-check";
import BaseCheckList from "../base-check-list";
import BaseInput from "../base-input";
import BaseInputPhone from "../base-input-phone";
import BaseSelect from "../base-select";
import BaseTextArea from "../base-text-area";
import StateSelect from "../state-select";
import { BaseFormProps } from "./base-form-props";
import ViewModal from "../../view-details/view-modal";
import { ManagerForm } from "./manager-form";
import { EmployeeNotesForm } from "./employee-notes-form";

export interface EmployeeFormProps extends BaseFormProps<EmployeeEntity> {}

export function EmployeeForm(props: EmployeeFormProps) {
  let { className, entity, onSaveComplete, onSaveError } = props;
  let { user, hasPermission, isSuperAdmin } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const userApi = new UserApi();
  const employeeApi = new EmployeeApi();

  const goBack = () =>
    router.push("/dashboard/company/compliance/employee-directory");
  const today = new Date();
  const OldThan18Year = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const [companyUsers, setCompanyUsers] = useState<UserEntity[]>([]);
  const [managers, setManagers] = useState<CompanyManagerEntity[]>([]);
  const [createManager, setCreateManager] = useState<boolean>(false);

  const onManagerAdded = (manager: CompanyManagerEntity) => {
    form.setFieldValue(`managerId`, manager.id);
    setManagers([...managers, manager]);
    setCreateManager(false);
  };

  useEffectAsync(async () => {
    const companyApi = new CompanyApi();
    const data = await companyApi.manager.list();
    setManagers(data);
  }, [user]);

  const form = useFormik({
    initialValues: {
      ...new EmployeeEntity(),
      hr_notes: "",
    },
    validationSchema: EmployeeEntity.employeeFormYupSchema(),
    onSubmit: async (values) => {
      try {
        // Remove the manager object to avoid conflicts with managerId
        const { manager, job, ...submitValues } = values;
        const payload = {
          ...submitValues,
          jobId: values.jobId || values.job?.id,
          hr_notes: submitValues.hr_notes || '',
        };

        if (entity?.id) {
          const updatedEmployee = await employeeApi.update(entity.id, payload);
          // Reset dirty state after successful save to prevent unsaved changes warning
          form.resetForm({ values: { ...values, ...updatedEmployee, hr_notes: updatedEmployee.hr_notes || "" } });
        }

        formSuccess(t, entity?.id ? "update" : "create", "EMPLOYEE");
        goBack();
        // if (onSaveComplete) onSaveComplete(values);
      } catch (e) {
        console.error("Unable to save employee info", e);
        if (
          !globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast })
        )
          formFailed(t, entity?.id ? "update" : "create", "EMPLOYEE");

        if (onSaveError) onSaveError(e);
      }
    },
  });

  useEffect(() => {
    if (entity.id) {
      form.resetForm({
        values: {
          ...entity,
          jobId: entity.job?.id,
          managerId: entity?.manager?.id,
          hr_notes: entity.hr_notes || "",
        }
      });
    }
  }, [entity.id]);


  useEffectAsync(async () => {
    const data = await userApi.list();
    setCompanyUsers(data);
  }, []);

  useEffect(() => {
    try {
      const errorKeys = Object.keys(form.errors);

      if (!!errorKeys.length && form.submitCount > 0) {
        const errorKey = errorKeys[0];
        let id: string;

        if (
          typeof form.errors[errorKey] == "object" &&
          form.errors[errorKey]?.length > 0
        ) {
          id = `${errorKey}[0].${Object.keys(form.errors[errorKey][0])[0]}`;
        } else {
          id = `${errorKey}`;
        }

        const firstElement = document.getElementById(id);

        if (firstElement !== document.activeElement) {
          firstElement?.focus();
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [form.submitCount]);

  // Add a handler function to convert license numbers to uppercase
  const handleLicenseNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Convert input value to uppercase
    const uppercaseValue = e.target.value.toUpperCase();

    // Set the uppercase value in the form
    form.setFieldValue(e.target.name, uppercaseValue);
  };

  // Warn user about unsaved changes when navigating away
  const unsavedChangesWarning = useUnsavedChangesWarning({
    isDirty: form.dirty,
    shouldWarn: !form.isSubmitting,
  });

  return (
    <>
      {unsavedChangesWarning}
      <EntityForm
      id={entity?.id}
      formik={form}
      onSubmit={form.handleSubmit}
      className={className}
    >
      <div className="p-0 mt-3 ">
        <ViewCard title="BASIC_DETAILS">
          <Row className="mb-2">
            <Col md="4">
              <BaseSelect
                name={`managerId`}
                label="MANAGER"
                placeholder="MANAGER"
                displayPlaceholder={true}
                options={managers}
                labelKey="name"
                valueKey="id"
                formik={form}
                append={
                  <Button
                    variant="btn create_btn"
                    onClick={() => setCreateManager(true)}
                  >
                    <PlusCircle /> {t("CREATE")}
                  </Button>
                }
              />
            </Col>
            <Col md="4">
              <BaseInput
                readOnly
                className="col-12"
                label="HIRE_DATE"
                type="date"
                name="hire_date"
                placeholder="MM/DD/YYYY"
                formik={form}
              />
            </Col>
          </Row>
          <Row>
            <Col md="4" className="px-2">
              <BaseInput
                className="col-12"
                label="FIRST_NAME"
                name="first_name"
                placeholder="FIRST_NAME"
                formik={form}
              />
              <BaseInput
                className="col-12"
                label="LAST_NAME"
                name="last_name"
                placeholder="LAST_NAME"
                formik={form}
              />
              <BaseInput
                className="col-12"
                label="BIRTHDATE"
                type="date"
                name="birthdate"
                placeholder="MM/DD/YYYY"
                formik={form}
                max={OldThan18Year}
              />

              <BaseInputPhone
                className="col-12"
                label="PHONE"
                name="phone"
                placeholder="PHONE"
                formik={form}
              />
              <BaseInput
                className="col-12"
                label="EMAIL"
                type="email"
                name="email"
                placeholder="EMAIL"
                formik={form}
              />
              <BaseInput
                className="col-12"
                label="Address 1"
                name="address_1"
                placeholder="Address 1"
                formik={form}
              />
              <BaseInput
                className="col-12"
                label="Address 2"
                name="address_2"
                placeholder="Address 2"
                formik={form}
              />
              <BaseInput
                className="col-12"
                label="CITY"
                name="city"
                placeholder="CITY"
                formik={form}
              />
              <Row className="px-3">
                <StateSelect
                  className="col-6"
                  label="STATE"
                  name="state"
                  placeholder="STATE"
                  formik={form}
                />
                <BaseInput
                  className="col-6"
                  label="ZIP_CODE"
                  name="zip_code"
                  placeholder="ZIP_CODE"
                  formik={form}
                />
              </Row>
            </Col>
            <Col md="4" className="px-2">
              <BaseInput
                className="col-12"
                label="driver_license_number"
                name="license_number"
                placeholder="driver_license_number"
                formik={form}
                onChange={handleLicenseNumberChange}
              />
              <BaseInput
                className="col-12"
                label="expiration_date"
                name="license_expiry"
                type="date"
                placeholder="expiration_date"
                formik={form}
              />
              <Row className="px-3">
                <StateSelect
                  className="col-6"
                  label="state_issued"
                  name="license_state"
                  placeholder="state_issued"
                  formik={form}
                />
                <BaseSelect
                  className="col-6"
                  label="CDL_CLASS"
                  name="license_type"
                  displayPlaceholder
                  labelPrefix="DriverLicenseType"
                  enumType={DriverLicenseType}
                  formik={form}
                />
              </Row>
              <BaseInput
                className="col-12"
                label="years_cdl_experience"
                name="years_cdl_experience"
                type="number"
                placeholder="years_cdl_experience"
                formik={form}
              />
              <BaseCheck
                className="col-12 mt-2"
                label="OWNER_OPERATOR"
                name="is_owner_operator"
                formik={form}
              />
              <BaseCheck
                className="col-12 mt-2"
                label="AUTHORIZED_TO_WORK_IN_THE_US"
                name="authorized_to_work_in_us"
                formik={form}
              />
              <BaseCheckList
                className="col-12 mt-2"
                label="PREFERRED_LOCATION"
                name="preferred_location"
                formik={form}
                labelPrefix="JobGeography"
                enumType={JobGeography}
              />
            </Col>
            <Col md="4" className="px-2">
              <BaseCheckList
                className="col-12"
                label="TRANSMISSION_EXPERIENCE"
                name="transmission_type"
                labelPrefix="VehicleTransmissionType"
                enumType={VehicleTransmissionType}
                formik={form}
                cols="2"
              />
              <BaseCheckList
                className="col-12"
                label="ENDORSEMENTS"
                name="endorsements"
                labelPrefix="DriverEndorsement"
                enumType={DriverEndorsement}
                formik={form}
                cols="2"
              />
              <BaseSelect
                className="col-12"
                label="HIGHEST_DEGREE"
                name="highest_degree"
                placeholder="HIGHEST_DEGREE"
                formik={form}
                labelPrefix="EducationLevel"
                enumType={EducationLevel}
              />
              <Col xs="12" className="mt-2">
                <ViewCard title="EMERGENCY_CONTACT">
                  <BaseInput
                    className="col-12"
                    name={`emergency_contact_name`}
                    label="NAME"
                    placeholder="FULL_NAME"
                    formik={form}
                  />
                  <BaseInputPhone
                    className="col-12"
                    name={`emergency_contact_number`}
                    label="PHONE"
                    placeholder="PHONE"
                    formik={form}
                  />
                  <BaseInput
                    className="col-12"
                    name={`emergency_contact_relationship`}
                    label="RELATIONSHIP"
                    placeholder="RELATIONSHIP"
                    formik={form}
                  />
                </ViewCard>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col className="col-md-6">
              <Col xs="12" className="p-2 mt-2">
                <ViewCard
                  title="equipment_experience"
                  actions={
                    <Button
                      size="sm"
                      onClick={() =>
                        form.setValues({
                          ...form.values,
                          equipment_experience: [
                            ...(form.values.equipment_experience || []),
                            new EmployeeEquipmentEntity(),
                          ],
                        })
                      }
                    >
                      <PlusCircle /> {t("ADD")}
                    </Button>
                  }
                >
                  {form.values.equipment_experience?.length > 0 && (
                    <>
                      {form.values.equipment_experience.map((entity, i) => (
                        <Row key={i}>
                          <div className="col-md-6 mt-2">
                            <Col className="p-0">
                              <strong>{t("TYPE")}</strong>
                            </Col>

                            <BaseSelect
                              name={`equipment_experience[${i}].type`}
                              placeholder="TYPE"
                              labelPrefix="JobEquipmentType"
                              enumType={JobEquipmentType}
                              formik={form}
                            />
                          </div>
                          <div className="col-md-5 mt-2">
                            <Col className="p-0">
                              <strong>{t("YEARS")}</strong>
                            </Col>

                            <BaseInput
                              name={`equipment_experience[${i}].years`}
                              placeholder="YEARS"
                              type="int"
                              min="1"
                              formik={form}
                            />
                          </div>
                          {entity.type == JobEquipmentType.OTHER && (
                            <div>
                              <BaseInput
                                className="my-2"
                                name={`equipment_experience[${i}].type_other`}
                                placeholder="TYPE"
                                formik={form}
                              />
                            </div>
                          )}
                          <div className="pl-sm-1 pt-lg-2 col-lg-1 col-md-12">
                            <Col className="mt-4"></Col>
                            <a
                              href="#"
                              onClick={() =>
                                form.setValues({
                                  ...form.values,
                                  equipment_experience:
                                    form.values.equipment_experience.filter(
                                      (v, idx) => i != idx
                                    ),
                                })
                              }
                            >
                              <DashCircle color="red" />
                            </a>
                          </div>
                          <div className="12">
                            <hr />
                          </div>
                        </Row>
                      ))}
                    </>
                  )}
                </ViewCard>
              </Col>
            </Col>
            <Col md="6" className="px-2">
              {form.values.is_owner_operator && (
                <Col xs="12" className="mt-3">
                  <ViewCard
                    title="EQUIPMENT_OWNED"
                    actions={
                      <Button
                        size="sm"
                        onClick={() =>
                          form.setValues({
                            ...form.values,
                            equipment_owned: [
                              ...form.values.equipment_owned,
                              new EmployeeEquipmentEntity(),
                            ],
                          })
                        }
                      >
                        <PlusCircle /> {t("ADD")}
                      </Button>
                    }
                  >
                    {form.values.equipment_owned.length > 0 && (
                      <>
                        <Row className="d-sm-none d-md-flex">
                          <Col>
                            <strong>{t("TYPE")}</strong>
                          </Col>
                          <Col>
                            <strong>{t("QUANTITY")}</strong>
                          </Col>
                        </Row>
                        {form.values.equipment_owned.map((entity, i) => (
                          <Row key={i}>
                            <Col xs="12" className="d-sm-flex d-md-none">
                              <Col>
                                <strong>{t("TYPE")}</strong>
                              </Col>
                              <Col>
                                <strong>{t("QUANTITY")}</strong>
                              </Col>
                            </Col>
                            <Col xs="6">
                              <BaseSelect
                                name={`equipment_owned[${i}].type`}
                                placeholder="TYPE"
                                labelPrefix="JobEquipmentType"
                                enumType={JobEquipmentType}
                                formik={form}
                              />
                            </Col>
                            <Col xs="5">
                              <BaseInput
                                name={`equipment_owned[${i}].quantity`}
                                placeholder="QUANTITY"
                                type="int"
                                min="1"
                                formik={form}
                              />
                            </Col>
                            {entity.type == JobEquipmentType.OTHER && (
                              <Col xs="11">
                                <BaseInput
                                  name={`equipment_owned[${i}].type_other`}
                                  placeholder="TYPE"
                                  formik={form}
                                />
                              </Col>
                            )}
                            <Col xs="1">
                              <a
                                href="#"
                                onClick={() =>
                                  form.setValues({
                                    ...form.values,
                                    equipment_owned:
                                      form.values.equipment_owned.filter(
                                        (v, idx) => i != idx
                                      ),
                                  })
                                }
                              >
                                <DashCircle color="red" />
                              </a>
                            </Col>
                            <Col xs="12">
                              <hr />
                            </Col>
                          </Row>
                        ))}
                      </>
                    )}
                  </ViewCard>
                </Col>
              )}
            </Col>
          </Row>
        </ViewCard>
      </div>

      {/* HR Notes Section */}
      <Row className="px-2 mt-3">
        <Col md="12" className="p-0 px-lg-2">
          <EmployeeNotesForm entity={entity} setEntity={() => {}} />
        </Col>
      </Row>

      <ViewModal
        title={t("ASSIGN_TO_MANAGER")}
        show={createManager}
        onCloseClick={() => setCreateManager(false)}
      >
        <ManagerForm onSaveComplete={onManagerAdded} />
      </ViewModal>
    </EntityForm>
    </>
  );
}
