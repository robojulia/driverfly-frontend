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
        state: { steps },
        method: { setSteps },
    } = useContext(jotformContext);
    const { t } = useTranslation();

    const form = useFormik({
        initialValues: {},
        onSubmit: (values) => {
            setSteps( steps+1 );
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
            <Row className='mt-5 col-1'>
                <Button type="submit">
                    {t("NEXT")}
                </Button>
            </Row>
        </Form>
    );
}