import { useFormik } from "formik";
import { useEffect, useRef } from "react";
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

  // Keep a ref to always have the latest form instance
  const formRef = useRef(form);
  formRef.current = form;

  // Register getter function that returns CURRENT emergency contact fields when called
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Register validation function
      (window as any).__applicantFormValidation = (window as any).__applicantFormValidation || {};
      (window as any).__applicantFormValidation['emergency-contact'] = () => {
        // Return current validation errors from formik
        return formRef.current.errors;
      };

      (window as any).__applicantFormRegistry = (window as any).__applicantFormRegistry || {};
      (window as any).__applicantFormRegistry['emergency-contact'] = () => {
        console.log('EmergencyContactForm getter called');
        return {
          emergency_contact_name: formRef.current.values.emergency_contact_name,
          emergency_contact_number: formRef.current.values.emergency_contact_number,
          emergency_contact_relationship: formRef.current.values.emergency_contact_relationship,
        };
      };
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__applicantFormValidation?.['emergency-contact'];
        delete (window as any).__applicantFormRegistry?.['emergency-contact'];
      }
    };
  }, []);

  return (
    <>
      <div className="df-modern-section">
        <Section title="Emergency Contact Information">
          <form onSubmit={form.handleSubmit} data-applicant-edit-form>
            <Row className="mb-2">
              <Col md="4" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} name={`emergency_contact_name`} label="NAME" placeholder="ENTER_EMERGENCY_CONTACT" formik={form} />
              </Col>
              <Col md="4" className="px-2">
                <BaseInputPhone className="col-12" readOnly={Boolean(entity?.is_hired)} name={`emergency_contact_number`} label="PHONE" placeholder="PHONE" formik={form} />
              </Col>
              <Col md="4" className="px-2">
                <BaseInput className="col-12" readOnly={Boolean(entity?.is_hired)} name={`emergency_contact_relationship`} label="RELATIONSHIP" placeholder="ENTER_EMERGENCY_CONTACT_RELATIONSHIP" formik={form} />
              </Col>
            </Row>
          </form>
        </Section>
      </div>
    </>
  );
}


