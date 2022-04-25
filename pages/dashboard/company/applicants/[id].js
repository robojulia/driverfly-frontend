import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast, ToastContainer } from "react-toastify";

import { useRouter } from "next/router";
import Link from 'next/link';

import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import React, { useState } from "react";
import ApplicantApi from "../../../api/applicant";
import DocumentApi from "../../../api/document";
import { Button, Col, Row } from "react-bootstrap";
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import ViewDetails from "../../../../components/viewDetails/viewDetails";
import { useEffectAsync } from "../../../../utils/react";

import { JobEquipmentType } from '../../../../enums/jobs/job-equipment-type.enum';
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";

import { calculateAge, dateRange } from "../../../../utils/date";
import { buildAddress } from "../../../../utils/common";
import { ApplicantStatus } from "../../../../enums/applicants/ApplicantStatus.enum";

import ShowEnumFromString from "../../../../components/enum-filters/show-enum-from-string";
import ViewTable from "../../../../components/viewDetails/viewTable";
import ViewPdf from "../../../../components/viewDetails/viewPdf";
import ViewCard from "../../../../components/viewDetails/viewCard";
import { useTranslation } from "react-i18next";
import AddIcon from '@mui/icons-material/Add';
import { useFormik } from "formik";
import * as yup from "yup";
import "../../../../utils/yup";
import ViewModal from "../../../../components/viewDetails/viewModal";
import BaseTextArea from "../../../../components/forms/BaseTextArea";

