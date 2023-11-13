import { Row, Button, Col } from "react-bootstrap";
import { useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import SupportApi from "../../pages/api/support";
import { useTranslation } from "../../hooks/use-translation";
import BaseInput from "../forms/base-input";
import { SupportDto } from "../../models/support/support.dto";
import FileInput from "../forms/file-input";
import { DocumentEntity } from "../../models/documents/document.entity";

export default function Support() {
    const { t } = useTranslation();
    const api = new SupportApi();

    const form = useFormik({
        initialValues: new SupportDto(),
        validationSchema: SupportDto.yupSchema(),
        onSubmit: async (dto, { resetForm }) => {
            dto.documents = dto?.documents?.filter((v) => Boolean(v?.file_base64))
            try {
                await api.reportIssue(dto);
                resetForm()
                toast.success(t("SUCCESSFULLY_TO_DEVELOPER"));
            } catch (e) {
                globalAjaxExceptionHandler(e, {
                    formik: form,
                    toast: toast,
                    t: t,
                    defaultMessage: "UNABLE_TO_SEND_EMAIL",
                });
            }
        },
    });

    // useEffect(() => {
    //     console.log("form.values", form.values);
    //     console.log("form.errors", form.errors);
    // }, [form.values, form.errors]);

    return (
        <>
            <form onSubmit={form.handleSubmit}>
                <Row>
                    <BaseInput
                        className="col-sm-6 mb-2"
                        label="description"
                        name="description"
                        placeholder="description"
                        required
                        formik={form}
                    />
                    <BaseInput
                        className="col-sm-6 mb-2"
                        label="operating_system"
                        name="operating_system"
                        placeholder="operating_system"
                        required
                        formik={form}
                    />
                    <BaseInput
                        className="col-sm-6 mb-2"
                        label="page-path-url"
                        name="page_path_url"
                        placeholder="page-path-url"
                        required
                        formik={form}
                    />
                    <Col md="6">
                        {Boolean(form.values.documents?.length)
                            ? form.values.documents?.map((document, i) =>
                                <div className="" key={i}>
                                    <FileInput
                                        label="ATTACHMENT"
                                        className=""
                                        name={`documents[${i}]`}
                                        accept="application/pdf"
                                        allowedSizeInByte={3145728}
                                        formik={form}
                                    />
                                    <a
                                        role="button"
                                        className="btn btn-link "
                                        onClick={() =>
                                            form.setValues({
                                                ...form.values,
                                                documents: [],
                                            })
                                        }
                                    >
                                        {t("REMOVE")}
                                    </a>
                                </div>
                            )
                            : <a
                                role="button"
                                className="btn btn-link mt-4 "
                                onClick={() =>
                                    form.setValues({
                                        ...form.values,
                                        documents: [
                                            ...(form.values?.documents || []),
                                            { ...(new DocumentEntity()), type: "document" },
                                        ],
                                    })
                                }
                            >
                                {t("ATTACH_DOCUMENT")}
                            </a>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col className="text-end">
                        <Button disabled={form.isSubmitting} type="submit">
                            {t("submit")}
                        </Button>
                    </Col>
                </Row>
            </form>
        </>
    );
}
