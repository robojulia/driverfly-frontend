import { FormikErrors, useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { ThreeCircles } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks/use-auth";
import { useTranslation } from "../../../../hooks/use-translation";
import { EmployeeDocumentDto } from "../../../../models/employee/employee-document-dto";
import { EmployeeEntity } from "../../../../models/employee/employee.entity";
import EmployeeApi from "../../../../pages/api/employee";
import CompanyApi from "../../../../pages/api/company";
import { EmployeeAdditionalFilesProps } from "../../../../types/employee/employee-additional-files-props.type";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { useEffectAsync } from "../../../../utils/react";
import FileInput from "../../../forms/file-input";
import ShowFormattedDate from "../../../jobs/show-formatted-date";
import ViewCard from "../../../view-details/view-card";
import ViewPdf from "../../../view-details/view-pdf";

import { DocumentableType } from "../../../../enums/documents/documentable-type.enum";
import { EmployeeDqf } from "../../../../enums/employee/employee-dqf.enum";
import { EmployeeHRFiles } from "../../../../enums/employee/employee-hr-files.enum";
import { CompanyPreferenceCategory } from "../../../../enums/company/company-preference-category.enum";
import { CompanyPreferenceOnboardingChecklistLabel } from "../../../../enums/company/company-preferences-onboarding-checklist-label.enum";
import { CompanyPreferenceEntity } from "../../../../models/company/company-preferences.entity";
import {
    handleDownloadDocument,
    handleViewDocument,
} from "../../../../utils/documents/button-actions";
import {
    AddDocumentButton,
    DeleteDocumentButton,
    DownloadDocumentButton,
    ViewDocumentButton,
} from "../../../documents/buttons";
import ViewDocumentHistory from "../../../documents/view-history";
import { LoaderIcon } from "../../../loading/loader-icon";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { DocumentEntity } from "../../../../models/documents/document.entity";
import BaseInput from "../../../forms/base-input";
import { CompanyPreferencesHRFilesForm } from "../../../forms/company/company-preferences-hr-files-form";

/**
 * Default HR files commonly kept in employee records
 */
const DEFAULT_HR_FILES = [
    EmployeeHRFiles.RESUME,
    EmployeeHRFiles.OFFER_LETTER,
    EmployeeHRFiles.W9_FORM,
    EmployeeHRFiles.W4_FORM,
    EmployeeHRFiles.I9_FORM,
    EmployeeHRFiles.SECOND_ID,
    EmployeeHRFiles.COMPANY_POLICIES_RECEIPT,
    EmployeeHRFiles.CONTROLLED_SUBSTANCE_POLICY_RECEIPT,
    EmployeeHRFiles.BANK_DEPOSIT_INFO,
    EmployeeHRFiles.EMERGENCY_CONTACT_LIST,
    EmployeeHRFiles.TRUCK_PROVIDED,
];

/**
 * Formats a string by removing underscores and converting to sentence case
 */
const formatLabel = (label: string): string => {
    return label
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase());
};

