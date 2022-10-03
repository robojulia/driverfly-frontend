import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { useState } from "react";
import React from "react";
import { CloudArrowDown, Download, Plus, Send } from 'react-bootstrap-icons';
import PageLayout from "../../../../../components/layouts/page/PageLayout";
import { useTranslation } from "../../../../../hooks/useTranslation";
import ViewDataTable, { getDataTableColumnKey } from "../../../../../components/viewDetails/viewDataTable";
import { useAuth } from "../../../../../hooks/useAuth";
import { useEffectAsync } from "../../../../../utils/react";
import { Button, Row } from "react-bootstrap";
import ViewModal from "../../../../../components/viewDetails/viewModal";
import FileInput from "../../../../../components/forms/FileInput";
import BaseSelect from "../../../../../components/forms/BaseSelect";
import ComplianceApi from "../../../../api/compliance";
import { DocumentEntity } from "../../../../../models/documents/document.entity";
import { StoredFileDto } from "../../../../../models/compiance/stored-file.dto";
import { useFormik } from "formik";
import { CompanyDocumentType } from "../../../../../enums/compliance/company-document-type.enum";
import EntityForm from "../../../../../components/layouts/page/EntityForm";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import { toast } from 'react-toastify'
import ShowFormattedDate from "../../../../../components/jobs/show-formatted-date";
import ShowEnumFromString from "../../../../../components/enum-filters/show-enum-from-string";
import ApplicantApi from "../../../../api/applicant";
import { ApplicantEntity } from "../../../../../models/applicant/applicant.entity";

export default function StoredFiles() {

    const { user, hasPermission } = useAuth();
    const { t } = useTranslation();
    const complianceApi = new ComplianceApi();
    const applicantApi = new ApplicantApi();

    // showFileUploadModel 
    const [showFileUploadModel, setShowFileUploadModel] = useState<boolean>(false);
    const openFileUploadModel = (): void => setShowFileUploadModel(true)
    const closeFileUploadModel = (): void => setShowFileUploadModel(false)

    const [documentId, setDocumentId] = useState<number>(null)
    const resetDocumentId = (): void => setDocumentId(null)

    const columnSettingKey = getDataTableColumnKey("company", user, "stored-files");

    const [files, setFiles] = useState<DocumentEntity[]>([])
    const [applicants, setApplicants] = useState<ApplicantEntity[]>([])

    useEffectAsync(async () => {

        const v = await complianceApi.filesList();
        setFiles(v);

        const data = await applicantApi.list();
        setApplicants(data)

    }, [user], () => {
        console.log("unloading page...")
    });


    const form = useFormik({
        initialValues: new StoredFileDto(),
        validationSchema: StoredFileDto.yupSchema(),
        onSubmit: async (data, { resetForm }) => {
            try {
                await complianceApi.createFile(data)
                    .then((entity: DocumentEntity) => {
                        if (entity) {
                            files.push(entity)
                            files.sort((a, b) => (a.id - b.id))
                            resetForm()
                            closeFileUploadModel()
                            toast.success(t('DOCUMENT_UPLOAD_SUCCESS_MESSAGE'))
                        }
                    })
            } catch (error) {
                globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
            }
        }
    });

    const sendEmail = async (applicant: ApplicantEntity): Promise<void> => {
        try {
            if (documentId)
                await complianceApi.sendComplianceFile(applicant.id, documentId)
                    .then(res => {
                        toast.success(t('DOCUMENT_SENT_SUCCESS_MESSAGE'))
                        setTimeout(() => {
                            resetDocumentId()
                        }, 1000)
                    })
        } catch (error) {
            toast.error(t('DOCUMENT_SENT_FAILED_MESSAGE'))
        }
    }

    //  Uncomment this in debugging mode
    // useEffectAsync(async () => {
    //     console.log("form", form.values)
    //     console.log("form", form.errors)
    // }, [form])

    return (
        <PageLayout
            title="STORED_FILES"
            actions={
                <Button variant="primary" onClick={openFileUploadModel}>
                    <Plus /> {t("UPLOAD_NEW_FILE")}
                </Button>
            }
        >
            <ViewDataTable<DocumentEntity>
                columnSettingKey={columnSettingKey}
                customStyles={{
                    headCells: {
                        style: {
                            background: "#5bb0b9",
                            color: "white"
                        },
                    },
                }}
                columns={[
                    {
                        id: "id",
                        name: "ID",
                        selector: file => file.id,
                        hidable: false
                    },
                    {
                        id: "file_name",
                        name: "file_name",
                        selector: file => file.name,
                        hidable: false
                    },
                    {
                        id: "type",
                        name: "type",
                        cell: file =>
                        (<ShowEnumFromString
                            popover
                            labelPrefix="CompanyDocumentType"
                            str={file.type}
                            enumArray={CompanyDocumentType} />
                        ),
                        selector: file => file.type,
                    },
                    {
                        id: "upload_date",
                        name: "upload_date",
                        selector: file => file.created_at,
                        cell: file => <ShowFormattedDate date={file.created_at} />
                    },
                    {
                        cell: (file) => (
                            <>
                                <button type="button" className="theme-secondary-btn mr-2 px-4 py-2" onClick={() => setDocumentId(file.id)}><Send /></button>
                                <button type="button" className="btn theme-primary-btn download_file_btn px-4"> <a href={file.path} download target="_blank"><CloudArrowDown /></a></button>
                            </>
                        ),
                    },


                ]}
                items={files}
            />

            {/* Model for Upload file */}

            <ViewModal
                show={showFileUploadModel}
                onCloseClick={closeFileUploadModel}
                closeText="CANCEL"
                title="UPLOAD_NEW_FILE"
            >
                <EntityForm
                    formik={form}
                    className="mx-3"
                >
                    <Row>
                        <BaseSelect
                            className="col-12 my-3"
                            label="FILE_TYPE"
                            name="type"
                            required
                            placeholder
                            labelPrefix="CompanyDocumentType"
                            enumType={CompanyDocumentType}
                            formik={form}
                        />
                        <FileInput
                            className="col-12 my-3"
                            label={`pdf`}
                            name={`file`}
                            accept="application/pdf"
                            documentType={"PDF"}
                            formik={form}
                        />
                    </Row>
                </EntityForm>
            </ViewModal>

            {/* Model for send email */}

            <ViewModal
                show={!!documentId}
                onCloseClick={resetDocumentId}
                closeText="CANCEL"
                title="APPLICANTS"
            >
                <ViewDataTable<ApplicantEntity>
                    columnSettingKey={columnSettingKey}
                    customStyles={{
                        headCells: {
                            style: {
                                background: "#5bb0b9",
                                color: "white"
                            },
                        },
                    }}
                    columns={[
                        {
                            id: "id",
                            name: "ID",
                            selector: applicant => applicant.id,
                            hidable: false
                        },
                        {
                            name: "first_name",
                            selector: applicant => applicant.first_name,
                            hidable: false
                        },
                        {
                            name: "last_name",
                            selector: applicant => applicant.last_name,
                            hidable: false
                        },
                        {
                            name: "email",
                            selector: applicant => applicant.email,
                            hidable: false
                        },

                        {
                            cell: (applicant) => (
                                <>
                                    <Button type="button" onClick={() => sendEmail(applicant)} className="theme-secondary-btn mr-2 px-4 py-1"><Send /></Button>
                                </>
                            ),
                        },


                    ]}
                    items={applicants}
                />
            </ViewModal>
        </PageLayout>
    )

};

StoredFiles.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
