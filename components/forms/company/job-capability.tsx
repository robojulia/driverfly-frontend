import React from "react";
import { Card, Form } from "react-bootstrap";
import { useTranslation } from "../../../hooks/use-translation";
import BaseCheck from "../base-check";
import BaseTextArea from "../base-text-area";

interface JobCapabilityProps {
  canPerformJob: boolean;
  onCanPerformJobChange: (canPerform: boolean) => void;
  reasonIndex: number;
  formik: any;
  disabled?: boolean;
}

export const JobCapability: React.FC<JobCapabilityProps> = ({
  canPerformJob,
  onCanPerformJobChange,
  reasonIndex,
  formik,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const handleCanPerformJobChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Simply pass the checked value to the parent
    onCanPerformJobChange(e.target.checked);
  };

  return (
    <div className="mt-3 mb-3">
      <Form.Group className="mb-3">
        <BaseCheck
          className="col-12"
          disabled={disabled}
          label="CAN_PERFORM_JOB"
          checked={canPerformJob}
          onChange={handleCanPerformJobChange}
        />
      </Form.Group>

      {!canPerformJob && reasonIndex !== -1 && (
        <Form.Group className="mb-0">
          <BaseTextArea
            readOnly={disabled}
            className="col-12"
            label="UNABLE_TO_PERFORM_REASON"
            name={`extras[${reasonIndex}].value`}
            required={!canPerformJob}
            formik={formik}
          />
        </Form.Group>
      )}
    </div>
  );
};
