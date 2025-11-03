import { useFormik } from "formik";
import { Col, Row } from "react-bootstrap";
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

export interface ApplicantPreferencesFormProps extends BaseFormProps<ApplicantEntity> {
  hideActions?: boolean;
}

export function ApplicantPreferencesForm(props: ApplicantPreferencesFormProps) {
  const { t } = useTranslation();
  const { entity, setEntity, hideActions, className } = props;
  const applicantApi = new ApplicantApi();

  const form = useFormik<ApplicantEntity>({
    initialValues: entity || ({} as ApplicantEntity),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const saved = await applicantApi.update(values.id, {
        authorized_to_work_in_us: values.authorized_to_work_in_us,
        preferred_location: values.preferred_location,
        routes: values.routes,
        current_application_status: values.current_application_status,
      } as any);
      setEntity?.(saved);
    },
  });

  return (
    <Row className="px-2">
      <Col md="12" className="p-2">
        <div className="df-modern-section">
        <Section title="Preferences">
          <Row className="px-3">
            <BaseCheck className="col-12 mt-2" disabled={Boolean(entity?.is_hired)} label="AUTHORIZED_TO_WORK_IN_THE_US" name="authorized_to_work_in_us" formik={form} />
            <BaseCheckList className="col-12 mt-2" disabled={Boolean(entity?.is_hired)} label="PREFERRED_LOCATION" name="preferred_location" formik={form} labelPrefix="JobGeography" enumType={JobGeography} />
            <BaseCheckList className="col-12 mt-2" disabled={Boolean(entity?.is_hired)} label="ROUTE_TYPE" name={`routes`} formik={form} labelPrefix="JobSchedule" enumType={JobSchedule} />
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
  );
}


