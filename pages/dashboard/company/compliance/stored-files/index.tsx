import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { useState } from "react";
import React from "react";
import { Plus } from 'react-bootstrap-icons';
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
import { Formik, useFormik } from "formik";
import { CompanyDocumentType } from "../../../../../enums/compliance/company-document-type.enum";
import EntityForm from "../../../../../components/layouts/page/EntityForm";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import { toast } from 'react-toastify'

export default function StoredFiles() {

    const { user, hasPermission } = useAuth();
    const [showFileUploadModel, setShowFileUploadModel] = useState(false);
    const openFileUploadModel = () => setShowFileUploadModel(true)
    const closeFileUploadModel = () => setShowFileUploadModel(false)

    const columnSettingKey = getDataTableColumnKey("company", user, "stored-files");

    const { t } = useTranslation();
    const [files, setFiles] = useState<DocumentEntity[]>([])
    const complianceAp = new ComplianceApi();

    useEffectAsync(async () => {
        console.log("refresh fired");
        const v = await complianceAp.filesList();

        setFiles(v);
    }, [user], () => {
        console.log("unloading page...")
    });

    // To Do
    // const can = {
    //     editJob: hasPermission("CanUpdateJob"),
    //     deleteJob: hasPermission("CanDeleteJob"),
    // };

    const form = useFormik({
        initialValues: new StoredFileDto(),
        validationSchema: StoredFileDto.yupSchema(),
        onSubmit: async (data, { resetForm }) => {
            try {
                await complianceAp.createFile(data)
                    .then((entity: DocumentEntity) => {
                        if (entity) {
                            files.push(entity)
                            files.sort((a, b) => (a.id - b.id))
                            resetForm()
                            setShowFileUploadModel(false)
                            toast.success(t('DOCUMENT_UPLOAD_SUCCESS_MESSAGE'))
                        }
                    })
                console.log("data: ", data)
            } catch (error) {
                console.log(error)
                globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
            }
        }
    });

    //  Uncomment this in debugging mode
    useEffectAsync(async () => {
        console.log("form", form.values)
        console.log("form", form.errors)
    }, [form])

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
                        selector: j => j.id,
                        hidable: false
                    },
                    {
                        id: "file_name",
                        name: "file_name",
                        // cell: (j) => (<Link href={`${router.asPath}/${j.id}`} ><a>{j.title}</a></Link>),
                        selector: file => file.name,
                        hidable: false
                    },
                    // {
                    //     id: "upload_date",
                    //     name: "upload_date",
                    //     selector: j => j.expiry_date ? new Date(j.expiry_date).toDateString() : null,
                    // },
                    {
                        cell: (j) => (
                            <>
                                <button type="button" className="theme-secondary-btn mr-4 p-2">{t('SEND')}</button>
                                <button type="button" className="btn theme-primary-btn">{t('DOWNLOAD')}</button>
                            </>
                        ),
                    },


                ]}
                items={files}
            />
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
