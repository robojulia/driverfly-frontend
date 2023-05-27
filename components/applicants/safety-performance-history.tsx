import { Button, Col, Form, Row, Table } from "react-bootstrap";

import { useFormik } from "formik";

import { toast } from "react-toastify";

import { CloudArrowDown, Pen, Eye, Trash } from "react-bootstrap-icons";

import { useState } from "react";
import { ThreeCircles } from 'react-loader-spinner';
import { ViewApplicantDetailProps } from "../../types/applicant/view-application-detail-props.type";
import { ApplicantDocumentDto, ApplicantEmployerEntity, ApplicantEntity } from "../../models/applicant";
import { useTranslation } from "../../hooks/use-translation";
import { useAuth } from "../../hooks/use-auth";
import ApplicantApi from "../../pages/api/applicant";
import DocumentApi from "../../pages/api/document";
import { ApplicantDqf } from "../../enums/applicants/applicant-dqf-types.enum";
import { useEffectAsync } from "../../utils/react";
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import ShowFormattedDate from "../jobs/show-formatted-date";
import FileInput from "../forms/file-input";
import ViewCard from "../view-details/view-card";
import ViewPdf from "../view-details/view-pdf";
import BaseCheck from "../forms/base-check";
import { SafetyPerformanceHistoryProps } from "../../types/applicant/safety-performnance-history-props.type";
import ViewModal from "../view-details/view-modal";
import ViewDataTable from "../view-details/view-data-table";
import ViewDocumentHistory from "../documents/view-history";
import { ApplicantDocumentType } from "../../enums/applicants/applicant-document-type.enum";

export default function SafetyPerformanceHistory({ buttonClass, applicant }: SafetyPerformanceHistoryProps) {

    const [applicantUser, setApplicantUser] = useState<ApplicantEntity>(null)

    const { t } = useTranslation();
    const { user } = useAuth();
    const applicantApi = new ApplicantApi();
    const api = new DocumentApi();

    const [pdf, setPdf] = useState({});
    const [employers, setEmployers] = useState<ApplicantEmployerEntity[]>([])
    const resetEmployers = () => setEmployers([])

    const form = useFormik({
        initialValues: new ApplicantDocumentDto(),
        validationSchema: ApplicantDocumentDto.yupSchema(),
        onSubmit: async ({ document }, { resetForm }) => {
            try {
                const applicantDocumentUpload = await applicantApi.documents.create(applicantUser.id, document)

                if (document.id) {
                    applicantUser.documents = applicantUser.documents.filter(v => (v.id !== applicantDocumentUpload.id))
                }
                applicantUser.documents.push(applicantDocumentUpload)
                toast.success(t('DOCUMENT_UPLOAD_SUCCESS_MESSAGE'))
                resetForm()
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
            }
        }
    });

    const viewDocumentClick = async (id, name) => {
        const document = await api.getSignedUrl(id);

        if (document) {
            setPdf({
                name: `${t(name)} (${document.name})`,
                url: document.path
            });
        }
    }

    const handleClick = async () => {
        const data = await applicantApi.employer.list(applicant.id)
        setEmployers(data)
    }

    return (
        <>
            <Button
                className={buttonClass ?? "w-100"}
                title={t("VIEW")}
                onClick={() => handleClick()}
            >{t("VIEW")}</Button>

            <ViewModal
                show={Boolean(employers.length)}
                onCloseClick={resetEmployers}
                closeText="CANCEL"
                title="PAST_EMPLOYER"
            >
                <ViewDataTable<ApplicantEmployerEntity>
                    customStyles={{
                        headRow: {
                            style: {
                                background: "linear-gradient(to bottom right, #2ec8c4, #1b4454ba)",
                                color: "white"
                            },
                        },
                    }}
                    columns={[
                        {
                            name: "TITLE",
                            selector: emp => emp.title,
                            hidable: false
                        },
                        {
                            name: "NAME",
                            selector: emp => emp.name,
                            hidable: false
                        },
                        {
                            name: "EMAIL",
                            selector: emp => emp.email,
                            hidable: false
                        },
                        {
                            name: "MANAGER",
                            selector: emp => emp.manager_name,
                            hidable: false
                        },
                        {
                            cell: emp => {
                                const doc = emp.documents?.find(v => v.type == ApplicantDqf.SAFETY_PERFORMANCE_HISTORY)
                                return (<>
                                    <Button
                                        onClick={() => {
                                            setPdf({
                                                name: `(${doc.name})`,
                                                url: doc.path
                                            })
                                        }}
                                        className="btn btn-success p-0 py-1 mr-2 w-100"><Eye /></Button>
                                    <ViewDocumentHistory
                                        document={doc}
                                        type={ApplicantDqf.SAFETY_PERFORMANCE_HISTORY}
                                    />
                                </>)
                            },
                            hidable: false
                        },
                    ]}
                    items={employers}
                />
            </ViewModal >
            <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />
        </>
    );
};

