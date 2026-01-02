import { Col, Row, Form as BsForm, Button } from "react-bootstrap";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { BaseFormProps } from "./base-form-props";
import Section from "../../view-details/section";
import BaseSelect from "../base-select";
import BaseInput from "../base-input";
import BaseCheck from "../base-check";
import BaseCheckList from "../base-check-list";
import StateSelect from "../state-select";
import { useRef, useState, useEffect } from "react";
import { DriverLicenseType } from "../../../enums/users/driver-license-type.enum";
import { DriverEndorsement } from "../../../enums/users/driver-endorsement.enum";
import { EducationLevel } from "../../../enums/users/education-level.enum";
import { VehicleTransmissionType } from "../../../enums/vehicles/vehicle-transmission-type.enum";
import { LicenseRestrictions } from "../../../enums/applicants/applicant-license-restrictions-type.enum";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { useFormik } from "formik";
import { ApplicantExtrasEntity } from "../../../models/applicant";
import ApplicantApi from "../../../pages/api/applicant";
import { formSuccess, formFailed } from "../../../utils/toast";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { toast } from "react-toastify";
import CompanyApi from "../../../pages/api/company";
import { CdlExtras } from "../../../models/jot-form/long-form/cdl-object/index.dto";
import { PlusCircle, Trash } from "react-bootstrap-icons";
import { getCDLFormat } from "../../../utils/cdl-formats";
import stateList from "../../../utils/stateList";
import { LicenseExpirationAlert } from '../license-expiration-alert';

export interface ApplicantLicensingFormProps extends BaseFormProps<ApplicantEntity> {}

