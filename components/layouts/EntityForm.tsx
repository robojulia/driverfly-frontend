import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "../../hooks/useTranslation";

export interface EntityFormProps {
    id?: number;
    canSubmit?: boolean;
    onSubmit?: (e: React.FormEvent) => void;
    className?: string;
    readonly children?: JSX.Element | JSX.Element[]
}

export default function EntityForm(props: EntityFormProps) {
    const { t } = useTranslation();

    const { id, canSubmit, className, onSubmit, children } = props;

    const action = t(id ? "UPDATE" : "CREATE");

    return (
        <Form className={className} onSubmit={onSubmit}>
            <Row>
                <Col xs="12" className="text-end">
                    <Button type="submit" className="theme-secondary-btn" disabled={canSubmit == null || !!!canSubmit}>
                        {action}
                    </Button>
                </Col>
            </Row>
            {children}
        </Form>
    );
}