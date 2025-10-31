import { useFormik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../pages/api/applicant";
import Section from "../../view-details/section";
import BaseInput from "../base-input";
import BaseInputPhone from "../base-input-phone";
import { BaseFormProps } from "./base-form-props";

export interface ApplicantEmergencyContactFormProps extends BaseFormProps<ApplicantEntity> {
  hideActions?: boolean;
}

export function ApplicantEmergencyContactForm(props: ApplicantEmergencyContactFormProps) {
  const { t } = useTranslation();
  const { entity, setEntity, hideActions, className } = props;
  const applicantApi = new ApplicantApi();

  const form = useFormik<ApplicantEntity>({
    initialValues: entity || ({} as ApplicantEntity),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const saved = await applicantApi.update(values.id, {
        emergency_contact_name: values.emergency_contact_name,
        emergency_contact_number: values.emergency_contact_number,
        emergency_contact_relationship: values.emergency_contact_relationship,
      } as any);
      setEntity?.(saved);
    },
  });

  return (
    <Row className="px-2">
      <Col md="12" className="p-2">
        <Section title="Emergency Contact Information">
          <form onSubmit={form.handleSubmit} data-applicant-edit-form>
            <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} name={`emergency_contact_name`} label="NAME" placeholder="ENTER_EMERGENCY_CONTACT" formik={form} />
            <BaseInputPhone className="col-12" readOnly={Boolean(entity?.is_hired)} name={`emergency_contact_number`} label="PHONE" placeholder="PHONE" formik={form} />
            <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} name={`emergency_contact_relationship`} label="RELATIONSHIP" placeholder="ENTER_EMERGENCY_CONTACT_RELATIONSHIP" formik={form} />
          </form>
        </Section>
      </Col>
    </Row>
  );
}