export default function HRFiles(props: EmployeeAdditionalFilesProps) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const employeeApi = new EmployeeApi();
    const companyApi = new CompanyApi();

    const [employee, setEmployee] = useState<EmployeeEntity>(null);
    const [documents, setDocuments] = useState<DocumentEntity[]>([]);
    const [editList, setEditList] = useState<boolean>(false);
    const [companyHRFilesPreferences, setCompanyHRFilesPreferences] = useState<CompanyPreferenceEntity[]>();

    useEffectAsync(async () => {
        const data = await employeeApi.getById(props?.employee?.id);
        setEmployee(data);

        if (user?.company) {
            const preferences = await companyApi.preferences.list(user.company.id, {
                category: CompanyPreferenceCategory.ONBOARDING_CHECKLIST,
            });
            setCompanyHRFilesPreferences(preferences);
        }
    }, [user]);

    const companyHRFilesList = useMemo(
        () =>
            companyHRFilesPreferences?.find(
                ({ label }) =>
                    label == CompanyPreferenceOnboardingChecklistLabel.EMPLOYEE_HR_FILES
            ),
        [companyHRFilesPreferences]
    );

    // Update documents when employee or preferences change
    useEffect(() => {
        if (!employee?.documents) return;

        // Get all document types that should be displayed
        // This includes both the default HR files and any custom types added by the company
        const hrFilesList = companyHRFilesList?.value || DEFAULT_HR_FILES;

        // Get all documents that match HR file types (both in current list and previously uploaded)
        // We preserve all documents that were once HR files, even if removed from the current list
        const allHRDocTypes = new Set([
            ...Object.values(EmployeeHRFiles),
            ...(companyHRFilesList?.value || [])
        ]);

        setDocuments(employee.documents?.filter(v =>
            allHRDocTypes.has(v.type as any) &&
            !Object.values(EmployeeDqf).includes(v.type as EmployeeDqf)
        ) || []);
    }, [employee, companyHRFilesList]);

    const [pdf, setPdf] = useState({});

    const form = useFormik({
        initialValues: new EmployeeDocumentDto(),
        validationSchema: EmployeeDocumentDto.yupSchema(),
        onSubmit: async ({ document }, { resetForm }) => {
            if (
                (!document.id &&
                    documents.find((v) => v.type == document.type)) ||
                (document.id &&
                    documents.find(
                        (v) => v.type == document.type && v.id != document.id
                    ))
            ) {
                form.setFieldError("document.type", "DOCUMENT_TYPE_UNIQUE");
                return;
            }
            try {
                const uploadedDocument = await employeeApi.documents.create(
                    employee.id,
                    document
                );

                setDocuments([
                    ...(document.id
                        ? documents.filter((v) => v.id != uploadedDocument.id)
                        : documents),
                    uploadedDocument,
                ]);
                toast.success(t("DOCUMENT_UPLOAD_SUCCESS_MESSAGE"));
                resetForm();
            } catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
            }
        },
    });

    const handleDeleteDocument = async (
        docType: EmployeeHRFiles | string
    ): Promise<void> => {
        await employeeApi.documents.delete(employee?.id, docType);
        setDocuments(documents?.filter((v) => v.type != docType));
    };

    const handleUpdateDocument = (
        type: EmployeeHRFiles,
        documentId?: number
    ): Promise<void> | Promise<FormikErrors<EmployeeDocumentDto>> =>
        form.setFieldValue("document", documents?.find(v => v.type == type) || { type });

    const ButtonList = ({ document, type }): JSX.Element => (
        <div className="d-flex">
            <ViewDocumentButton
                document={document}
                onClick={() => handleViewDocument(document.id, setPdf)}
            />
            {props.canEdit &&
                <AddDocumentButton
                    document={document}
                    type={type}
                    t={t}
                    onClick={() => handleUpdateDocument(type, document?.id)}
                />
            }
            <DownloadDocumentButton
                document={document}
                onClick={() => handleDownloadDocument(document.id)}
            />
            {props.canEdit &&
                <DeleteDocumentButton
                    document={document}
                    onClick={() => handleDeleteDocument(type)}
                />
            }
            <ViewDocumentHistory
                document={document}
                type={type}
                documentable_id={employee.id}
                documentable_type={DocumentableType.EMPLOYEE}
            />
        </div>
    );

    const UpdatedAt = ({ document, type }): JSX.Element => (
        <>
            {document ? (
                <ShowFormattedDate date={document.last_updated_at} />
            ) : null}
        </>
    );

    return (
        <div className="employee_directory_tabs">
            <Row>
                <Col>
                    {!!employee ? (
                        <>
                            {/* Teal Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, rgb(0, 96, 120) 0%, rgb(29, 67, 84) 100%)',
                                borderRadius: '0.5rem',
                                padding: '1.25rem 1.5rem',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h5 style={{ color: '#fff', margin: 0, fontWeight: 600, fontSize: '1.125rem' }}>
                                        {t("HR Files - Eric Frost")}
                                    </h5>
                                    <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                                        {t("Manage and track employee documents and compliance requirements")}
                                    </p>
                                </div>
                                <div className="d-flex" style={{ gap: '0.5rem' }}>
                                    <Button
                                        variant="link"
                                        className="p-0 text-white"
                                        size="sm"
                                        onClick={() => setEditList(!editList)}
                                    >
                                        {editList ? t("CANCEL") : t("EDIT_LIST")}
                                    </Button>
                                    {props.canEdit && !editList && (
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                form.setValues({ document: { ...(new DocumentEntity()), documentable_id: employee.id } })
                                            }
                                            style={{
                                                backgroundColor: 'transparent',
                                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                                color: '#fff'
                                            }}
                                        >
                                            + {t("Add Document")}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        <ViewCard
                            title=""
                            noTitle={true}
                        >
                            {editList ? (
                                <CompanyPreferencesHRFilesForm
                                    className="m-5"
                                    companyHRFilesList={companyHRFilesList}
                                    onSaveComplete={(newHRFilesList: CompanyPreferenceEntity) => {
                                        setCompanyHRFilesPreferences([
                                            ...companyHRFilesPreferences?.filter(
                                                (v) =>
                                                    v.label !==
                                                    CompanyPreferenceOnboardingChecklistLabel.EMPLOYEE_HR_FILES
                                            ),
                                            newHRFilesList,
                                        ]);
                                        setEditList(false);
                                    }}
                                />
                            ) : (
                                <>
                                    {form.values?.document?.documentable_id && !form.values?.document?.id && (
                                        <form onSubmit={form.handleSubmit} onReset={() => form.resetForm()}>
                                            <Table style={{ backgroundColor: '#fff' }}>
                                                <thead style={{ backgroundColor: '#fff' }}>
                                                    <tr>
                                                        <th>{t("Document Name")}</th>
                                                        <th>{t("Document")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <BaseInput
                                                                name={`document.type`}
                                                                required
                                                                placeholder="DOCUMENT_NAME"
                                                                formik={form}
                                                            />
                                                        </td>
                                                        <td>
                                                            <FileInput
                                                                name={`document`}
                                                                required
                                                                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                                                                allowedTypesFriendlyName="PDF, Word, or Image files"
                                                                allowedSizeInByte={3145728}
                                                                formik={form}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                            <div className="d-flex w-100 mb-3">
                                                <Button
                                                    type="submit"
                                                    className="mr-1 w-50 theme-primary-btn"
                                                >
                                                    {t("SAVE")}
                                                </Button>
                                                <Button
                                                    type="reset"
                                                    className="ml-1 w-50"
                                                >
                                                    {t("CANCEL")}
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                    <Table style={{ backgroundColor: '#fff' }}>
                                        <thead style={{ backgroundColor: '#fff' }}>
                                            <tr>
                                                <th colSpan={2}>{t("Document Name")}</th>
                                                <th colSpan={2}>{t("Frequency")}</th>
                                                <th colSpan={2}>{t("Updated At")}</th>
                                                <th colSpan={2}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Show all types from the current list */}
                                            {(companyHRFilesList?.value || DEFAULT_HR_FILES).map((type: string, i) => {
                                                const document: DocumentEntity = documents?.find(v => v.type == type);
                                                // Check if it's a known enum value or custom string
                                                const isEnumValue = Object.values(EmployeeHRFiles).includes(type as EmployeeHRFiles);
                                                const displayText = formatLabel(type);

                                                return (
                                                    <tr key={i}>
                                                        <td colSpan={2}>
                                                            {displayText}
                                                            {!isEnumValue && <span className="text-muted ms-2">(Custom)</span>}
                                                        </td>
                                                        <td colSpan={2} className="w-25">
                                                            {type === EmployeeHRFiles.RESUME && t('ONE_TIME_AT_HIRE')}
                                                            {type === EmployeeHRFiles.OFFER_LETTER && t('ONE_TIME_AT_HIRE')}
                                                            {type === EmployeeHRFiles.W9_FORM && t('ONE_TIME_AT_HIRE')}
                                                            {type === EmployeeHRFiles.W4_FORM && t('ONE_TIME_AT_HIRE')}
                                                            {type === EmployeeHRFiles.I9_FORM && t('AT_HIRE_SUPPORTING_IDS')}
                                                            {type === EmployeeHRFiles.SECOND_ID && t('AT_HIRE_I9_VERIFICATION')}
                                                            {type === EmployeeHRFiles.COMPANY_POLICIES_RECEIPT && t('ONE_TIME_AT_HIRE_ACKNOWLEDGMENT')}
                                                            {type === EmployeeHRFiles.CONTROLLED_SUBSTANCE_POLICY_RECEIPT && t('ONE_TIME_AT_HIRE_ACKNOWLEDGMENT')}
                                                            {type === EmployeeHRFiles.BANK_DEPOSIT_INFO && t('AT_HIRE_UPDATE_IF_CHANGED')}
                                                            {type === EmployeeHRFiles.EMERGENCY_CONTACT_LIST && t('AT_HIRE_UPDATE_IF_CHANGED')}
                                                            {type === EmployeeHRFiles.TRUCK_PROVIDED && t('ONE_TIME_AT_HIRE_INTERNAL')}
                                                        </td>
                                                        <td colSpan={2} className="w-25">
                                                            <UpdatedAt document={document} type={type} />
                                                        </td>
                                                        <td colSpan={2} className="border border-2 w-50">
                                                            {form.values?.document?.id != document?.id
                                                                ? <ButtonList document={document} type={type} />
                                                                : <Form
                                                                    onSubmit={form.handleSubmit}
                                                                    onReset={() => form.resetForm()}
                                                                >
                                                                    <BaseInput
                                                                        label="DOCUMENT_NAME"
                                                                        name={`document.type`}
                                                                        required
                                                                        placeholder="DOCUMENT_NAME"
                                                                        formik={form}
                                                                        className="mb-2"
                                                                    />
                                                                    <FileInput
                                                                        name={`document`}
                                                                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                                                                        allowedTypesFriendlyName="PDF, Word, or Image files"
                                                                        formik={form}
                                                                        allowedSizeInByte={3145728}
                                                                    />
                                                                    <div className="mt-2 d-flex w-100 ">
                                                                        <Button
                                                                            disabled={
                                                                                form.isSubmitting ||
                                                                                !form.isValid ||
                                                                                form.isValidating
                                                                            }
                                                                            className="mr-2 w-50 theme-primary-btn"
                                                                            type="submit"
                                                                        >
                                                                            {t(`SAVE`)}
                                                                            <LoaderIcon isLoading={!!form.values?.document?.id && form.isSubmitting} />
                                                                        </Button>
                                                                        <Button
                                                                            type="reset"
                                                                            className="mr-2 w-50 bg-danger"
                                                                        >
                                                                            {t(`CANCEL`)}
                                                                        </Button>
                                                                    </div>
                                                                </Form>
                                                            }
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {/* Show documents that were previously uploaded but are no longer in the current list */}
                                            {documents?.filter(doc =>
                                                !(companyHRFilesList?.value || DEFAULT_HR_FILES).includes(doc.type)
                                            ).map((document: DocumentEntity, i) => {
                                                const type = document.type;
                                                const isEnumValue = Object.values(EmployeeHRFiles).includes(type as EmployeeHRFiles);
                                                const displayText = formatLabel(type);

                                                return (
                                                    <tr key={`archived-${i}`} style={{ backgroundColor: '#f8f9fa' }}>
                                                        <td colSpan={2}>
                                                            {displayText}
                                                            <span className="text-muted ms-2">(Archived - Not in current list)</span>
                                                        </td>
                                                        <td colSpan={2} className="w-25">
                                                            {type === EmployeeHRFiles.RESUME && t('ONE_TIME_AT_HIRE')}
                                                            {type === EmployeeHRFiles.OFFER_LETTER && t('ONE_TIME_AT_HIRE')}
                                                            {type === EmployeeHRFiles.W9_FORM && t('ONE_TIME_AT_HIRE')}
                                                            {type === EmployeeHRFiles.W4_FORM && t('ONE_TIME_AT_HIRE')}
                                                            {type === EmployeeHRFiles.I9_FORM && t('AT_HIRE_SUPPORTING_IDS')}
                                                            {type === EmployeeHRFiles.SECOND_ID && t('AT_HIRE_I9_VERIFICATION')}
                                                            {type === EmployeeHRFiles.COMPANY_POLICIES_RECEIPT && t('ONE_TIME_AT_HIRE_ACKNOWLEDGMENT')}
                                                            {type === EmployeeHRFiles.CONTROLLED_SUBSTANCE_POLICY_RECEIPT && t('ONE_TIME_AT_HIRE_ACKNOWLEDGMENT')}
                                                            {type === EmployeeHRFiles.BANK_DEPOSIT_INFO && t('AT_HIRE_UPDATE_IF_CHANGED')}
                                                            {type === EmployeeHRFiles.EMERGENCY_CONTACT_LIST && t('AT_HIRE_UPDATE_IF_CHANGED')}
                                                            {type === EmployeeHRFiles.TRUCK_PROVIDED && t('ONE_TIME_AT_HIRE_INTERNAL')}
                                                        </td>
                                                        <td colSpan={2} className="w-25">
                                                            <UpdatedAt document={document} type={type} />
                                                        </td>
                                                        <td colSpan={2} className="border border-2 w-50">
                                                            <ButtonList document={document} type={type} />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                    <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />
                                </>
                            )}
                        </ViewCard>
                        </>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center">
                            <ThreeCircles
                                height={50}
                                width={50}
                                color="#5bb0b9"
                                ariaLabel="ball-triangle-loading"
                                visible={true}
                            />
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
}
