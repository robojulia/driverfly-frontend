import { useFormik } from "formik";
import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../pages/api/applicant";
import Section from "../../view-details/section";
import BaseCheck from "../base-check";
import BaseCheckList from "../base-check-list";
import BaseSelect from "../base-select";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { JobSchedule } from "../../../enums/jobs/job-schedule.enum";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";
import { BaseFormProps } from "./base-form-props";
import { JobCapability } from "./job-capability";
import { formSuccess, formFailed } from "../../../utils/toast";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { toast } from "react-toastify";
import { useEffect } from "react";

export interface ApplicantPreferencesFormProps extends BaseFormProps<ApplicantEntity> {
  hideActions?: boolean;
}

export function ApplicantPreferencesForm(props: ApplicantPreferencesFormProps) {
  const { t } = useTranslation();
  const { entity, setEntity, hideActions, className } = props;
  const applicantApi = new ApplicantApi();

  const form = useFormik<ApplicantEntity>({
    initialValues: entity || ({} as ApplicantEntity),
    enableReinitialize: false,
    onSubmit: async (values) => {
      
      try {
        // Send ALL applicant fields like the old form does - backend might need full entity
        // But strip out relations that are updated separately
        const { jobs, documents, notes, employers, dac, extras, voeData, accident_history, moving_violation_history, equipment_experience, equipment_owned, vehicles, meta, ...payload } = values as any;
        const timestamp = new Date().toISOString();
        
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

  // Load form values properly like the old working form does
  useEffect(() => {
    if (!!entity?.id) {
      form.setValues({ ...entity });
    }
  }, [entity]);

  // Custom handler for checkbox arrays
  const handleCheckboxArrayChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const currentArray = form.values[fieldName] || [];
    
    let newArray: string[];
    if (currentArray.includes(value)) {
      // Remove from array
      newArray = currentArray.filter((item: string) => item !== value);
    } else {
      // Add to array
      newArray = [...currentArray, value];
    }
    
    form.setFieldValue(fieldName, newArray);
  };

  return (
    <Form onSubmit={form.handleSubmit} className={className} data-applicant-edit-form>
      <Row className="px-2">
        <Col md="12" className="p-2">
          <div className="df-modern-section">
          <Section title="Preferences">
            <Row className="px-3">
              <BaseCheck className="col-12 mt-2" disabled={Boolean(entity?.is_hired)} label="AUTHORIZED_TO_WORK_IN_THE_US" name="authorized_to_work_in_us" formik={form} />
              <BaseCheckList className="col-12 mt-2" disabled={Boolean(entity?.is_hired)} label="PREFERRED_LOCATION" name="preferred_location" formik={form} labelPrefix="JobGeography" enumType={JobGeography} onChange={handleCheckboxArrayChange('preferred_location')} />
              <BaseCheckList className="col-12 mt-2" disabled={Boolean(entity?.is_hired)} label="ROUTE_TYPE" name={`routes`} formik={form} labelPrefix="JobSchedule" enumType={JobSchedule} onChange={handleCheckboxArrayChange('routes')} />
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


