import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { Form, Button, Col, Row } from "react-bootstrap";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { useContext, useEffect } from "react";
import styles from "../../../../styles/jotform.module.css";

export interface IntroPageProps extends PageProps {}

export function IntroPage() {
    const{
        method: { stepNext },
    } = useContext(jotformContext);
    const { t } = useTranslation();

    const form = useFormik({
        initialValues: {},
        onSubmit: (values) => {
            stepNext();
        },
    });

    return(
        <Form onSubmit={ form.handleSubmit }>
            <h1 className={ styles.carrierName }>
                {t("VERIFICATION_OF_EMPLOYMENT")}
            </h1>
            <Row className = "mt-3">
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("VOE_PARAGRAPH")}
                </p>
            </Row>
            <Row className='mt-5'>
                <Col className='float-right'>
                    <Button type="submit">
                        {t("NEXT")}
                    </Button>
                </Col>
                
            </Row>
        </Form>
    );
}