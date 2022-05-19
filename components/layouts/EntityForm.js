import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../hooks/useTranslation";

/**
 * 
 * @param {object} props 
 * @param {(React.FormEvent) => void} props.onSubmit
 * @param {number} props.id
 * @param {string} props.className
 * @param {React.ReactChild} props.children
 * @returns 
 */
export default function EntityForm(props) {
    const { t } = useTranslation();

    const { id, className, onSubmit, children } = props;


    return (
        <form className={className} onSubmit={onSubmit}>
            <Row>
                <Col xs="12" className="text-end">
                    <Button type="submit" variant="primary">
                        {t(id ? "UPDATE" : "CREATE")}
                    </Button>
                </Col>
            </Row>
            {children}
        </form>
    );
}