export function ApplicantLicensingForm(props: ApplicantLicensingFormProps) {
  const { t } = useTranslation();
  const { entity, setEntity, className } = props;
  const applicantApi = new ApplicantApi();
  const [initialized, setInitialized] = useState(false);
  const [dotVerifyRaw, setDotVerifyRaw] = useState<any>(null);
  const [additionalLicenses, setAdditionalLicenses] = useState<CdlExtras[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

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

  // Load form values once on initial mount to prevent overwriting user changes
  useEffect(() => {
    if (!!entity?.id && !initialized) {
      form.resetForm({ values: { ...entity } });
      setInitialized(true);
    }
  }, [entity?.id, initialized]);

  // Load existing additional licenses from entity extras
  useEffect(() => {
    const cdlExtra = entity?.extras?.find((v) => v.type === ApplicantExtras.CDL_NUMBER);
    if (cdlExtra?.value && Array.isArray(cdlExtra.value)) {
      setAdditionalLicenses(cdlExtra.value);
    }
  }, [entity?.extras]);

  // Screen size detection for responsive state list
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Keep a ref to always have the latest form instance
  const formRef = useRef(form);
  formRef.current = form;

  // Register getter function that returns CURRENT form values when called
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Register validation function
      (window as any).__applicantFormValidation = (window as any).__applicantFormValidation || {};
      (window as any).__applicantFormValidation['licensing'] = () => {
        // Return current validation errors from formik
        return formRef.current.errors;
      };

      // Register dirty state function
      (window as any).__applicantFormDirty = (window as any).__applicantFormDirty || {};
      (window as any).__applicantFormDirty['licensing'] = () => {
        return formRef.current.dirty;
      };

      // Register reset dirty function
      (window as any).__applicantFormResetDirty = (window as any).__applicantFormResetDirty || {};
      (window as any).__applicantFormResetDirty['licensing'] = () => {
        formRef.current.resetForm({ values: formRef.current.values });
      };

      // Register error setter function
      (window as any).__applicantFormSetErrors = (window as any).__applicantFormSetErrors || {};
      (window as any).__applicantFormSetErrors['licensing'] = (errors: Record<string, string>) => {
        // Set errors and mark fields as touched
        formRef.current.setErrors(errors);
        const touched: Record<string, boolean> = {};
        Object.keys(errors).forEach(key => {
          touched[key] = true;
        });
        formRef.current.setTouched(touched);
      };

      (window as any).__applicantFormRegistry = (window as any).__applicantFormRegistry || {};
      (window as any).__applicantFormRegistry['licensing'] = () => {
        console.log('LicensingForm getter called, license_number:', formRef.current.values.license_number);

        // Return ALL CDL/licensing fields managed by this form
        // Note: DOT_NUMBER and BUSINESS_NAME are now managed by basic-details form
        return {
          transmission_type: formRef.current.values.transmission_type,
          license_type: formRef.current.values.license_type,
          years_cdl_experience: formRef.current.values.years_cdl_experience,
          license_number: formRef.current.values.license_number,
          license_expiry: formRef.current.values.license_expiry,
          license_state: formRef.current.values.license_state,
          endorsements: formRef.current.values.endorsements,
          endorsements_other: formRef.current.values.endorsements_other,
          license_restrictions: formRef.current.values.license_restrictions,
          license_restrictions_other: formRef.current.values.license_restrictions_other,
          extras: formRef.current.values.extras,
        };
      };
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__applicantFormValidation?.['licensing'];
        delete (window as any).__applicantFormDirty?.['licensing'];
        delete (window as any).__applicantFormResetDirty?.['licensing'];
        delete (window as any).__applicantFormSetErrors?.['licensing'];
        delete (window as any).__applicantFormRegistry?.['licensing'];
      }
    };
  }, []);

  const handleLicenseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseValue = e.target.value.toUpperCase();
    form.setFieldValue(e.target.name, uppercaseValue);
  };

  // Additional licenses management functions
  const addCDLLicense = () => {
    const newLicenses = [...additionalLicenses, new CdlExtras()];
    setAdditionalLicenses(newLicenses);
    updateExtrasWithLicenses(newLicenses);
  };

  const removeCDLLicense = (index: number) => {
    const newLicenses = additionalLicenses.filter((_, idx) => idx !== index);
    setAdditionalLicenses(newLicenses);
    updateExtrasWithLicenses(newLicenses);
  };

  const handleAdditionalLicenseNumberChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseValue = e.target.value.toUpperCase();
    const newLicenses = [...additionalLicenses];
    newLicenses[index].license_number = uppercaseValue;
    setAdditionalLicenses(newLicenses);
    updateExtrasWithLicenses(newLicenses);
  };

  const handleLicenseFieldChange = (index: number, field: keyof CdlExtras, value: string) => {
    const newLicenses = [...additionalLicenses];
    newLicenses[index][field] = value;
    setAdditionalLicenses(newLicenses);
    updateExtrasWithLicenses(newLicenses);
  };

  const updateExtrasWithLicenses = (licenses: CdlExtras[]) => {
    const currentExtras = form.values.extras || [];
    const otherExtras = currentExtras.filter((e: any) => e.type !== ApplicantExtras.CDL_NUMBER);

    if (licenses.length > 0) {
      const cdlExtra = currentExtras.find((e: any) => e.type === ApplicantExtras.CDL_NUMBER);
      const updatedCdlExtra = {
        ...(cdlExtra || new ApplicantExtrasEntity(ApplicantExtras.CDL_NUMBER)),
        type: ApplicantExtras.CDL_NUMBER,
        value: licenses,
      };
      form.setFieldValue('extras', [...otherExtras, updatedCdlExtra]);
    } else {
      form.setFieldValue('extras', otherExtras);
    }
  };

  // Create responsive state list
  const responsiveStateList = isSmallScreen
    ? stateList.map((state) => ({ ...state, label: state.value }))
    : stateList;

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
            label="TRANSMISSION_EXPERIENCE"
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
          <div className="col-6 mt-2">
            <LicenseExpirationAlert expiryDate={form.values.license_expiry} />
            <BaseInput
              readOnly={Boolean(entity?.is_hired)}
              label="expiration_date"
              name="license_expiry"
              type="date"
              placeholder="expiration_date"
              formik={form}
            />
          </div>
          <StateSelect
            className="col-6 mt-2"
            readOnly={Boolean(entity?.is_hired)}
            label="state_issued"
            name="license_state"
            placeholder="SELECT_ISSUE_STATE"
            formik={form}
          />
        </Row>

        {/* Endorsements - Always Visible */}
        <Row className="px-3">
          <BaseCheckList
            className="col-12 mt-2"
            disabled={Boolean(entity?.is_hired)}
            label="ENDORSEMENTS_TWIC"
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

        {/* License Restrictions - Always Visible */}
        <Row className="px-3">
          <BaseCheckList
            disabled={Boolean(entity?.is_hired)}
            className="col-12 mt-2"
            label="LICENSE_RESTRICTIONS"
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

        {/* Additional CDL Licenses Section */}
        <Row className="px-3 mt-4">
          <Col md="12">
            <h5 className="mb-3">{t('HAVE_ANY_ACTIVE_DRIVERS_LICENSE')}</h5>
            <p className="text-muted mb-3">
              {t('ADDITIONAL_CDL_LICENSES_HELP_TITLE')}
            </p>

            {additionalLicenses.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {additionalLicenses.map((license, i) => {
                  const cdlFormat = getCDLFormat(license.state || '');

                  return (
                    <div
                      key={i}
                      style={{
                        padding: '1.5rem',
                        border: '2px solid #e0e5eb',
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                          gap: '1rem',
                          alignItems: 'end',
                          marginBottom: '1rem',
                        }}
                      >
                        <div>
                          <label className="form-label">
                            {t('state_issued')} <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            value={license.state || ''}
                            onChange={(e) => {
                              handleLicenseFieldChange(i, 'state', e.target.value);
                              handleLicenseFieldChange(i, 'license_number', '');
                            }}
                            disabled={Boolean(entity?.is_hired)}
                          >
                            <option value="">{t('SELECT_STATE')}</option>
                            {responsiveStateList.map((state) => (
                              <option key={state.value} value={state.value}>
                                {state.label}
                              </option>
                            ))}
                          </select>
                          <small className="form-text text-muted">
                            Select the state where this CDL was issued
                          </small>
                        </div>

                        <div>
                          <label className="form-label">
                            {t("driver's_license_number")} <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={cdlFormat.placeholder}
                            value={license.license_number || ''}
                            onChange={handleAdditionalLicenseNumberChange(i)}
                            disabled={!license.state || Boolean(entity?.is_hired)}
                            readOnly={Boolean(entity?.is_hired)}
                          />
                          <small className="form-text text-muted">
                            {license.state ? t(cdlFormat.description) : 'Select state first'}
                          </small>
                        </div>

                        <div>
                          <label className="form-label">
                            {t('expiration_date')} <span className="text-danger">*</span>
                          </label>
                          <LicenseExpirationAlert expiryDate={license.date} />
                          <input
                            type="date"
                            className="form-control"
                            value={typeof license.date === 'string' ? license.date : ''}
                            onChange={(e) => handleLicenseFieldChange(i, 'date', e.target.value)}
                            disabled={Boolean(entity?.is_hired)}
                            readOnly={Boolean(entity?.is_hired)}
                          />
                          <small className="form-text text-muted">
                            Please keep license information current
                          </small>
                        </div>
                      </div>

                      {!Boolean(entity?.is_hired) && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeCDLLicense(i)}
                            type="button"
                          >
                            <Trash /> {t('REMOVE')}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {!Boolean(entity?.is_hired) && (
              <div className="mt-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={addCDLLicense}
                  type="button"
                >
                  <PlusCircle className="me-2" /> {t('TITLE_ADD_CDL_DETAIL')}
                </Button>
              </div>
            )}

            {additionalLicenses.length === 0 && Boolean(entity?.is_hired) && (
              <p className="text-muted">No additional CDL licenses provided</p>
            )}
          </Col>
        </Row>

        </BsForm>
      </Section>
          </div>
        </Col>
      </Row>
    </>
  );
}


