import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Section from "../../view-details/section";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { BaseFormProps } from "./base-form-props";
import { ApplicantExtras as ApplicantExtrasEnum } from "../../../enums/applicants/applicant-extras.enum";
import ApplicantApi from "../../../pages/api/applicant";

export interface ApplicantApplicationChecklistFormProps extends BaseFormProps<ApplicantEntity> {
  readOnly?: boolean;
}

type ChecklistState = {
  background_check_completed: boolean;
  drug_test_completed: boolean;
  mvr_report_reviewed: boolean;
  references_checked: boolean;
  dot_physical_current: boolean;
  interview_completed: boolean;
};

const defaultChecklist: ChecklistState = {
  background_check_completed: false,
  drug_test_completed: false,
  mvr_report_reviewed: false,
  references_checked: false,
  dot_physical_current: false,
  interview_completed: false,
};

export function ApplicantApplicationChecklistForm(
  props: ApplicantApplicationChecklistFormProps
) {
  const { t } = useTranslation();
  const { entity, setEntity } = props;
  const readOnly = props.readOnly || Boolean(entity?.is_hired);
  const [state, setState] = useState<ChecklistState>(defaultChecklist);

  useEffect(() => {
    const extra = entity?.extras?.find((e: any) => e.type === ApplicantExtrasEnum.APPLICATION_CHECKLIST);
    const value = (extra?.value as ChecklistState) || ({} as ChecklistState);
    setState({ ...defaultChecklist, ...value });
  }, [entity?.id]);

  const persist = async (next: ChecklistState) => {
    try {
      const api = new ApplicantApi();
      const others = (entity?.extras || []).filter((e: any) => e.type !== ApplicantExtrasEnum.APPLICATION_CHECKLIST);
      const updated = {
        type: ApplicantExtrasEnum.APPLICATION_CHECKLIST,
        value: next,
      } as any;
      const saved = await api.update(entity.id, {
        first_name: entity?.first_name,
        last_name: entity?.last_name,
        extras: [...others, updated],
      } as any);
      setEntity?.({ ...saved });
    } catch (_) {
      // ignore for now
    }
  };

  const onToggle = async (key: keyof ChecklistState) => {
    const next = { ...state, [key]: !state[key] };
    setState(next);
    await persist(next);
  };

  return (
    <Row className="px-2">
      <Col md="12" className="p-0 px-lg-2">
        <Section title="Application Checklist">
          <Form data-applicant-edit-form>
            <div className="d-flex flex-column">
              <Form.Check
                id="chk-bg"
                className="mb-2"
                type="checkbox"
                label={"Background Check Completed"}
                checked={state.background_check_completed}
                disabled={readOnly}
                onChange={() => onToggle("background_check_completed")}
              />
              <Form.Check
                id="chk-drug"
                className="mb-2"
                type="checkbox"
                label={"Drug Test Completed"}
                checked={state.drug_test_completed}
                disabled={readOnly}
                onChange={() => onToggle("drug_test_completed")}
              />
              <Form.Check
                id="chk-mvr"
                className="mb-2"
                type="checkbox"
                label={"MVR Report Reviewed"}
                checked={state.mvr_report_reviewed}
                disabled={readOnly}
                onChange={() => onToggle("mvr_report_reviewed")}
              />
              <Form.Check
                id="chk-ref"
                className="mb-2"
                type="checkbox"
                label={"References Checked"}
                checked={state.references_checked}
                disabled={readOnly}
                onChange={() => onToggle("references_checked")}
              />
              <Form.Check
                id="chk-dot"
                className="mb-2"
                type="checkbox"
                label={"DOT Physical Current"}
                checked={state.dot_physical_current}
                disabled={readOnly}
                onChange={() => onToggle("dot_physical_current")}
              />
              <Form.Check
                id="chk-interview"
                className="mb-2"
                type="checkbox"
                label={"Interview Completed"}
                checked={state.interview_completed}
                disabled={readOnly}
                onChange={() => onToggle("interview_completed")}
              />
            </div>
          </Form>
        </Section>
      </Col>
    </Row>
  );
}


