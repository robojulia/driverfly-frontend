import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { Form, Button, Col, Row } from "react-bootstrap";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { useContext, useEffect } from "react";
import styles from "../../../../styles/jotform.module.css";
import BaseCheck from "../../base-check";

export interface EmployedByUsProps extends PageProps {}

export function EmployedByUs() {
    const{
        // state: { steps },
        method: { stepNext, stepBack },
    } = useContext(jotformContext);
    // console.log(setSteps, steps);
    const { t } = useTranslation();

    const form = useFormik({
        initialValues: {was_employed_by_us:false},
        onSubmit: (values) => {
            stepNext();
        },
        onReset: (values) => {
            stepBack();
        },
    });

    return(
        <Form onSubmit={ form.handleSubmit } onReset={form.handleReset}>
            <h4 className = {`${styles.carrierName}`}>
                {t("EMPLOYMENT_VERIF")}
            </h4>
            <Row>
                <BaseCheck
                    className="mt-3 mb-3"
                    required
                    name="was_employed"
                    label="EMPLOYED_BY_US"
                    formik={ form }
                    />
            </Row>

            <Row className="mt-3">
                <Col>
                    <Button className="float-right" type="reset">
                    {t("BACK")}
                    </Button>
                </Col>
                <Col>
                    <Button className="float-left" type="submit">
                    {t("NEXT")}
                    </Button>
                </Col>
        </Row>
        </Form>
    );
}