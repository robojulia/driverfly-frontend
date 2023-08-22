import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button, Col, Form, Row } from "react-bootstrap";
import styles from "../../../../../styles/digitalhiringapp.module.css";
import {
    ApplicantEntity,
} from "../../../../../models/applicant";
import ApplicantApi from "../../../../api/applicant";
import { ApplicantDocumentType } from "../../../../../enums/applicants/applicant-document-type.enum";
import { ApplicantMissingDocumentsDto } from "../../../../../models/applicant/applicant-missing-documents.dto";
import BaseCheck from "../../../../../components/forms/base-check";
import { CameraComponent } from "../../../../../components/forms/jotform/longForm/camera";
import FileInput from "../../../../../components/forms/file-input";
import { useTranslation } from "../../../../../hooks/use-translation";
import { DocumentEntity } from "../../../../../models/documents/document.entity";
import { toast } from "react-toastify";

export interface MissingDocumentsProps {
    entity: ApplicantEntity;
    types: ApplicantDocumentType[];
}

export default function MissingDocuments({ entity, types }: MissingDocumentsProps) {

    console.log("types", types);

    const applicantApi = new ApplicantApi()
    const { t } = useTranslation();

    const [showThankYou, setThankYou] = useState<boolean>(false)

    const form = useFormik({
        initialValues: new ApplicantMissingDocumentsDto(),
        validationSchema: ApplicantMissingDocumentsDto.yupSchema(),
        validateOnMount: false,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async ({ documents }, { resetForm }) => {
            await applicantApi.jotform.updateDocuments(entity.id, documents)

            resetForm();
            setThankYou(true)
            toast.success(t("successfully_saved_information"))
        },
    });

    useEffect(() => {
        if (types?.length) form.setValues({
            documents: types?.map((type, i) => ({ ...(new DocumentEntity), type })),
            mediaOptions: types?.map((type, i) => (false))
        });
    }, [types])

    return (
        <>
            <div className={styles.container}>
                <div className={styles.main}>
                    <div className={styles.main_form}>
                        {/* <ToastContainer /> */}
                        {showThankYou
                            ?
                            (<h4 className={styles.Application}>{t("THANK_YOU")}</h4>)
                            : (<>
                                <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
                                    {form.values?.documents?.map((document, i) => (
                                        <Row key={i} className={styles.align__text_left}>
                                            <h3>{t(`ApplicantDocumentType.${document?.type}`)}</h3>
                                            <BaseCheck
                                                className="mx-3 col float-left p-0"
                                                label="MEDIA_PREFERENCE"
                                                name={`mediaOptions[${i}]`}
                                                formik={form}
                                            />
                                            {Boolean(form.values?.mediaOptions[i]) ? (
                                                <CameraComponent name={`documents[${i}]`} form={form} />
                                            ) : (
                                                <FileInput
                                                    className="my-3"
                                                    name={`documents[${i}]`}
                                                    accept="application/pdf"
                                                    allowedSizeInByte={3145728}
                                                    formik={form}
                                                />
                                            )}
                                            <hr />
                                        </Row>
                                    ))}
                                    <Row className="mt-3">
                                        <Col>
                                            <Button
                                                disabled={form.isSubmitting || form.isValidating || !form.isValid}
                                                className="float-left"
                                                type="submit"
                                            >
                                                {t("NEXT")}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </>)
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps({ query }) {
    try {
        const { applicant_uuid, type } = query || {};
        const types = Boolean(Array.isArray(type)) ? type : [type]

        if (!!!applicant_uuid) return { notFound: true };

        if (!!!types.length) return { notFound: true };

        const applicantApi = new ApplicantApi();
        const entity: ApplicantEntity = await applicantApi.getByUuidToken(applicant_uuid);

        if (!!!entity) return { notFound: true };

        return { props: { entity, types } };
    } catch (error) {
        console.log("error", error.message);

        return { notFound: true };
    }
}
