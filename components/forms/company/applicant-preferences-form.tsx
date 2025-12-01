import { useFormik } from "formik";
import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../pages/api/applicant";
import Section from "../../view-details/section";
import BaseCheck from "../base-check";
import BaseSelect from "../base-select";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { JobSchedule } from "../../../enums/jobs/job-schedule.enum";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";
import { BaseFormProps } from "./base-form-props";
import { JobCapability } from "./job-capability";
import { formSuccess, formFailed } from "../../../utils/toast";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";

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
      preferred_location: entity?.preferred_location || []
    },
    enableReinitialize: false,
    onSubmit: async (values) => {
      
      try {
        // Send ONLY preference fields to avoid overwriting other forms' changes
        const payload = {
          routes: values.routes,
          preferred_location: values.preferred_location,
          authorized_to_work_in_us: values.authorized_to_work_in_us,
          current_application_status: values.current_application_status,
        };
        
        const saved = await applicantApi.update(values.id, payload as any);
        
        // Check if child toasts are suppressed by global save
        if (!(window as any).__SUPPRESS_CHILD_TOASTS__) {
          formSuccess(t, 'update', 'APPLICANT');
        }
        
        // MERGE saved response with existing entity to preserve fields backend didn't return
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
  // Don't reload on entity updates to prevent ove rwriting user changes
  // (backend doesn't return routes/preferred_location with withRelations, which would reset form to empty values)
  useEffect(() => {
    if (!!entity?.id && !initialized) {
      form.setValues({ 
        ...entity,
        routes: entity.routes || [],
        preferred_location: entity.preferred_location || []
      });
      setInitialized(true);
    }
  }, [entity?.id, initialized]);

  // Keep a ref to always have the latest form instance
  const formRef = useRef(form);
  formRef.current = form;

  // Register getter function that returns CURRENT preference fields when called
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__applicantFormRegistry = (window as any).__applicantFormRegistry || {};
      (window as any).__applicantFormRegistry['preferences'] = () => {
        console.log('PreferencesForm getter called, current routes:', formRef.current.values.routes);
        return {
          routes: formRef.current.values.routes,
          preferred_location: formRef.current.values.preferred_location,
          authorized_to_work_in_us: formRef.current.values.authorized_to_work_in_us,
          current_application_status: formRef.current.values.current_application_status,
        };
      };
    }
  }, []);

  return (
    <Form onSubmit={form.handleSubmit} className={className} data-applicant-edit-form>
      <Row className="px-2">
        <Col md="12" className="p-2">
          <div className="df-modern-section">
          <Section title="Preferences">
            <Row className="px-3">
              <BaseCheck className="col-12 mt-2" disabled={Boolean(entity?.is_hired)} label="AUTHORIZED_TO_WORK_IN_THE_US" name="authorized_to_work_in_us" formik={form} />
              <div className="col-12 mt-2">
                <span style={{ marginRight: "20px", color: "black" }}>{t('PREFERRED_LOCATION')}:</span>
                {Object.entries(JobGeography).map(([key, value]) => (
                  <div key={value} className="form-check form-check-inline flex-row-reverse">
                    <label className="form-check-label">{t(`JobGeography.${value}`)}</label>
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
                    />
                  </div>
                ))}
              </div>
              <div className="col-12 mt-2">
                <span style={{ marginRight: "20px", color: "black" }}>{t('ROUTE_TYPE')}:</span>
                {Object.entries(JobSchedule).map(([key, value]) => (
                  <div key={value} className="form-check form-check-inline flex-row-reverse">
                    <label className="form-check-label">{t(`JobSchedule.${value}`)}</label>
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
                    />
                  </div>
                ))}
              </div>
              {form.values?.id && (
                <BaseSelect className="col-12 mt-2" readOnly={Boolean(entity?.is_hired)} name={`current_application_status`} required placeholder="APPLICANT_CURRENT_STATUS" label="APPLICANT_CURRENT_STATUS" labelPrefix="ApplicantStatus" enumType={ApplicantStatus} formik={form} />
              )}
            </Row>
            <Row className="px-3">
              <JobCapability canPerformJob={true} onCanPerformJobChange={() => {}} reasonIndex={-1} formik={form} disabled={Boolean(entity?.is_hired)} />
            </Row>
          </Section>
          </div>
        </Col>
      </Row>
    </Form>
  );
}


