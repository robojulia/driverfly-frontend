import { Col, Row, Form as BsForm } from "react-bootstrap";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { BaseFormProps } from "./base-form-props";
import Section from "../../view-details/section";
import BaseSelect from "../base-select";
import BaseInput from "../base-input";
import BaseCheck from "../base-check";
import BaseCheckList from "../base-check-list";
import StateSelect from "../state-select";
import { DriverLicenseType } from "../../../enums/users/driver-license-type.enum";
import { DriverEndorsement } from "../../../enums/users/driver-endorsement.enum";
import { EducationLevel } from "../../../enums/users/education-level.enum";
import { VehicleTransmissionType } from "../../../enums/vehicles/vehicle-transmission-type.enum";
import { LicenseRestrictions } from "../../../enums/applicants/applicant-license-restrictions-type.enum";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { useFormik } from "formik";
import { ApplicantExtrasEntity } from "../../../models/applicant";
import { useEffect } from "react";
import ApplicantApi from "../../../pages/api/applicant";
import { formSuccess, formFailed } from "../../../utils/toast";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { toast } from "react-toastify";

export interface ApplicantLicensingFormProps extends BaseFormProps<ApplicantEntity> {}

export function ApplicantLicensingForm(props: ApplicantLicensingFormProps) {
  const { t } = useTranslation();
  const { entity, setEntity, className } = props;
  const applicantApi = new ApplicantApi();

  const form = useFormik<ApplicantEntity>({
    initialValues: entity || ({} as ApplicantEntity),
    onSubmit: async (values) => {
      if (!entity?.id) return;
      try {
        // Send all base fields, but strip out relations AND preference fields
        const { jobs, documents, notes, employers, dac, extras, voeData, accident_history, moving_violation_history, equipment_experience, equipment_owned, vehicles, meta, routes, preferred_location, current_application_status, ...payload } = values as any;
        const timestamp = new Date().toISOString();
        
        const saved = await applicantApi.update(entity.id, payload);
        
        // Check if child toasts are suppressed by global save
        if (!(window as any).__SUPPRESS_CHILD_TOASTS__) {
          formSuccess(t, 'update', 'APPLICANT');
        }
        
        // MERGE saved response with existing entity to preserve fields backend didn't return
        setEntity?.({ ...entity, ...saved });
        form.setValues({ ...form.values });
      } catch (e) {
        console.error('Licensing form save error:', e);
        if (!globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast })) {
          formFailed(t, 'update', 'APPLICANT');
        }
      }
    },
    enableReinitialize: false,
  });

  // Load form values properly like the old working form does
  useEffect(() => {
    if (!!entity?.id) {
      form.setValues({ ...entity });
    }
  }, [entity]);

  const handleLicenseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseValue = e.target.value.toUpperCase();
    form.setFieldValue(e.target.name, uppercaseValue);
  };

  return (
    <>
      <Row>
        <Col md="12" className="p-2">
          <div className="df-modern-section">
      <Section title="CDL Information">
        {/* Transmission Experience */}
        <Row className="px-3">
          <BaseCheckList
            className="col-12"
            disabled={Boolean(entity?.is_hired)}
            label="Transmission Experience"
            name="transmission_type"
            labelPrefix="VehicleTransmissionType"
            enumType={VehicleTransmissionType}
            formik={form}
            cols="2"
          />
        </Row>
        <BsForm onSubmit={form.handleSubmit} data-applicant-edit-form>
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
        <Row className="px-3">
          <BaseInput
            className="col-12 mt-2"
            readOnly={Boolean(entity?.is_hired)}
            label="driver's_license_number"
            name="license_number"
            placeholder="ENTER_DRIVER_LICENSE"
            formik={form}
            onChange={handleLicenseNumberChange}
          />
          <BaseInput
            className="col-6 mt-2"
            readOnly={Boolean(entity?.is_hired)}
            label="expiration_date"
            name="license_expiry"
            type="date"
            placeholder="expiration_date"
            formik={form}
          />
          <StateSelect
            className="col-6 mt-2"
            readOnly={Boolean(entity?.is_hired)}
            label="state_issued"
            name="license_state"
            placeholder="SELECT_ISSUE_STATE"
            formik={form}
          />
        </Row>
        <Row className="px-3">
          <BaseCheck
            className="col-12 mt-2"
            disabled={Boolean(entity?.is_hired)}
            label="OWNER_OPERATOR"
            name="is_owner_operator"
            formik={form}
          />
        </Row>
        {Boolean(form.values.is_owner_operator) && (
          <Row className="px-3">
            <BaseInput
              readOnly={Boolean(entity?.is_hired)}
              className="col-6"
              label="BUSINESS_NAME"
              name={`extras[${form.values?.extras?.findIndex((v) => v.type == ApplicantExtras.BUSINESS_NAME)}].value`}
              formik={form}
            />
            <BaseInput
              readOnly={Boolean(entity?.is_hired)}
              className="col-6"
              name={`extras[${form.values?.extras?.findIndex((v) => v.type == ApplicantExtras.DOT_NUMBER)}].value`}
              label="DOT_NUMBER"
              formik={form}
            />
          </Row>
        )}

        <Row className="px-3">
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
          {form.values?.endorsements?.includes(DriverEndorsement.OTHER) && (
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
        </Row>

        <Row className="px-3">
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
        </Row>

        <Row className="px-3">
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
          {form.values?.license_restrictions?.includes(LicenseRestrictions.OTHER) && (
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
        </Row>
        </BsForm>
      </Section>
          </div>
        </Col>
      </Row>
    </>
  );
}


