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
import ViewApplicantDetail from "../../../../../components/applicants/view-applicant-details";
import WorkHistory from "../../../../../components/applicants/work-history";
import SafetyBackground from "../../../../../components/applicants/safet-background";
import JobsApplicant from "../../../../../components/applicants/jobs-applied";
import ConsiderFor from "../../../../../components/applicants/consider-applicant-for";
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

            setApplicant({
                ...data,
                notes: data.notes.sort((a, b) => (b.id - a.id))
            });
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
                const applicantApi = new ApplicantApi();
                let note: ApplicantNoteEntity;
                let notes: ApplicantNoteEntity[] = applicant.notes;

                if (values.id) {
                    note = await applicantApi.notes.update(applicant.id, values.id, values);
                    notes = applicant.notes.filter(v => (v.id !== note.id))
                } else {
                    note = await applicantApi.notes.create(applicant.id, values);
                }
                notes.push(note)

                handleNoteModalClose()
                setApplicant({
                    ...applicant,
                    notes: notes.sort((a, b) => (b.id - a.id))
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
            const response = await applicantApi.notes.remove(applicant.id, noteId);

            if (response.affected) {
                const notes = applicant.notes.filter(v => (v.id !== noteId))
                setApplicant({
                    ...applicant,
                    notes: notes.sort((a, b) => (b.id - a.id))
                })
            }

            // applicant.notes.sort((a, b) => (a.id - b.id))

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
                        <div style={{ float: "right", marginBottom: "10px" }} className="assign_unassign">
                            <ButtonGroup size="sm">


                                {
                                    applicant?.assignedUser ?
                                        <Button type="button" variant='danger' onClick={onUnassignClick}>
                                            <BookmarkDash /> {t("UNASSIGN")}
                                        </Button>
                                        :
                                        <Button type="button" className='theme-general-btn' variant='' onClick={onAssignClick}>
                                            <BookmarkCheck /> {t("ASSIGN_TO_ME")}
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
                    <ViewApplicantDetail applicant={applicant} protectedFields={protectedFields}/>
                </Col>
            </Row>
            <Row>
                <Col md="4">
                 <WorkHistory applicant={applicant}/>
                </Col>
                <Col md="8">
                 <SafetyBackground applicant={applicant} />
                </Col>
            </Row>
            <Row>
                <Col md="6">
                  <JobsApplicant applicant={applicant}/>
                </Col>
                {applicant &&
                    <Col md="6">
                        <ConsiderFor applicant={applicant} applicantSuggestedJobs={applicantSuggestedJobs}/>
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
