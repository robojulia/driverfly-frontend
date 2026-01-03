import React, { ReactNode, useMemo } from 'react';
import { Button, Col, Form, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Icon } from 'react-bootstrap-icons';
import { useTranslation } from '../../../hooks/use-translation';
import { FormikInterface } from '../../../utils/formik';
import { LoaderIcon } from '../../loading/loader-icon';

export interface FormActionOptions {
  icon?: Icon;
  label?: string | ReactNode | (() => string | ReactNode);
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  hide?: boolean;
  disabled?: boolean;
}

export interface EntityFormProps {
  id?: number;
  canSubmit?: boolean;
  formik?: FormikInterface;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  readonly children?: JSX.Element | JSX.Element[];
  actions?: FormActionOptions[];
  submitLabel?: string;
  forbidSubmit?: boolean;
  actionButtonDown?: boolean;
  showActionsAtBoth?: boolean;
  hideSubmitButton?: boolean;
}

export default function EntityForm(props: EntityFormProps) {
  const { t } = useTranslation();

  let { id, canSubmit, forbidSubmit, formik, className, onSubmit, children } = props;

  const action = t(props.submitLabel ?? (id ? 'UPDATE' : 'ADD'));

  // Track if form has validation errors
  const hasValidationErrors = formik && formik.dirty && Object.keys(formik.errors).length > 0;

  if (formik) {
    // Only disable submit if form is validating/submitting OR if form is dirty and has errors
    canSubmit = !formik.isValidating && !formik.isSubmitting && !hasValidationErrors;
    if (!onSubmit) onSubmit = formik.handleSubmit;
  }

  // Get validation error message
  const getValidationMessage = () => {
    if (!formik || !hasValidationErrors) return null;

    const errorFields = Object.keys(formik.errors);
    if (errorFields.length === 0) return null;

    // Don't show generic validation message if form has been submitted
    // Server errors are now handled by toast notifications
    if (formik.submitCount > 0) return null;

    return t('Please fill out all required fields to continue');
  };

  // Memoize the Actions component to prevent unnecessary re-renders
  const MemoizedActions = useMemo(
    () => (
      <Row className="mb-4">
        <Col xs="12" className="text-end">
          {props?.actions?.map(
            ({ icon: IconComp, label, className, disabled, onClick, hide }, index) =>
              !hide && (
                <Button
                  key={index}
                  type="button"
                  className={`${className} mr-2`}
                  disabled={disabled}
                  onClick={onClick}
                >
                  {/* {<IconComp style={{ marginRight: "5px" }} />} */}
                  {typeof label == 'string'
                    ? t(label)
                    : typeof label == 'function'
                    ? label()
                    : label}
                </Button>
              )
          )}
          {!props?.hideSubmitButton && (
            <div>
              <Button
                type="submit"
                className="theme-secondary-btn"
                disabled={canSubmit == null || !!!canSubmit || forbidSubmit}
                style={{
                  cursor: hasValidationErrors ? 'not-allowed' : 'pointer',
                }}
              >
                <LoaderIcon isLoading={!!formik?.isSubmitting} /> {action}
              </Button>
              {getValidationMessage() && (
                <div className="text-danger mt-2" style={{ fontSize: '0.875rem' }}>
                  {getValidationMessage()}
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>
    ),
    [props.actions, canSubmit, forbidSubmit, formik?.isSubmitting, formik?.errors, action, t]
  );

  return (
    <Form className={className} onSubmit={onSubmit}>
      {(props?.showActionsAtBoth || !props?.actionButtonDown) && MemoizedActions}
      {children}
      {(props?.showActionsAtBoth || props?.actionButtonDown) && MemoizedActions}
    </Form>
  );
}
