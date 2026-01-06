import { useFormik } from "formik";
import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../pages/api/applicant";
import Section from "../../view-details/section";
import BaseCheck from "../base-check";
import BaseSelect from "../base-select";
import BaseRange from "../base-range";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { JobSchedule } from "../../../enums/jobs/job-schedule.enum";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";
import { OtherRequirementType } from "../../../enums/users/other-requirements.enum";
import { BaseFormProps } from "./base-form-props";
import { formSuccess, formFailed } from "../../../utils/toast";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { toast } from "react-toastify";
import { useEffect, useState, useRef, useMemo } from "react";

export interface ApplicantPreferencesFormProps extends BaseFormProps<ApplicantEntity> {
  hideActions?: boolean;
}

export function ApplicantPreferencesForm(props: ApplicantPreferencesFormProps) {
  const { t } = useTranslation();
  const { entity, setEntity, hideActions, className } = props;
  const applicantApi = new ApplicantApi();
  const [initialized, setInitialized] = useState(false);

  const form = useFormik<ApplicantEntity>({
    initialValues: {
      ...(entity || ({} as ApplicantEntity)),
      routes: entity?.routes || [],
      preferred_location: entity?.preferred_location || [],
      max_travel_distance: entity?.max_travel_distance || 100,
      other_requirements: entity?.other_requirements || [],
      other_requirements_other: entity?.other_requirements_other || ''
    },
    enableReinitialize: false,
    onSubmit: async (values) => {
      // Don't try to update if no entity ID (create mode) - the parent form handles creation
      if (!entity?.id) return;

      try {
        // Send ONLY preference fields to avoid overwriting other forms' changes 
        const payload = {
          routes: values.routes,
          preferred_location: values.preferred_location,
          max_travel_distance: values.max_travel_distance,
          other_requirements: values.other_requirements,
          other_requirements_other: values.other_requirements_other,
        };

        const saved = await applicantApi.update(entity.id, payload as any);

        // Check if child toasts are suppressed by global save
        if (!(window as any).__SUPPRESS_CHILD_TOASTS__) {
          formSuccess(t, 'update', 'APPLICANT');
        }

        // MERGE saved response with existing entity to preserve fields backend didn't returned
        setEntity?.({ ...entity, ...saved });
        // Update form with current values (don't reload from saved - it might be incomplete)
        form.setValues({ ...form.values });
      } catch (e) {
        if (!globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast })) {
          formFailed(t, 'update', 'APPLICANT');
        }
      }
    },
  });

  // Load form values on initial mount only
  // Don't reload on entity updates to prevent overwriting user changes
  // (backend doesn't return routes/preferred_location with withRelations, which would reset form to empty values)
  useEffect(() => {
    if (!!entity?.id && !initialized) {
      form.resetForm({
        values: {
          ...entity,
          routes: entity.routes || [],
          preferred_location: entity.preferred_location || [],
          max_travel_distance: entity.max_travel_distance || 100,
          other_requirements: entity.other_requirements || [],
          other_requirements_other: entity.other_requirements_other || ''
        }
      });
      setInitialized(true);
    }
  }, [entity?.id, initialized]);

  // Keep a ref to always have the latest form instance
  const formRef = useRef(form);
  formRef.current = form;

  // Calculate max travel distance based on preferred locations
  const maxTravelDistanceLimit = useMemo(() => {
    const locations = form.values.preferred_location || [];
    if (locations.includes(JobGeography.OTR)) return 3000;
    if (locations.includes(JobGeography.REGIONAL)) return 1500;
    if (locations.includes(JobGeography.LOCAL)) return 100;
    return 100; // default
  }, [form.values.preferred_location]);

  // Auto-adjust max_travel_distance if it exceeds the new limit when preferred_location changes
  useEffect(() => {
    const currentDistance = form.values.max_travel_distance || 0;
    if (currentDistance > maxTravelDistanceLimit) {
      form.setFieldValue('max_travel_distance', maxTravelDistanceLimit);
    }
  }, [maxTravelDistanceLimit]);

  // Register getter function that returns CURRENT preference fields when called
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Register validation function
      (window as any).__applicantFormValidation = (window as any).__applicantFormValidation || {};
      (window as any).__applicantFormValidation['preferences'] = () => {
        // Return current validation errors from formik
        return formRef.current.errors;
      };

      // Register dirty state function
      (window as any).__applicantFormDirty = (window as any).__applicantFormDirty || {};
      (window as any).__applicantFormDirty['preferences'] = () => {
        return formRef.current.dirty;
      };

      // Register reset dirty function
      (window as any).__applicantFormResetDirty = (window as any).__applicantFormResetDirty || {};
      (window as any).__applicantFormResetDirty['preferences'] = () => {
        formRef.current.resetForm({ values: formRef.current.values });
      };

      (window as any).__applicantFormRegistry = (window as any).__applicantFormRegistry || {};
      (window as any).__applicantFormRegistry['preferences'] = () => {
        console.log('PreferencesForm getter called, current routes:', formRef.current.values.routes);
        return {
          routes: formRef.current.values.routes,
          preferred_location: formRef.current.values.preferred_location,
          max_travel_distance: formRef.current.values.max_travel_distance,
          other_requirements: formRef.current.values.other_requirements,
          other_requirements_other: formRef.current.values.other_requirements_other,
        };
      };
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__applicantFormValidation?.['preferences'];
        delete (window as any).__applicantFormDirty?.['preferences'];
        delete (window as any).__applicantFormResetDirty?.['preferences'];
        delete (window as any).__applicantFormRegistry?.['preferences'];
      }
    };
  }, []);

  return (
    <Form onSubmit={form.handleSubmit} className={className} data-applicant-edit-form>
      <Row className="px-2">
        <Col md="12" className="p-2">
          <div className="df-modern-section">
          <Section title="Preferences">
            <Row className="px-3">
              <div className="col-12 mt-2">
                <label>{t('ROUTES')}:</label>
                <br />
                {Object.entries(JobGeography).map(([key, value]) => (
                  <div key={value} className="form-check form-check-inline flex-row-reverse">
                    <label className="form-check-label" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', fontWeight: 400 }}>{t(`JobGeography.${value}`)}</label>
                    <input
                      disabled={Boolean(entity?.is_hired)}
                      className="form-check-input"
                      type="checkbox"
                      value={value}
                      checked={(form.values.preferred_location || []).includes(value)}
                      onChange={(e) => {
                        const currentArray = form.values.preferred_location || [];
                        const newArray = e.target.checked
                          ? [...currentArray, value]
                          : currentArray.filter(v => v !== value);
                        form.setFieldValue('preferred_location', newArray);
                      }}
                      style={{
                        width: '18px',
                        height: '18px',
                        minWidth: '18px',
                        minHeight: '18px',
                        opacity: 1,
                        visibility: 'visible',
                        cursor: entity?.is_hired ? 'not-allowed' : 'pointer',
                        border: '2px solid #0f5257',
                        borderRadius: '4px',
                        backgroundColor: (form.values.preferred_location || []).includes(value) ? '#0f5257' : 'white',
                        appearance: 'auto',
                        WebkitAppearance: 'checkbox',
                        MozAppearance: 'checkbox'
                      }}
                    />
                  </div>
                ))}
              </div>
              {(form.values.preferred_location || []).length > 0 && (
                <div className="col-12 mt-3 px-lg-2">
                  <BaseRange
                    className="p-0 fire-fox-cls"
                    label="MAX_TRAVEL_DISTANCE"
                    name="max_travel_distance"
                    valueSuffix="mi"
                    min={1}
                    max={maxTravelDistanceLimit}
                    formik={form}
                  />
                </div>
              )}
              <div className="col-12 mt-2">
                <label>{t('SCHEDULE')}:</label>
                <br />
                {Object.entries(JobSchedule).map(([key, value]) => (
                  <div key={value} className="form-check form-check-inline flex-row-reverse">
                    <label className="form-check-label" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', fontWeight: 400 }}>{t(`JobSchedule.${value}`)}</label>
                    <input
                      disabled={Boolean(entity?.is_hired)}
                      className="form-check-input"
                      type="checkbox"
                      value={value}
                      checked={(form.values.routes || []).includes(value)}
                      onChange={(e) => {
                        const currentArray = form.values.routes || [];
                        const newArray = e.target.checked
                          ? [...currentArray, value]
                          : currentArray.filter(v => v !== value);
                        form.setFieldValue('routes', newArray);
                      }}
                      style={{
                        width: '18px',
                        height: '18px',
                        minWidth: '18px',
                        minHeight: '18px',
                        opacity: 1,
                        visibility: 'visible',
                        cursor: entity?.is_hired ? 'not-allowed' : 'pointer',
                        border: '2px solid #0f5257',
                        borderRadius: '4px',
                        backgroundColor: (form.values.routes || []).includes(value) ? '#0f5257' : 'white',
                        appearance: 'auto',
                        WebkitAppearance: 'checkbox',
                        MozAppearance: 'checkbox'
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="col-12 mt-2">
                <label>{t('OTHER_REQUIREMENTS')}:</label>
                <br />
                {Object.entries(OtherRequirementType).map(([key, value]) => (
                  <div key={value} className="form-check form-check-inline flex-row-reverse">
                    <label className="form-check-label" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', fontWeight: 400 }}>{t(`OtherRequirementType.${value}`)}</label>
                    <input
                      disabled={Boolean(entity?.is_hired)}
                      className="form-check-input"
                      type="checkbox"
                      value={value}
                      checked={(form.values.other_requirements || []).includes(value)}
                      onChange={(e) => {
                        const currentArray = form.values.other_requirements || [];
                        const newArray = e.target.checked
                          ? [...currentArray, value]
                          : currentArray.filter(v => v !== value);
                        form.setFieldValue('other_requirements', newArray);
                      }}
                      style={{
                        width: '18px',
                        height: '18px',
                        minWidth: '18px',
                        minHeight: '18px',
                        opacity: 1,
                        visibility: 'visible',
                        cursor: entity?.is_hired ? 'not-allowed' : 'pointer',
                        border: '2px solid #0f5257',
                        borderRadius: '4px',
                        backgroundColor: (form.values.other_requirements || []).includes(value) ? '#0f5257' : 'white',
                        appearance: 'auto',
                        WebkitAppearance: 'checkbox',
                        MozAppearance: 'checkbox'
                      }}
                    />
                  </div>
                ))}
                {(form.values.other_requirements || []).includes(OtherRequirementType.OTHERS) && (
                  <div className="mt-2">
                    <input
                      disabled={Boolean(entity?.is_hired)}
                      type="text"
                      className="form-control"
                      placeholder={t('Please specify other requirements')}
                      value={form.values.other_requirements_other || ''}
                      onChange={(e) => form.setFieldValue('other_requirements_other', e.target.value)}
                      style={{
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        fontSize: '16px',
                        padding: '8px 12px',
                        border: '2px solid #0f5257',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                )}
              </div>
            </Row>
          </Section>
          </div>
        </Col>
      </Row>
    </Form>
  );
}


