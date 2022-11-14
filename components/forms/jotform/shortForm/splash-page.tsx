import React, { useContext } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface SplashPageProps extends PageProps { }

export function SplashPage() {

    const {
        state: { applicant },
        method: { stepNext },
    } = useContext(jotformContext);

    const { t } = useTranslation();

    const form = useFormik({
        initialValues: {},
        onSubmit: (values) => {
            stepNext()
        },
    });

    return (
        <>
            <Form onSubmit={form.handleSubmit}>
                <h1 className={styles.carrierName}>{t("NAUTILIUS_TRUCKING")}</h1>
                <h4 className={styles.Application}>{t("DRIVER_APPLICATION")}</h4>
                <h6 className={styles.paragraph}>{t("JOTFORM_WELCOME")}</h6>
                <Row className="mt-5">
                    <Col>
                        <Button type="submit">{t("NEXT")}</Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
