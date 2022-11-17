import React, { useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import FileInput from "../../file-input";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { DocumentEntity } from "../../../../models/documents/document.entity";
import { ApplicantDocumentType } from "../../../../enums/applicants/applicant-document-type.enum";
import { DocumentsDto } from "../../../../models/jot-form/long-form/documents.dto";

export interface DriverLicenseProps extends PageProps { }

export function DriverLicense() {
    const {
        state: { applicant },
        method: { setApplicant, stepNext, stepBack },
    } = useContext(jotformContext);

    const { t } = useTranslation();
    const form = useFormik({
        initialValues: new DocumentsDto(),
        validationSchema: DocumentsDto.yupSchema(),
        onSubmit: (values) => {
            console.log("vallll", values);
            const { document } = values;
            setApplicant((oldArray) => {
                return {
                    ...oldArray,
                    documents: [...oldArray.documents, { ...document }],
                };
            });
            stepNext();
        },
        onReset: (values) => {
            stepBack();
        },
    });

    useEffect(() => {
        const doc = applicant?.documents.find(
            (v) => v.type === ApplicantDocumentType.DRIVERS_LICENSE
        );

        form.setValues({
            document: doc ? doc : {
                ...(new DocumentEntity()),
                type: ApplicantDocumentType.DRIVERS_LICENSE,
            },
        });
    }, [applicant]);

    useEffect(() => {
        console.log("form errors", form.errors);
        console.log("form valuez", form.values);
    }, [form.errors, form.values]);

    return (
        <>
            <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
                <Row>
                    <h3>{t("DRIVER_LICENSE_PHOTO")}</h3>
                </Row>
                <Row className={styles.align__text_left}>
                    <FileInput className="my-3" name="document" accept="application/pdf" formik={form} />
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
        </>
    );
}
