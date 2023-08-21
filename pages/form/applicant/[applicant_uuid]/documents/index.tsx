import { useEffect, useState } from "react";
import styles from "../../../../../styles/digitalhiringapp.module.css";
import {
    ApplicantEntity,
    ApplicantExtrasEntity,
} from "../../../../../models/applicant";
import JotformContext from "../../../../../context/jotform-context";
import {
    getLongFormStyle,
    getMissingDocumentsPages,
} from "../../../../../components/forms/jotform/jotform-pages";
import ApplicantApi from "../../../../api/applicant";
import { ApplicantDocumentType } from "../../../../../enums/applicants/applicant-document-type.enum";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { ApplicantMissingDocumentsDto } from "../../../../../models/applicant/applicant-missing-documents.dto";
import BaseCheck from "../../../../../components/forms/base-check";
import { CameraComponent } from "../../../../../components/forms/jotform/longForm/camera";
import FileInput from "../../../../../components/forms/file-input";
import { useTranslation } from "../../../../../hooks/use-translation";

export interface MissingDocumentsProps {
    entity: ApplicantEntity;
    types: ApplicantDocumentType[];
}

export default function MissingDocuments({ entity, types }: MissingDocumentsProps) {
    console.log("type", types);


    const { t } = useTranslation();

    const form = useFormik({
        initialValues: new ApplicantMissingDocumentsDto(),
        validationSchema: ApplicantMissingDocumentsDto.yupSchema(),
        onSubmit: (values, { resetForm }) => {
            console.log("values", values);

            // const { document } = values;

            // if (!!document?.file_base64) {
            //     const documents: DocumentEntity[] =
            //         applicant?.documents?.filter(isNotDriverLicense) || [];
            //     setApplicant({
            //         ...applicant,
            //         documents: [...documents, { ...document }],
            //     });
            // }

            // // resetForm();
            // stepNext();
        },
        onReset: (values) => {
            // stepBack();
        },
    });

    useEffect(() => {
        console.log("form.values, form.errors", form.values, form.errors);

    }, [form.values, form.errors])

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.main_form}>

                    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>

                        {types?.map((type) => (
                            <Row className={styles.align__text_left}>
                                <h3>{t(`ApplicantDocumentType.${type}`)}</h3>
                                <BaseCheck
                                    className="mx-3 col float-left p-0"
                                    label="MEDIA_PREFERENCE"
                                    name={`mediaOptions[${type}]`}
                                    formik={form}
                                />
                                {
                                    Boolean(form.values.mediaOptions[type]) ? (
                                        <CameraComponent form={form} />
                                    ) : (
                                        <FileInput
                                            className="my-3"
                                            name={`documents[${type}]`}
                                            accept="application/pdf"
                                            allowedSizeInByte={3145728}
                                            formik={form}
                                        />
                                    )
                                }
                                <hr />
                            </Row>
                        ))}

                        <Row className="mt-3">
                            <Col>
                                <Button className="float-left" type="submit">
                                    {t("NEXT")}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps({ query }) {
    try {
        const { applicant_uuid, type } = query || {};

        if (!!!applicant_uuid) return { notFound: true };
        if (!!!type.length) return { notFound: true };

        const applicantApi = new ApplicantApi();
        const entity: ApplicantEntity = await applicantApi.getByUuidToken(applicant_uuid);

        if (!!!entity) return { notFound: true };

        return { props: { entity, types: type } };
    } catch (error) {
        console.log("error", error.message);

        return { notFound: true };
    }
}
