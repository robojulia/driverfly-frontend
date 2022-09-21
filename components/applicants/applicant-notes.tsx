import { Accordion, Button, Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { JobEntity } from "../../models/job/job.entity";
import React from 'react';
import ViewModal from '../viewDetails/viewModal';
import { useAuth } from '../../hooks/useAuth'
import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum';
import applicant, { ApplicantApi } from '../../pages/api/applicant';
import { calculateAge, dateRange } from '../../utils/date';
import ViewCard from '../viewDetails/viewCard';
import ViewDetails from '../viewDetails/viewDetails';
import { AccordionSummary, AccordionDetails } from '@mui/material';
import { ArrowsExpand, Link, Pencil, PlusLg, Trash } from 'react-bootstrap-icons';
import { buildAddress } from '../../utils/common';
import { ApplicantStatus } from '../../enums/applicants/applicant-status.enum';
import ShowEnumFromString from '../enum-filters/show-enum-from-string';
import ViewTable from '../viewDetails/viewTable';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { ApplicantNoteEntity } from '../../models/applicant/applicant-note.entity';
import { globalAjaxExceptionHandler } from '../../utils/ajax';
import BaseTextArea from '../forms/BaseTextArea';


export interface AppplicantNotesProps {
    className?: string;
    job: JobEntity;
    relatedJobs?: React.ReactNode;
    canApply?: boolean | (() => boolean);
    canSave?: boolean | (() => boolean);
    hideVehicles?: boolean | (() => boolean);
    hideCompanyName?: boolean | (() => boolean);
    hideSocialLinks?: boolean | (() => boolean);
    viewAllJobsLink?: string;
}


export default function AppplicantNotes({ applicant }) {

    const { t } = useTranslation();
    const [encourageModal, setEncourageModal] = React.useState(false)
    const { user } = useAuth();
    
    const [addNoteVisible, setAddNoteVisible] = useState(false);
    const showNoteModal = () => setAddNoteVisible(true)
    const hideNoteModal = () => setAddNoteVisible(false)


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
                // setApplicant({
                //     ...applicant,
                //     notes: notes.sort((a, b) => (b.id - a.id))
                // });
                resetForm()
            } catch (e) {
                globalAjaxExceptionHandler(e, { t: t, defaultMessage: "UNABLE_TO_SAVE", toast: toast });
            }

        }
    });
    
    const handleNoteModalShow = () => {
        addNoteForm.setValues({ text: null })
        showNoteModal()
    }
    const handleNoteModalClose = () => {
        addNoteForm.setValues({ text: null })
        hideNoteModal()
    }

    return (
        <>
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
        </>
    )
}
function useState(arg0: boolean): [any, any] {
    throw new Error('Function not implemented.');
}

function editNoteClick(id: any) {
    throw new Error('Function not implemented.');
}

function deleteNoteClick(id: any) {
    throw new Error('Function not implemented.');
}