export default function Applicant() {
    const router = useRouter();

    let { t } = useTranslation();

    let { id } = router.query;

    /**
     * @type {ApplicantEntity}
     */
    const APPLICANT_PROTO = {};

    const [ applicant, setApplicant ] = useState(APPLICANT_PROTO);

    useEffectAsync(async () => {
        if (id) {
            const api = new ApplicantApi();

            const data = await api.company.getById(id);

            if (!data) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: t("APPLICANT") }));
                return;
            }

            setApplicant(data);
        }
    }, [ id ]);

    const [ pdf, setPdf ] = useState({});

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

    const addNoteForm = useFormik({
        initialValues: {
            text: null
        },
        validationSchema: yup.object({
            text: yup.string().required(t("this_field_is_required")).nullable()
        }),
        onSubmit: async (values) => {
            const api = new ApplicantApi();

            const note = await api.company.createNote(applicant.id, { text: values.text });

            addNoteForm.setValues({
                text: null
            });
            setAddNoteVisible(false);
            setApplicant({
                ...applicant,
                notes: [
                    ...applicant.notes,
                    note
                ]
            });
        }
    });

    const [ addNoteVisible, setAddNoteVisible ] = useState(false);

    const addNoteClick = () => {
        setAddNoteVisible(true);
    }

    return (
        <>
            <ToastContainer />
            <div>
                <h2>
                    <span style={{cursor: "pointer"}} onClick={router.back}>
                         <ArrowBackIosNew />
                         {t("GO_BACK")}
                    </span>
                </h2>
                <div className="container-fluid mt-2">
                    <Row>
                        <Col>
                            <ViewCard title={`${applicant?.first_name} ${applicant?.last_name}`}>
                                <Row>
                                    <Col md="4" className="px-2">
                                        <ViewDetails
                                            default={t("NOT_ANSWERED")}
                                            obj={{
                                                PHONE: applicant.phone,
                                                EMAIL: applicant.email,
                                                STREET: applicant.street,
                                                CITY: applicant.city,
                                                STATE_AND_ZIP: `${applicant.user?.state || ""} ${applicant.user?.zip_code || ""}`.trim()
                                            }}
                                                />
                                    </Col>
                                    <Col md="4" className="px-2">
                                        <ViewDetails
                                            default={t("NOT_ANSWERED")}
                                            obj={{
                                                driver_license_number: applicant.license_number,
                                                expiration_date: applicant.license_expiry,
                                                state_issued: applicant.license_state,
                                                cdl_class_type: applicant.license_type ? t(`DriverLicenseType.${applicant.license_type}`) : null,
                                                years_cdl_experience: applicant.years_cdl_experience,
                                                equipment_experience: {
                                                    default: t("NONE"),
                                                    items: applicant.experiences?.map(v => ({
                                                        type: v.type == JobEquipmentType.OTHER ? v.type_other : t(`JobEquipmentType.${v.type}`),
                                                        years: v.years
                                                    }))
                                                },
                                                owner_operator: { text: applicant.is_owner_operator, default: t("UNKNOWN") },
                                                equipment_owned: {
                                                    show: applicant.is_owner_operator || false,
                                                    default: t("NONE"),
                                                    items: applicant.equipment?.map(v => ({
                                                        type: v.type == JobEquipmentType.OTHER ? v.type_other : t(`JobEquipmentType.${v.type}`),
                                                        quantity: v.quantity
                                                    }))
                                                }
                                            }}
                                                />
                                    </Col>
                                    <Col md="4" className="px-2">
                                        <ViewDetails
                                            default={t("NOT_ANSWERED")}
                                            obj={{
                                                transmission_type: applicant.transmission_type,
                                                ENDORSEMENTS: applicant.endorsements,
                                                above_21: applicant.birthdate ? calculateAge(applicant.birthdate) >= 21 : null,
                                                highest_degree: applicant.highest_degree ? t(`DriverDegree.${applicant.highest_degree}`) : null,
                                                emergency_contact: applicant.emergency_contact_name,
                                                phone: applicant.emergency_contact_number,
                                                relationship: applicant.emergency_contact_relationship,
                                                AUTHORIZED_TO_WORK_IN_THE_US: applicant.authorized_to_work_in_us
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </ViewCard>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4">
                            <ViewCard title="WORK_HISTORY">
                                {!applicant.employers?.length &&
                                    t("NONE")
                                }
                                {applicant.employers?.map((e, i) => (
                                    <Accordion
                                        defaultExpanded={i === 0}
                                        >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
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
                                ))}
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
                                                has_has_psp_violations: applicant.psp_violations,
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
                        <Col md="5">
                            <ViewCard title="JOBS_APPLIED_TO_WITH_YOU">
                                <ViewTable
                                    type="JOBS"
                                    headers={{
                                        title: "JOB",
                                        status: "STATUS",
                                        date_applied: "DATE_APPLIED"
                                    }}
                                    items={applicant?.other_applications?.map(a => ({
                                        title: <Link href={`/jobs/${a.job.id}`}><a>{a.job.title}</a></Link>,
                                        status: <ShowEnumFromString skipLowerCase popover={true} str={a.status} labelPrefix="ApplicantStatus" enumArray={ApplicantStatus} />,
                                        date_applied: new Date(a.created_at).toDateString()
                                    }))}
                                />
                            </ViewCard>
                        </Col>
                        {applicant &&
                        <Col md="6" className="offset-md-1">
                            <ViewCard title={t("CONSIDER_{name}_FOR", { name: applicant?.first_name })}>
                            <ViewTable
                                    type="OTHER_ROLES"
                                    headers={{
                                        role: "ROLE",
                                        consider: null
                                    }}
                                    items={[]}
                                />
                            </ViewCard>
                        </Col>
                        }
                    </Row>
                    <Row>
                        <Col md="5">
                            <ViewCard title="UPLOADED_DOCUMENTS">
                                <ViewTable
                                    type="DOCUMENTS"
                                    headers={{
                                        document: "DOCUMENT",
                                        date_added: "DATE_ADDED"
                                    }}
                                    items={["resume", "drivers_license", "medical_card"]
                                        .map((v, i) => {
                                            const document = applicant && applicant[v];
                                            if (document)
                                                return {
                                                    document: <a onClick={() => viewDocumentClick(document.id, v.toUpperCase())} href="#">{t(v.toUpperCase())}</a>,
                                                    date_added: new Date(document.created_at).toDateString()
                                                };
                                        })
                                        .filter(v => !!v)}
                                    />
                            </ViewCard>
                        </Col>
                        <Col md="6" className="offset-md-1">
                            <ViewCard title="NOTES">
                                <ViewTable
                                    type="NOTES"
                                    headers={{
                                        notes: "NOTES",
                                        user: "USER",
                                        date: "DATE",
                                        add: <a href="#" onClick={addNoteClick}><AddIcon /></a>
                                    }}
                                    items={applicant?.notes?.map(v => ({
                                        notes: v.text,
                                        user: `${v.user.first_name} ${v.user.last_name}`,
                                        date: new Date(v.created_at).toDateString()
                                    }))}
                                    />

                            </ViewCard>
                        </Col>
                    </Row>
                </div>
            </div>
            <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />
            <ViewModal title={t("ADD_{name}", {name: t("NOTE") })} show={addNoteVisible} onCloseClick={() => setAddNoteVisible(false)}>
                <form onSubmit={addNoteForm.handleSubmit}>
                    <Row>
                        <Col>
                        <BaseTextArea
                            label={t("NOTE")}
                            name="text"
                            placeholder={t("NOTES")}
                            required
                            touched={addNoteForm.touched.text}
                            error={addNoteForm.errors.text}
                            onChange={addNoteForm.handleChange}
                            handleBlur={addNoteForm.handleBlur}
                            />
                        </Col>
                    </Row>
                    <Row className="mt-1">
                        <Col xs="2" className="offset-10">
                            <Button type="submit">{t("SAVE")}</Button>
                        </Col>
                    </Row>

                </form>

            </ViewModal>
        </>
    );
}

Applicant.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

/**

 */