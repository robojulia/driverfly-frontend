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

export interface ApplicantLicensingFormProps extends BaseFormProps<ApplicantEntity> {}

export function ApplicantLicensingForm(props: ApplicantLicensingFormProps) {
  const { t } = useTranslation();
  const { entity, setEntity, className } = props;
  const applicantApi = new ApplicantApi();
  const [initialized, setInitialized] = useState(false);
  const [dotVerifyRaw, setDotVerifyRaw] = useState<any>(null);

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
      form.setValues({ ...entity });
      setInitialized(true);
    }
  }, [entity?.id, initialized]);

  // Keep a ref to always have the latest form instance
  const formRef = useRef(form);
  formRef.current = form;

  // Register getter function that returns CURRENT form values when called
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__applicantFormRegistry = (window as any).__applicantFormRegistry || {};
      (window as any).__applicantFormRegistry['licensing'] = () => {
        console.log('LicensingForm getter called, license_number:', formRef.current.values.license_number);
        
        // Extract DOT_NUMBER and BUSINESS_NAME from current form extras (Formik keeps these updated)
        const allExtras = formRef.current.values.extras || [];
        const dotNumberExtra = allExtras.find((e: any) => e.type === ApplicantExtras.DOT_NUMBER);
        const businessNameExtra = allExtras.find((e: any) => e.type === ApplicantExtras.BUSINESS_NAME);
        
        // Build extras array with DOT_NUMBER and BUSINESS_NAME included
        const licensingExtras = [];
        if (dotNumberExtra) {
          licensingExtras.push({
            type: ApplicantExtras.DOT_NUMBER,
            value: dotNumberExtra.value,
            id: dotNumberExtra.id,
          } as any);
        }
        if (businessNameExtra) {
          licensingExtras.push({
            type: ApplicantExtras.BUSINESS_NAME,
            value: businessNameExtra.value,
            id: businessNameExtra.id,
          } as any);
        }
        
        // Return ALL CDL/licensing fields managed by this form
        return {
          transmission_type: formRef.current.values.transmission_type,
          license_type: formRef.current.values.license_type,
          years_cdl_experience: formRef.current.values.years_cdl_experience,
          license_number: formRef.current.values.license_number,
          license_expiry: formRef.current.values.license_expiry,
          license_state: formRef.current.values.license_state,
          is_owner_operator: formRef.current.values.is_owner_operator,
          endorsements: formRef.current.values.endorsements,
          endorsements_other: formRef.current.values.endorsements_other,
          license_restrictions: formRef.current.values.license_restrictions,
          license_restrictions_other: formRef.current.values.license_restrictions_other,
          extras: licensingExtras, // Only DOT_NUMBER and BUSINESS_NAME from this form
        };
      };
    }
  }, []);

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
          <>
            <div className="px-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'start' }}>
              {/* Row 1, Cell 1: Business Name + Endorsements + License Restrictions */}
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label>
                    {t('BUSINESS_NAME')}:
                  </label>
                  <br />
                  <div style={{ marginTop: '0.5rem' }}>
                    <BaseInput
                      readOnly={Boolean(entity?.is_hired)}
                      className=""
                      name={`extras[${form.values?.extras?.findIndex((v) => v.type == ApplicantExtras.BUSINESS_NAME)}].value`}
                      formik={form}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label>
                    {t('ENDORSEMENTS')}:
                  </label>
                  <br />
                  <div style={{ marginTop: '0.5rem' }}>
                    <BaseCheckList
                      className=""
                      disabled={Boolean(entity?.is_hired)}
                      name="endorsements"
                      labelPrefix="DriverEndorsement"
                      enumType={DriverEndorsement}
                      formik={form}
                      cols="2"
                    />
                  </div>
                </div>
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
                <div style={{ marginBottom: '1.5rem' }}>
                  <label>
                    {t('License_Restrictions')}:
                  </label>
                  <br />
                  <div style={{ marginTop: '0.5rem' }}>
                    <BaseCheckList
                      disabled={Boolean(entity?.is_hired)}
                      className=""
                      name="license_restrictions"
                      labelPrefix="LicenseRestrictions"
                      enumType={LicenseRestrictions}
                      formik={form}
                      cols="2"
                    />
                  </div>
                </div>
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
              </div>
              {/* Row 1, Cell 2: DOT Number + Results */}
              <div>
                <div className="d-flex align-items-start gap-2">
                  <BaseInput
                    readOnly={Boolean(entity?.is_hired)}
                    className="flex-grow-1"
                    name={`extras[${form.values?.extras?.findIndex((v) => v.type == ApplicantExtras.DOT_NUMBER)}].value`}
                    label="DOT_NUMBER"
                    formik={form}
                  />
                  <div style={{ 
                    marginTop: 'calc(1.5rem + 0.375rem)', 
                    flexShrink: 0,
                    height: 'calc(1.5em + 0.75rem + 2px)',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Button
                      type="button"
                      className="btn theme-general-btn"
                      style={{ height: '100%', whiteSpace: 'nowrap', padding: '0.375rem 0.75rem' }}
                      onClick={async () => {
                        try {
                          const companyApi = new CompanyApi();
                          const dot_number = form.values.extras?.find((e: any) => e.type === ApplicantExtras.DOT_NUMBER)?.value;
                          const business_name = form.values.extras?.find((e: any) => e.type === ApplicantExtras.BUSINESS_NAME)?.value;
                          const tokens = await companyApi.dotVerify({
                            dot_number,
                            email: form.values.email,
                            phone: form.values.phone,
                            address_1: form.values.address_1 || form.values.street,
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
                              accident_history: form.values.accident_history,
                              moving_violation_history: form.values.moving_violation_history,
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
                              // Check if records array is empty or contains only falsy values
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
                  );
                })()}
              </div>
            </div>
          </>
        )}
        </BsForm>
      </Section>
          </div>
        </Col>
      </Row>
    </>
  );
}


