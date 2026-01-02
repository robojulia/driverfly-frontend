import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { ThreeCircles } from 'react-loader-spinner';
import { toast } from "react-toastify";
import { DocumentableType } from "../../../../enums/documents/documentable-type.enum";
import { EmployeeDqf } from "../../../../enums/employee/employee-dqf.enum";
import { CompanyPreferenceCategory } from "../../../../enums/company/company-preference-category.enum";
import { CompanyPreferenceOnboardingChecklistLabel } from "../../../../enums/company/company-preferences-onboarding-checklist-label.enum";
import { useAuth } from "../../../../hooks/use-auth";
import { useTranslation } from "../../../../hooks/use-translation";
import { DocumentEntity } from "../../../../models/documents/document.entity";
import { EmployeeDocumentDto } from "../../../../models/employee/employee-document-dto";
import { EmployeeEntity } from "../../../../models/employee/employee.entity";
import { CompanyPreferenceEntity } from "../../../../models/company/company-preferences.entity";
import EmployeeApi from "../../../../pages/api/employee";
import CompanyApi from "../../../../pages/api/company";
import { ViewEmployeeDqfProps } from "../../../../types/employee/view-employee-dqf-props.type";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { handleDownloadDocument, handleViewDocument } from "../../../../utils/documents/button-actions";
import { useEffectAsync } from "../../../../utils/react";
import { AddDocumentButton, DeleteDocumentButton, DownloadDocumentButton, ViewDocumentButton } from "../../../documents/buttons";
import ViewDocumentHistory from "../../../documents/view-history";
import FileInput from '../../../forms/file-input';
import ShowFormattedDate from "../../../jobs/show-formatted-date";
import { LoaderIcon } from "../../../loading/loader-icon";
import ViewCard from "../../../view-details/view-card";
import ViewPdf from "../../../view-details/view-pdf";
import SafetyPerformanceHistory from "../safety-performance-history";
import { CompanyPreferencesDqfForm } from "../../../forms/company/company-preferences-dqf-form";

/**
 * Default DQF documents commonly kept in driver qualification files
 * These are the standard documents required by FMCSA regulations for DQF compliance
 *
 * Required Documents:
 * - Driver employment application
 * - Copy of CDL or driver's license
 * - Medical examiner's certificate (Med Card)
 * - State Motor Vehicle Record (MVR) – pre-hire and annual
 * - Road test certificate or CDL skills test equivalent
 * - Safety Performance History Request responses (3-year investigations)
 * - Records of violations review (annual certification by driver)
 * - Proof of PSP review (if used)
 *
 * Optional/Conditional Documents:
 * - Drug and alcohol testing results (pre-employment + follow-ups)
 * - Medical examination report (long form)
 * - Previous employer reference attempts
 */
const DEFAULT_DQF_DOCUMENTS = [
    // Required core DQF documents
    EmployeeDqf.EMPLOYMENT_APPLICATION,
    EmployeeDqf.DRIVER_LICENSE,
    EmployeeDqf.MEDICAL_EXAMINER_CERTIFICATE_MEDICAL_CARD,
    EmployeeDqf.MOTOR_VEHICLE_RECORD_MVR,
    EmployeeDqf.DRIVER_ROAD_TEST_CERTIFICATE_OR_EQUIVALENT,
    EmployeeDqf.SAFETY_PERFORMANCE_HISTORY,
    EmployeeDqf.DRIVER_CERTIFICATION_OF_VIOLATIONS_ANNUAL,
    EmployeeDqf.PSP_RECORD,
    // Annual requirements
    EmployeeDqf.ANNUAL_MVR_REVIEW_NOTES_OPTIONAL,
    EmployeeDqf.DRUG_AND_ALCOHOL_CLEARINGHOUSE_QUERY_ANNUAL,
    // Common optional/conditional documents
    EmployeeDqf.PRE_EMPLOYMENT_DRUG_TEST,
    EmployeeDqf.MEDICAL_EXAMINATION_REPORT_LONG_FORM,
    EmployeeDqf.RECORD_OF_ATTEMPTS_SAFETY_PERFORMANCE_HISTORY,
];

/**
 * Formats a string by removing underscores and converting to proper title case
 * Example: "MOTOR_VEHICLE_RECORD_MVR" -> "Motor Vehicle Record (MVR)"
 */
