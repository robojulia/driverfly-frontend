import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import BaseCheck from "../../../../../components/forms/base-check";
import FileInput from "../../../../../components/forms/file-input";
import { CameraComponent } from "../../../../../components/forms/jotform/longForm/camera";
import { ApplicantDocumentType } from "../../../../../enums/applicants/applicant-document-type.enum";
import { useTranslation } from "../../../../../hooks/use-translation";
import {
    ApplicantEntity,
} from "../../../../../models/applicant";
import { ApplicantMissingDocumentsDto } from "../../../../../models/applicant/applicant-missing-documents.dto";
import { DocumentEntity } from "../../../../../models/documents/document.entity";
import ApplicantApi from "../../../../api/applicant";
import styles from "../../../../../styles/digitalhiringapp.module.css";

export interface MissingDocumentsProps {
    entity: ApplicantEntity;
    types: ApplicantDocumentType[];
}

export default function MissingDocuments({ entity, types }: MissingDocumentsProps) {

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
            const dta = await applicantApi.jotform.updateDocuments(entity.id, documents)
            console.log(dta, "================================")

            resetForm();
            toast.success(t("successfully_saved_information"))
            setThankYou(true)
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
                                            <h3 className="text-dark">{t(`ApplicantDocumentType.${document?.type}`)}</h3>
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
                                                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
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
                                                disabled={form.isSubmitting || form.isValidating}
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
        const types = Boolean(Array.isArray(type)) ? type : type?.split(', ')

        if (!!!applicant_uuid) return { notFound: true };

        if (!!!types.length) return { notFound: true };

        const applicantApi = new ApplicantApi();
        const entity: ApplicantEntity = await applicantApi.fetchByUuidToken(
            applicant_uuid,
            {
                withRelations: [
                    "documents"
                ]
            }
        );

        if (!!!entity) return { notFound: true };

        return { props: { entity, types } };
    } catch (error) {
        console.log("error", error.message);

        return { notFound: true };
    }
}
