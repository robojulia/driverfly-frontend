import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "../../../hooks/use-translation";
import { FormikInterface } from "../../../utils/formik";
import { LoaderIcon } from "../../loading/loader-icon";

export interface EntityFormProps {
    id?: number;
    canSubmit?: boolean;
    formik?: FormikInterface;
    onSubmit?: (e: React.FormEvent) => void;
    className?: string;
    readonly children?: JSX.Element | JSX.Element[]
}

export default function EntityForm(props: EntityFormProps) {
    const { t } = useTranslation();

    let { id, canSubmit, formik, className, onSubmit, children } = props;

    const action = t(id ? "UPDATE" : "CREATE");

    if (formik) {
        canSubmit = !formik.isValidating && !formik.isSubmitting && formik.isValid;
        if (!onSubmit) onSubmit = formik.handleSubmit;
    }

    return (
        <Form className={className} onSubmit={onSubmit}>
            <Row>
                <Col xs="12" className="text-end">
                    <Button type="submit" className="theme-secondary-btn" disabled={canSubmit == null || !!!canSubmit}>
                        <LoaderIcon isLoading={!!formik?.isSubmitting} /> {action}
                    </Button>
                </Col>
            </Row>
            {children}
        </Form>
    );
}