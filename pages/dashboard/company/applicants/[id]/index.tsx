import { toast } from "react-toastify";

import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ArrowsExpand, BookmarkCheck, BookmarkDash, Pencil, Plus, PlusLg, Trash } from "react-bootstrap-icons";

import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";

import { useRouter } from "next/router";
import { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "../../../../../hooks/useTranslation";
import { useEffectAsync } from "../../../../../utils/react";
import { useAuth } from "../../../../../hooks/useAuth";

import { calculateAge, dateRange } from "../../../../../utils/date";
import { buildAddress } from "../../../../../utils/common";

import Link from "next/link";
import ViewDetails from "../../../../../components/viewDetails/viewDetails";
import ViewTable from "../../../../../components/viewDetails/viewTable";
import BaseTextArea from "../../../../../components/forms/BaseTextArea";
import ViewModal from "../../../../../components/viewDetails/viewModal";
import ViewPdf from "../../../../../components/viewDetails/viewPdf";
import ViewCard from "../../../../../components/viewDetails/viewCard";
import ShowEnumFromString from "../../../../../components/enum-filters/show-enum-from-string";

import { ApplicantEntity } from "../../../../../models/applicant/applicant.entity";
import { ApplicantNoteEntity } from "../../../../../models/applicant/applicant-note.entity";

import { JobEquipmentType } from "../../../../../enums/jobs/job-equipment-type.enum";
import { ApplicantStatus } from "../../../../../enums/applicants/applicant-status.enum";

import ApplicantApi from "../../../../api/applicant";
import DocumentApi from "../../../../api/document";
import ChildPageLayout from "../../../../../components/layouts/page/ChildPageLayout";
import SuggestedJobs from "../../../../../components/dashboard/driver/suggested-jobs";
import { ApplicantSuggestedJobEntity } from "../../../../../models/applicant/applicant-suggested-job.entity";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import { jobGeography } from "../../../../../utils/jobs";

export default function ViewApplicant({ id }) {
    const router = useRouter();

    const { t } = useTranslation();

    const { hasPermission } = useAuth();

    const protectedFields = {
        license_number: hasPermission("CanViewApplicant.license_number"),
        social_security_number: hasPermission("CanViewApplicant.social_security_number"),
    };

    const [applicant, setApplicant] = useState<ApplicantEntity>(new ApplicantEntity());
    const [applicantSuggestedJobs, setApplicantSuggestedJobs] = useState<ApplicantSuggestedJobEntity[]>([]);

    const backPath = "/dashboard/company/applicants";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    useEffectAsync(async () => {
        if (id) {
            const api = new ApplicantApi();

            const data = await api.getById(+id);

            const suggestedJobs = await api.suggestedJobs.get(id);
            setApplicantSuggestedJobs(suggestedJobs);

            if (!data) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: t("APPLICANT") }));
                goBack();
                return;
            }

            setApplicant(data);
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "APPLICANT" }, { translateProps: true }));
            goBack();
        }

    }, [id]);

    const [pdf, setPdf] = useState({});

    const viewDocumentClick = async (id, name) => {
        const api = new DocumentApi();

        const document = await api.getSignedUrl(id);

        if (document) {
            setPdf({
                name: `${t(name)} (${document.name})`,
                url: document.path
            });
        }
    }

    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

    const addNoteForm = useFormik({
        initialValues: new ApplicantNoteEntity(),
        validationSchema: ApplicantNoteEntity.yupSchema(),
        onSubmit: async (values, { resetForm }) => {
            try {
                const api = new ApplicantApi();

                let note: ApplicantNoteEntity;
                let notes: ApplicantNoteEntity[] = applicant.notes;

                if (values.id) {
                    note = await api.notes.update(values.id, values);
                    notes = applicant.notes.filter(v => (v.id !== note.id))
                } else {
                    note = await api.notes.create(applicant.id, values);
                }

                handleNoteModalClose()
                setApplicant({
                    ...applicant,
                    notes: [
                        ...notes,
                        note
                    ]
                });
                resetForm()
            } catch (e) {
                globalAjaxExceptionHandler(e, { t: t, defaultMessage: "UNABLE_TO_SAVE", toast: toast });
            }

        }
    });

    const [addNoteVisible, setAddNoteVisible] = useState(false);
    const showNoteModal = () => setAddNoteVisible(true)
    const hideNoteModal = () => setAddNoteVisible(false)

    const handleNoteModalShow = () => {
        addNoteForm.setValues({ text: null })
        showNoteModal()
    }
    const handleNoteModalClose = () => {
        addNoteForm.setValues({ text: null })
        hideNoteModal()
    }

    const editNoteClick = (noteId: number) => {
        let note = applicant.notes.find(v => (v.id === noteId))
        addNoteForm.setValues({ id: noteId, text: note.text });
        showNoteModal()
    }

    const deleteNoteClick = async (noteId: number) => {
        addNoteForm.setValues({ id: noteId });
        setShowConfirmationModal(true);
    }

    const handleConfirmClick = async () => {
        try {
            const noteId = addNoteForm.values?.id
            if (!!!noteId) {
                setShowConfirmationModal(false);
                return
            }

            const applicantApi = new ApplicantApi();
            const response = await applicantApi.notes.remove(noteId);

            if (response.affected) {
                const notes = applicant.notes.filter(v => (v.id !== noteId))
                setApplicant({ ...applicant, notes })
            }

            setShowConfirmationModal(false);
            addNoteForm.resetForm()
        } catch (e) {
            globalAjaxExceptionHandler(e, { t: t, defaultMessage: "UNABLE_TO_DELETE", toast: toast });
        }
    }

    const onEditClick = async () => {

        await router.push(router.asPath + `/edit`);

    };

    const onAssignClick = async () => {
        const api = new ApplicantApi();


        setApplicant(await api.assign(applicant.id));
    }

    const onUnassignClick = async () => {
        const api = new ApplicantApi();


        setApplicant(await api.unassign(applicant.id));
    };

    const canEdit = hasPermission("CanUpdateApplicant");

    const title = t("VIEW_{name}", { name: "APPLICANT" }, { translateProps: true });

    return (
        <ChildPageLayout
            backPath={backPath}
            title={title}
        >
            {canEdit &&
                <Row>
                    <Col>
                        <div style={{ float: "right", marginBottom: "10px" }}>
                            <ButtonGroup size="sm">
                                <Button type="button" className='theme-general-btn' variant='' onClick={onAssignClick}>
                                    <BookmarkCheck /> {t("ASSIGN_TO_ME")}
                                </Button>
                                {
                                    applicant?.assignedUser &&
                                    <Button type="button" variant='danger' onClick={onUnassignClick}>
                                        <BookmarkDash /> {t("UNASSIGN")}
                                    </Button>
                                }
                                <Button type="button" onClick={onEditClick}>
                                    <Pencil /> {t("EDIT")}
                                </Button>
                            </ButtonGroup>

                        </div>
                    </Col>
                </Row>
            }
            <Row>
                <Col>
                    <ViewCard title={`${applicant?.first_name} ${applicant?.last_name}`}>
                        <Row>
                            <Col md="4" className="px-2">
                                <ViewDetails
                                    default={t("NOT_ANSWERED")}
                                    obj={{
                                        ASSIGNED_TO: applicant.assignedUser?.name || t("NONE"),
                                        PHONE: applicant.phone,
                                        EMAIL: applicant.email,
                                        STREET: applicant.street,
                                        CITY: applicant.city,
                                        STATE_AND_ZIP: `${applicant?.state || ""} ${applicant?.zip_code || ""}`.trim()
                                    }}
                                />
                            </Col>
                            <Col md="4" className="px-2">
                                <ViewDetails
                                    default={t("NOT_ANSWERED")}
                                    obj={{
                                        driver_license_number: protectedFields.license_number ? applicant.license_number : t("HIDDEN"),
                                        expiration_date: applicant.license_expiry,
                                        state_issued: applicant.license_state,
                                        cdl_class_type: applicant.license_type ? t(`DriverLicenseType.${applicant.license_type}`) : null,
                                        years_cdl_experience: applicant.years_cdl_experience,
                                        OWNER_OPERATOR: { text: applicant.is_owner_operator, default: t("UNKNOWN") },
                                        AUTHORIZED_TO_WORK_IN_THE_US: applicant.authorized_to_work_in_us,
                                        PREFERRED_LOCATION: applicant.preferred_location?.map(v => t(`JobGeography.${v}`))

                                    }}
                                />
                            </Col>
                            <Col md="4" className="px-2">
                                <ViewDetails
                                    default={t("NOT_ANSWERED")}
                                    obj={{
                                        transmission_type: applicant.transmission_type?.map(v => t(`VehicleTransmissionType.${v}`)),
                                        ENDORSEMENTS: applicant.endorsements?.map(v => t(`DriverEndorsement.${v}`)),
                                        above_21: applicant.birthdate ? calculateAge(applicant.birthdate) >= 21 : null,
                                        highest_degree: applicant.highest_degree ? t(`EducationLevel.${applicant.highest_degree}`) : null,
                                        emergency_contact: applicant.emergency_contact_name,
                                        phone: applicant.emergency_contact_number,
                                        relationship: applicant.emergency_contact_relationship,
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <ViewDetails
                                    default={t("NONE")}
                                    obj={{
                                        equipment_experience: {
                                            items: applicant.equipment_experience?.map(v => ({
                                                type: v.type == JobEquipmentType.OTHER ? v.type_other : t(`JobEquipmentType.${v.type}`),
                                                years: v.years
                                            }))
                                        },
                                    }}
                                />
                            </Col>
                            <Col md="6">
                                {
                                    applicant.is_owner_operator &&
                                    <ViewDetails
                                        default={t("NONE")}
                                        obj={{
                                            equipment_owned: {
                                                show: applicant.is_owner_operator || false,
                                                items: applicant.equipment_owned?.map(v => ({
                                                    type: v.type == JobEquipmentType.OTHER ? v.type_other : t(`JobEquipmentType.${v.type}`),
                                                    quantity: v.quantity
                                                }))
                                            }
                                        }}
                                    />
                                }

                            </Col>
                        </Row>
                    </ViewCard>
                </Col>
            </Row>
            <Row>
                <Col md="4">
                    <ViewCard title="WORK_HISTORY">
                        {!applicant.employers?.length &&
                            <>{t("NONE")}</>
                        }
                        {
                            <>
                                {applicant.employers?.map((e, i) => (
                                    <Accordion
                                        defaultExpanded={i === 0}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ArrowsExpand />}
                                        >
                                            {e.name || t("UNKNOWN")}
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <ViewDetails
                                                key={i}
                                                default={t("NOT_ANSWERED")}
                                                obj={{
                                                    NAME: e.name,
                                                    DATES_EMPLOYED: dateRange(e.start_at, e.end_at, t("PRESENT")),
                                                    TITLE: e.title,
                                                    ADDRESS: buildAddress(e),
                                                    PHONE: e.phone,
                                                    MAY_CONTACT_COMPANY: e.can_contact,
                                                    SUBJECT_TO_FMCSRS: e.is_subject_to_fmcsrs,
                                                    JOB_DESIGNATED_AS_SATEFY_SENSITIVE: e.is_subject_to_drug_tests
                                                }}
                                            />
                                        </AccordionDetails>
                                    </Accordion>
                                ))}</>}
                    </ViewCard>
                </Col>
                <Col md="8">
                    <ViewCard title="SAFETY_BACKGROUND">
                        <Row>
                            <Col md="6">
                                <ViewDetails
                                    default={t("NOT_ANSWERED")}
                                    obj={{
                                        CAN_PASS_DRUG_TEST: applicant.can_pass_drug_test,
                                        HAS_DUIS: applicant.has_past_dui,
                                        years_of_past_duis: {
                                            show: !!applicant.has_past_dui,
                                            text: applicant.dui_years
                                        },
                                        criminal_history_last_3_years: applicant.criminal_history,
                                        accidents_last_5_years: applicant.accident_count,
                                        accident_details: {
                                            show: applicant.accident_count > 0,
                                            text: applicant.accident_details
                                        }
                                    }}
                                />
                            </Col>
                            <Col md="6">
                                <ViewDetails
                                    default={t("NOT_ANSWERED")}
                                    obj={{
                                        has_had_license_revoked: applicant.license_revoked,
                                        license_revoked_details: {
                                            label: "details",
                                            show: !!applicant.license_revoked,
                                            text: applicant.license_revoked_details
                                        },
                                        has_had_psp_violations: applicant.psp_violations,
                                        violations_details: {
                                            label: "details",
                                            show: !!applicant.psp_violations,
                                            text: applicant.psp_violations_details
                                        },
                                        has_had_tickets_last_5_years: applicant.tickets,
                                        tickets_details: {
                                            label: "details",
                                            show: !!applicant.tickets,
                                            text: applicant.tickets_details
                                        },
                                        has_had_positive_drug_test: applicant.positive_drug_test,
                                        failed_drug_test_details: {
                                            label: "details",
                                            show: !!applicant.positive_drug_test,
                                            text: applicant.positive_drug_test_details
                                        },
                                    }}
                                />
                            </Col>
                        </Row>
                    </ViewCard>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <ViewCard title="JOBS_APPLIED_TO_WITH_YOU">
                        <ViewTable
                            type="JOBS"
                            headers={{
                                title: "JOB",
                                status: "STATUS",
                                date_applied: "DATE_APPLIED"
                            }}
                            items={applicant?.jobs?.map(aJob => ({
                                title: <Link href={`/jobs/${aJob.job.id}/${aJob.job.title}`}><a>{aJob.job.title}</a></Link>,
                                status: <ShowEnumFromString skipLowerCase popover={true} str={aJob.status} labelPrefix="ApplicantStatus" enumArray={ApplicantStatus} />,
                                date_applied: new Date(aJob.created_at).toDateString()
                            }))}
                        />
                    </ViewCard>
                </Col>
                {applicant &&
                    <Col md="6">
                        <ViewCard title={t("CONSIDER_{name}_FOR", { name: applicant?.first_name })}>
                            <ViewTable
                                type="OTHER_ROLES"
                                headers={{
                                    role: "ROLE"
                                }}
                                items={applicantSuggestedJobs.map(sJob => ({
                                    role: <Link href={`/jobs/${sJob.job.id}/${sJob.job.title}`}><a>{sJob.job.title}</a></Link>
                                }))}
                            />
                        </ViewCard>
                    </Col>
                }
            </Row>
            <Row>
                <Col md="12">
                    <ViewCard title="UPLOADED_DOCUMENTS">
                        <ViewTable
                            type="DOCUMENTS"
                            headers={{
                                type: "TYPE",
                                document: "DOCUMENT",
                                date_added: "DATE_ADDED"
                            }}
                            items={
                                applicant?.documents?.map(document => ({
                                    type: t(`ApplicantDocumentType.${document.type}`),
                                    document: <a onClick={() => viewDocumentClick(document.id, document.name)} href="#">{document.name}</a>,
                                    date_added: new Date(document.created_at).toDateString()
                                }))}
                        />
                    </ViewCard>
                </Col>
                <Col md="12">
                    <ViewCard title="NOTES">
                        <ViewTable
                            type="NOTES"
                            headers={{
                                notes: "NOTES",
                                user: "USER",
                                date: "DATE",
                                action: <a className="font-weight-bold" role="button" onClick={handleNoteModalShow}><PlusLg /></a>
                            }}
                            items={applicant?.notes?.map(v => ({
                                notes: v.text,
                                user: `${v.user.first_name} ${v.user.last_name}`,
                                date: new Date(v.created_at).toDateString(),
                                action: <>
                                    <a className="mr-2 font-weight-bold" role="button" onClick={() => { editNoteClick(v.id) }}><Pencil /></a>
                                    <a className="mr-2font-weight-bold" role="button" onClick={() => { deleteNoteClick(v.id) }}><Trash /></a>
                                </>
                            }))}
                        />

                    </ViewCard>
                </Col>
            </Row>
            <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />
            <ViewModal title={t(addNoteForm.values?.id ? "EDIT_{name}" : "ADD_{name}", { name: t("NOTE") })} show={addNoteVisible} onCloseClick={handleNoteModalClose}>
                <form onSubmit={addNoteForm.handleSubmit}>
                    <Row>
                        <Col>
                            <BaseTextArea
                                label={t("NOTE")}
                                name="text"
                                placeholder={t("NOTES")}
                                required
                                formik={addNoteForm}
                            />
                        </Col>
                    </Row>
                    <Row className="mt-1">
                        <Col xs="2" className="">
                            <Button type="submit">{t("SAVE")}</Button>
                        </Col>
                    </Row>

                </form>

            </ViewModal>
            <ViewModal
                title="CONFIRMATION"
                show={showConfirmationModal}
                onCloseClick={() => setShowConfirmationModal(false)}
                footer=
                {
                    <button type="button" className="btn btn-primary w-100 p-lg-3 p-5 mx-2" onClick={handleConfirmClick}>{t('CONFIRM')}</button>
                }
            >
                <p className="m-3">
                    {t('NOTE_DELETION_CONFIRMATION')}
                </p>
            </ViewModal>

        </ChildPageLayout >);
}

ViewApplicant.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

export async function getServerSideProps(context) {
    try {
        const id = +context.params?.id;
        if (!id)
            return { notFound: true }

        return {
            props: { id: id }
        }
    } catch (error) {
        console.error("ViewApplicant error:", error);
        return { props: { id: null } }
    }
}