const formatLabel = (label: string): string => {
    return label
        .replace(/_/g, ' ')
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/\bMvr\b/g, '(MVR)')
        .replace(/\bDot\b/g, 'DOT')
        .replace(/\bPsp\b/g, 'PSP')
        .replace(/\bTwic\b/g, 'TWIC')
        .replace(/\bHos\b/g, 'HOS')
        .replace(/\bCdl\b/g, 'CDL')
        .replace(/\bId\b/g, 'ID')
        .replace(/\bW 9\b/g, 'W-9')
        .replace(/\bW 4\b/g, 'W-4')
        .replace(/\bI 9\b/g, 'I-9');
};

export default function DQF(props: ViewEmployeeDqfProps) {

    const { t } = useTranslation();
    const { user } = useAuth();
    const employeeApi = new EmployeeApi();
    const companyApi = new CompanyApi();

    const [pdf, setPdf] = useState({});
    const [employee, setEmployee] = useState<EmployeeEntity>(null);
    const [editList, setEditList] = useState<boolean>(false);
    const [companyDqfPreferences, setCompanyDqfPreferences] = useState<CompanyPreferenceEntity[]>();

    useEffectAsync(async () => {
        if (props.employee?.id) setEmployee(props.employee);
        if (user?.company) {
            const preferences = await companyApi.preferences.list(user.company.id, {
                category: CompanyPreferenceCategory.DQF,
            });
            setCompanyDqfPreferences(preferences);
        }
    }, [user]);

    const companyDqfList = useMemo(
        () =>
            companyDqfPreferences?.find(
                ({ label }) =>
                    label == CompanyPreferenceOnboardingChecklistLabel.EMPLOYEE_DQF_DOCUMENTS
            ),
        [companyDqfPreferences]
    );

    const form = useFormik({
        initialValues: new EmployeeDocumentDto(),
        validationSchema: EmployeeDocumentDto.yupSchema(),
        onSubmit: async ({ document }, { resetForm }) => {
            try {
                const employeeDocumentUpload = await employeeApi.documents.create(employee.id, document)

                if (document.id) {
                    employee.documents = employee.documents.filter(v => (v.id != employeeDocumentUpload.id))
                }
                employee.documents.push(employeeDocumentUpload)
                toast.success(t('DOCUMENT_UPLOAD_SUCCESS_MESSAGE'))
                resetForm()
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
            }
        }
    });

    /**
     * It deletes a document from the employee's profile.
     * @param {EmployeeDqf | string} docType - The type of document you want to
     * delete.
     */
    const handleDeleteDocument = async (docType: EmployeeDqf | string): Promise<void> => {
        await employeeApi.documents.delete(employee?.id, docType)
        setEmployee({
            ...employee,
            documents: employee?.documents?.filter(v => (v.type != docType))
        })
    }

    /**
     * It takes a type and an optional documentId, and sets the form's document field to an object with the
     * type and id
     * @param {EmployeeDqf} type - EmployeeDqf - this is the type of document that is being uploaded.
     * @param {number} [documentId] - The id of the document to be updated.
     */
    const handleUpdateDocument = (
        type: EmployeeDqf,
        documentId?: number
    ): void => {
        form.setFieldValue("document", { type, id: documentId ?? null })
    }

    /* This is a functional component in TypeScript React that renders a list of buttons for a
    given document and type. It conditionally renders the buttons based on whether the document type
    matches the given type and whether the type is SAFETY_PERFORMANCE_HISTORY. The buttons include
    ViewDocumentButton, AddDocumentButton, DownloadDocumentButton, DeleteDocumentButton, and
    ViewDocumentHistory. If the type is SAFETY_PERFORMANCE_HISTORY, it renders the
    SafetyPerformanceHistory component instead of the buttons. */
    const ButtonList = ({ document, type }): JSX.Element =>
        (!form.values.document?.type || form.values.document?.type != type) && (
            <div className="d-flex">
                <ViewDocumentButton
                    document={document}
                    onClick={() => handleViewDocument(document.id, setPdf)}
                />
                {Boolean(props.canEdit) && (
                    <AddDocumentButton
                        document={document}
                        type={type}
                        t={t}
                        onClick={() => handleUpdateDocument(type, document?.id)}
                    />
                )}
                <DownloadDocumentButton
                    document={document}
                    onClick={() => handleDownloadDocument(document.id)}
                />
                {Boolean(props.canEdit) && (
                    <DeleteDocumentButton
                        document={document}
                        onClick={() => handleDeleteDocument(type)}
                    />
                )}
                {type == EmployeeDqf.SAFETY_PERFORMANCE_HISTORY && (
                    <SafetyPerformanceHistory
                        buttonClass="mr-2 w-50"
                        employee={employee}
                        canEditSafetyPerformance={props.canEditSafetyPerformance}
                        showHistory={props.showHistory}
                        showResendButton={props.showResendButton}
                    />
                )}
                {Boolean(props.showHistory) && (
                    <ViewDocumentHistory
                        document={document}
                        type={type}
                        typePrefix="EmployeeDqf"
                        documentable_id={employee.id}
                        documentable_type={DocumentableType.EMPLOYEE}
                    />
                )}
            </div>
        );

    /**
     * This is a TypeScript React component that displays the last updated date of a document, unless the
     * document type is EmployeeDqf.SAFETY_PERFORMANCE_HISTORY.
     * @param  - The function `UpdatedAt` takes two parameters:
     */
    const UpdatedAt = ({ document, type }): JSX.Element => {
        if (type == EmployeeDqf.SAFETY_PERFORMANCE_HISTORY) return (<></>)

        return (<>
            {document
                ? <ShowFormattedDate date={document.last_updated_at} />
                : null}
        </>)
    }

    const title = props.title ?? "DQF Documents - DQF Files";
    const actions = (
        <Button variant="link" className="p-0 text-white" size="sm" onClick={() => setEditList(!editList)}>
            {editList ? t("CANCEL") : t("EDIT_LIST")}
        </Button>
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
                                        {t(title)}
                                    </h5>
                                    <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                                        {t("Manage and track essential documents and compliance requirements")}
                                    </p>
                                </div>
                                <div>{actions}</div>
                            </div>
                        <ViewCard title="" noTitle={true}>
                            {editList ? (
                                <CompanyPreferencesDqfForm
                                    className="m-5"
                                    companyDqfList={companyDqfList}
                                    onSaveComplete={(newDqfList: CompanyPreferenceEntity) => {
                                        setCompanyDqfPreferences([
                                            ...companyDqfPreferences?.filter(
                                                (v) =>
                                                    v.label !==
                                                    CompanyPreferenceOnboardingChecklistLabel.EMPLOYEE_DQF_DOCUMENTS
                                            ),
                                            newDqfList,
                                        ]);
                                        setEditList(false);
                                    }}
                                />
                            ) : (
                                <>
                                    <Table style={{ backgroundColor: '#fff' }}>
                                        <thead style={{ backgroundColor: '#fff' }}>
                                            <tr>
                                                <th colSpan={2}>{t("Document Name")}</th>
                                                {
                                                    Boolean(props.showCompleted) && <th colSpan={2}>{t("Completed?")}</th>
                                                }
                                                <th colSpan={2}>{t("Updated At")}</th>
                                                <th colSpan={1}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(companyDqfList?.value || DEFAULT_DQF_DOCUMENTS).map((type: string, i) => {
                                                /* Finding the document in the employee.documents array that has the same type. */
                                                const document: DocumentEntity = employee?.documents?.find(v => (v.type == type))
                                                // Check if it's a known enum value or custom string
                                                const isEnumValue = Object.values(EmployeeDqf).includes(type as EmployeeDqf);
                                                const displayText = formatLabel(type);

                                                return (
                                                    <tr key={i}>
                                                        <td colSpan={2}>
                                                            {displayText}
                                                            {!isEnumValue && <span className="text-muted ms-2">(Custom)</span>}
                                                        </td>
                                                        {Boolean(props.showCompleted)
                                                            &&
                                                            <td colSpan={1} className="text-center">
                                                                <input className="form-check-input" type="radio" disabled checked={Boolean(document?.id)} />
                                                            </td>
                                                        }
                                                        <td colSpan={2} className="w-25">
                                                            <UpdatedAt document={document} type={type} />
                                                        </td>
                                                        <td colSpan={1} className="border border-2 w-50">
                                                            <ButtonList document={document} type={type} />
                                                            {(form.values?.document?.type == type)
                                                                && <Form onSubmit={form.handleSubmit} onReset={() => form.resetForm()}>
                                                                    <FileInput
                                                                        name={`document`}
                                                                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                                                                        formik={form}
                                                                        allowedSizeInByte={3145728}
                                                                    />
                                                                    <div className="mt-2 d-flex w-100 ">
                                                                        <Button
                                                                            disabled={form.isSubmitting || !form.isValid || form.isValidating}
                                                                            className="mr-2 w-50 theme-primary-btn"
                                                                            type="submit"
                                                                        >{t(`SAVE`)} <LoaderIcon isLoading={form.isSubmitting} /></Button>
                                                                        <Button
                                                                            type="reset"
                                                                            className="mr-2 w-50 bg-danger"
                                                                        >{t(`CANCEL`)}</Button>
                                                                    </div>
                                                                </Form>
                                                            }
                                                        </td>
                                                    </tr>
                                                )
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
        </div >
    );
};