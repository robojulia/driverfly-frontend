import { useFormik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../pages/api/applicant";
import Section from "../../view-details/section";
import BaseTextArea from "../base-text-area";
import { BaseFormProps } from "./base-form-props";

export interface ApplicantNotesFormProps extends BaseFormProps<ApplicantEntity> {
  hideActions?: boolean;
}

export function ApplicantNotesForm(props: ApplicantNotesFormProps) {
  const { t } = useTranslation();
  const { entity, setEntity, className } = props;
  const applicantApi = new ApplicantApi();

  const form = useFormik<ApplicantEntity>({
    initialValues: entity || ({} as ApplicantEntity),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const saved = await applicantApi.update(values.id, { remarks: values.remarks } as any);
      setEntity?.(saved);
    },
  });

  return (
    <>
        <Section title="Notes">
          <form onSubmit={form.handleSubmit} data-applicant-edit-form>
            <div className="col-12 mt-2">
              <BaseTextArea readOnly={Boolean(entity?.is_hired)} name="remarks" placeholder="Add a remark" formik={form} />
            </div>
          </form>
        </Section>
    </>
  );
}


