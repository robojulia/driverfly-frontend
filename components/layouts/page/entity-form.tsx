import React, { ReactNode } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Icon } from "react-bootstrap-icons";
import { useTranslation } from "../../../hooks/use-translation";
import { FormikInterface } from "../../../utils/formik";
import { LoaderIcon } from "../../loading/loader-icon";

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
    hideSubmitButton?: boolean;
}

export default function EntityForm(props: EntityFormProps) {
    const { t } = useTranslation();

    let { id, canSubmit, forbidSubmit, formik, className, onSubmit, children } =
        props;

    const action = t(props.submitLabel ?? (id ? "UPDATE" : "ADD"));

    if (formik) {
        canSubmit = !formik.isValidating && !formik.isSubmitting;
        if (!onSubmit) onSubmit = formik.handleSubmit;
    }

    const Actions = () => (
        <Row>
            <Col xs="12" className="text-end">
                {props?.actions?.map(
                    (
                        { icon: IconComp, label, className, disabled, onClick, hide },
                        index
                    ) => !hide && (
                        <Button
                            key={index}
                            type="button"
                            className={`${className} mr-2`}
                            disabled={disabled}
                            onClick={onClick}
                        >
                            {/* {<IconComp style={{ marginRight: "5px" }} />} */}
                            {typeof label == "string"
                                ? t(label)
                                : typeof label == "function"
                                    ? label()
                                    : label}
                        </Button>
                    )
                )}
                {!props?.hideSubmitButton && (
                    <Button
                        type="submit"
                        className="theme-secondary-btn"
                        disabled={canSubmit == null || !!!canSubmit || forbidSubmit}
                    >
                        <LoaderIcon isLoading={!!formik?.isSubmitting} /> {action}
                    </Button>
                )}
            </Col>
        </Row>
    );
    return (
        <Form className={className} onSubmit={onSubmit}>
            {props?.actionButtonDown ? (
                <>
                    {children}
                    <Actions />
                </>
            ) : (
                <>
                    <Actions />
                    {children}
                </>
            )}
        </Form>
    );
}
